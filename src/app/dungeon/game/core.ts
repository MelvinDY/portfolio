// ── the hidden dev dungeon · pure game logic (no three / react imports) ──

export type Vec = { x: number; z: number }
export const key = (v: Vec) => `${v.x},${v.z}`
export const manhattan = (a: Vec, b: Vec) => Math.abs(a.x - b.x) + Math.abs(a.z - b.z)

export type Sprite = 'knight' | 'mage' | 'slime' | 'goblin' | 'skeleton' | 'boss' | 'ghost'

export type Ability = {
  id: string
  name: string
  desc: string
  range: number
  cd: number
  dmg?: number
  heal?: number
  shield?: number
}

export type Unit = {
  id: string
  name: string
  title: string
  faction: 'party' | 'foe' | 'neutral'
  sprite: Sprite
  pos: Vec
  hp: number
  maxHp: number
  shield: number
  move: number
  abilities: Ability[]
  cooldowns: number[]
  moved: boolean
  acted: boolean
  roomId: number
  flavor: string
}

export type Item = {
  id: string
  name: string
  desc: string
  pos: Vec | null // null = in inventory / consumed
  effect: 'heal' | 'shield'
}

export type Room = { id: number; x: number; z: number; w: number; h: number }
export type Torch = { x: number; z: number; dx: number; dz: number }

export type Dungeon = {
  w: number
  h: number
  cells: Uint8Array // 0 wall · 1 floor
  rooms: Room[] // 0 entry · 1 den · 2 guard hall · 3 boss vault
  torches: Torch[]
}

// mulberry32 — tiny seeded rng so each run is its own arrangement
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const W = 26
export const H = 18
const idx = (x: number, z: number) => z * W + x
export const inBounds = (x: number, z: number) => x >= 0 && z >= 0 && x < W && z < H
export const isFloor = (d: Dungeon, x: number, z: number) => inBounds(x, z) && d.cells[idx(x, z)] === 1

export function genDungeon(seed: number): Dungeon {
  const r = rng(seed)
  const ri = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))
  const cells = new Uint8Array(W * H)

  const slot = (id: number, x0: number, x1: number, z0: number, z1: number, wLo: number, wHi: number, hLo: number, hHi: number): Room => {
    const w = ri(wLo, wHi)
    const h = ri(hLo, hHi)
    const x = ri(x0, Math.max(x0, x1 - w))
    const z = ri(z0, Math.max(z0, z1 - h))
    return { id, x, z, w, h }
  }

  const rooms: Room[] = [
    slot(0, 2, 9, 12, 16, 5, 6, 4, 5), // entry — bottom left
    slot(1, 2, 9, 2, 8, 6, 7, 5, 6), // the den — top left
    slot(2, 11, 17, 10, 16, 5, 6, 5, 6), // guard hall — bottom middle
    slot(3, 18, 24, 2, 9, 6, 7, 5, 6), // boss vault — top right
  ]

  const carve = (x: number, z: number) => {
    if (x > 0 && z > 0 && x < W - 1 && z < H - 1) cells[idx(x, z)] = 1
  }
  for (const rm of rooms)
    for (let z = rm.z; z < rm.z + rm.h; z++)
      for (let x = rm.x; x < rm.x + rm.w; x++) carve(x, z)

  const center = (rm: Room): Vec => ({ x: rm.x + (rm.w >> 1), z: rm.z + (rm.h >> 1) })
  const corridor = (a: Vec, b: Vec) => {
    // L-shaped, carved 2 wide so the party can walk side by side
    const horizontalFirst = r() < 0.5
    let { x, z } = a
    const stepX = () => {
      while (x !== b.x) {
        x += Math.sign(b.x - x)
        carve(x, z)
        carve(x, z + 1)
      }
    }
    const stepZ = () => {
      while (z !== b.z) {
        z += Math.sign(b.z - z)
        carve(x, z)
        carve(x + 1, z)
      }
    }
    if (horizontalFirst) {
      stepX()
      stepZ()
    } else {
      stepZ()
      stepX()
    }
  }
  corridor(center(rooms[0]), center(rooms[1]))
  corridor(center(rooms[1]), center(rooms[2]))
  corridor(center(rooms[2]), center(rooms[3]))

  const torches: Torch[] = []
  for (let z = 1; z < H - 1; z++)
    for (let x = 1; x < W - 1; x++) {
      if (cells[idx(x, z)] !== 1) continue
      if (torches.length >= 16) break
      // hang torches on north-facing walls at a loose rhythm
      if (cells[idx(x, z - 1)] === 0 && (x * 7 + z * 13) % 5 === 0) torches.push({ x, z, dx: 0, dz: -1 })
      else if (cells[idx(x - 1, z)] === 0 && (x * 11 + z * 5) % 7 === 0) torches.push({ x, z, dx: -1, dz: 0 })
    }

  return { w: W, h: H, cells, rooms, torches }
}

// ── pathfinding ──────────────────────────────────────────────────────────

const DIRS: Vec[] = [
  { x: 1, z: 0 },
  { x: -1, z: 0 },
  { x: 0, z: 1 },
  { x: 0, z: -1 },
]

/** BFS shortest path (excluding start). `allowGoal` lets an occupied goal tile be the terminal step. */
export function bfsPath(d: Dungeon, blocked: Set<string>, from: Vec, to: Vec, allowGoal = false): Vec[] | null {
  if (from.x === to.x && from.z === to.z) return []
  const prev = new Map<string, string>()
  const seen = new Set<string>([key(from)])
  const q: Vec[] = [from]
  while (q.length) {
    const cur = q.shift() as Vec
    for (const dir of DIRS) {
      const nx = cur.x + dir.x
      const nz = cur.z + dir.z
      const k = `${nx},${nz}`
      if (seen.has(k) || !isFloor(d, nx, nz)) continue
      const isGoal = nx === to.x && nz === to.z
      if (blocked.has(k) && !(allowGoal && isGoal)) continue
      seen.add(k)
      prev.set(k, key(cur))
      if (isGoal) {
        const path: Vec[] = []
        let walk = k
        while (walk !== key(from)) {
          const [px, pz] = walk.split(',').map(Number)
          path.unshift({ x: px, z: pz })
          walk = prev.get(walk) as string
        }
        return path
      }
      q.push({ x: nx, z: nz })
    }
  }
  return null
}

/** all tiles reachable within `range` steps */
export function reachable(d: Dungeon, blocked: Set<string>, from: Vec, range: number): Vec[] {
  const out: Vec[] = []
  const seen = new Set<string>([key(from)])
  let frontier: Vec[] = [from]
  for (let step = 0; step < range; step++) {
    const next: Vec[] = []
    for (const cur of frontier)
      for (const dir of DIRS) {
        const nx = cur.x + dir.x
        const nz = cur.z + dir.z
        const k = `${nx},${nz}`
        if (seen.has(k) || !isFloor(d, nx, nz) || blocked.has(k)) continue
        seen.add(k)
        const v = { x: nx, z: nz }
        out.push(v)
        next.push(v)
      }
    frontier = next
  }
  return out
}

/** Bresenham line of sight — walls block, endpoints don't */
export function hasLOS(d: Dungeon, a: Vec, b: Vec): boolean {
  let x = a.x
  let z = a.z
  const dx = Math.abs(b.x - a.x)
  const dz = Math.abs(b.z - a.z)
  const sx = a.x < b.x ? 1 : -1
  const sz = a.z < b.z ? 1 : -1
  let err = dx - dz
  for (;;) {
    if (x === b.x && z === b.z) return true
    if (!(x === a.x && z === a.z) && !isFloor(d, x, z)) return false
    const e2 = 2 * err
    if (e2 > -dz) {
      err -= dz
      x += sx
    }
    if (e2 < dx) {
      err += dx
      z += sz
    }
  }
}

// ── world population ─────────────────────────────────────────────────────

export type World = { dun: Dungeon; units: Unit[]; items: Item[] }

const ab = (id: string, name: string, desc: string, range: number, cd: number, extra: Partial<Ability>): Ability => ({
  id,
  name,
  desc,
  range,
  cd,
  ...extra,
})

export function makeWorld(seed: number): World {
  const dun = genDungeon(seed)
  const r = rng(seed ^ 0x9e3779b9)
  const taken = new Set<string>()

  const freeTile = (rm: Room): Vec => {
    for (let tries = 0; tries < 80; tries++) {
      const v = {
        x: rm.x + 1 + Math.floor(r() * Math.max(1, rm.w - 2)),
        z: rm.z + 1 + Math.floor(r() * Math.max(1, rm.h - 2)),
      }
      if (isFloor(dun, v.x, v.z) && !taken.has(key(v))) {
        taken.add(key(v))
        return v
      }
    }
    // fall back to a scan
    for (let z = rm.z; z < rm.z + rm.h; z++)
      for (let x = rm.x; x < rm.x + rm.w; x++)
        if (isFloor(dun, x, z) && !taken.has(`${x},${z}`)) {
          taken.add(`${x},${z}`)
          return { x, z }
        }
    return { x: rm.x, z: rm.z }
  }

  const [entry, den, guard, vault] = dun.rooms
  const units: Unit[] = []

  const hero = (id: string, name: string, title: string, sprite: Sprite, hp: number, abilities: Ability[], flavor: string): Unit => ({
    id,
    name,
    title,
    faction: 'party',
    sprite,
    pos: freeTile(entry),
    hp,
    maxHp: hp,
    shield: 0,
    move: 4,
    abilities,
    cooldowns: abilities.map(() => 0),
    moved: false,
    acted: false,
    roomId: entry.id,
    flavor,
  })

  units.push(
    hero(
      'bram',
      'Bram',
      'the Codewarden',
      'knight',
      30,
      [
        ab('slash', 'slash', 'a heavy melee swing', 1, 0, { dmg: 7 }),
        ab('axe', 'hurled axe', 'a thrown hatchet', 3, 2, { dmg: 4 }),
        ab('bulwark', 'bulwark', 'shield an ally (or yourself)', 2, 3, { shield: 8 }),
      ],
      'sworn to guard the main branch',
    ),
    hero(
      'nyx',
      'Nyx',
      'the Query Witch',
      'mage',
      24,
      [
        ab('bonk', 'staff bonk', 'a reluctant melee poke', 1, 0, { dmg: 3 }),
        ab('ember', 'emberbolt', 'a searing ranged bolt', 5, 2, { dmg: 6 }),
        ab('mend', 'mend', 'stitch an ally back together', 4, 3, { heal: 8 }),
      ],
      'she SELECTs her targets carefully',
    ),
  )

  let foeSeq = 0
  const foe = (name: string, title: string, sprite: Sprite, hp: number, move: number, rm: Room, abilities: Ability[], flavor: string): Unit => ({
    id: `foe${foeSeq++}`,
    name,
    title,
    faction: 'foe',
    sprite,
    pos: freeTile(rm),
    hp,
    maxHp: hp,
    shield: 0,
    move,
    abilities,
    cooldowns: abilities.map(() => 0),
    moved: false,
    acted: false,
    roomId: rm.id,
    flavor,
  })

  const slime = (rm: Room) =>
    foe('Null Slime', 'undefined menace', 'slime', 10, 3, rm, [ab('glorp', 'corrosive glorp', '', 1, 0, { dmg: 3 })], 'it exists, and yet it is null. do not dereference.')
  const goblin = (rm: Room) =>
    foe('Lint Goblin', 'style enforcer', 'goblin', 8, 3, rm, [ab('sling', 'rusty sling', '', 3, 0, { dmg: 3 })], 'shrieks about trailing whitespace. throws rocks about it too.')
  const skeleton = (rm: Room) =>
    foe('Deprecated Skeleton', 'still technically supported', 'skeleton', 14, 2, rm, [ab('claw', 'bone claw', '', 1, 0, { dmg: 5 })], 'flagged for removal three majors ago. still here.')

  units.push(slime(den), slime(den))
  units.push(goblin(guard), slime(guard), skeleton(guard))
  units.push(
    foe(
      'The Legacy Codebeast',
      'boss of the vault',
      'boss',
      42,
      2,
      vault,
      [ab('crush', 'monolith crush', '', 1, 0, { dmg: 7 }), ab('lash', 'spaghetti lash', '', 3, 2, { dmg: 4 })],
      'nobody remembers who wrote it. nobody dares to refactor it.',
    ),
    goblin(vault),
  )

  units.push({
    id: 'puck',
    name: 'Puck',
    title: "the intern's ghost",
    faction: 'neutral',
    sprite: 'ghost',
    pos: freeTile(den),
    hp: 1,
    maxHp: 1,
    shield: 0,
    move: 0,
    abilities: [],
    cooldowns: [],
    moved: false,
    acted: false,
    roomId: den.id,
    flavor: 'an unmerged branch given form',
  })

  const items: Item[] = [
    { id: 'brew', name: 'cold brew of vigor', desc: 'heals your most wounded hero for 10', pos: freeTile(den), effect: 'heal' },
    { id: 'duck', name: 'rubber duck of debugging', desc: 'explains the problem — both heroes gain 6 shield', pos: freeTile(guard), effect: 'shield' },
  ]

  return { dun, units, items }
}
