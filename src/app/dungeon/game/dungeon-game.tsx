"use client"

// ── the hidden dev dungeon ──────────────────────────────────────────────
// an isometric, mouse-only, turn-based easter egg. you found the source
// too — that's two secrets.

import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import {
  makeWorld, bfsPath, reachable, hasLOS, manhattan, key, isFloor, inRoom,
  type Unit, type Item, type Vec, type Ability, type World,
} from './core'

const ACID = '#ff5e1f'
const ISO_OFFSET = new THREE.Vector3(10, 12.5, 10)
const TILE_STEP_MS = 150

type Mode = 'explore' | 'combat' | 'dialogue' | 'victory' | 'defeat'

type Popup = { unitId: string; x: number; y: number } | null
type DlgChoice = { label: string; act: () => void }
type Dlg = { title: string; text: string; choices: DlgChoice[] }

type G = World & {
  inventory: Item[]
  mode: Mode
  selected: string
  pending: number | null
  round: number
  playerTurn: boolean
  combatRoom: number | null
  busy: boolean
  gaveGift: boolean
  dlg: Dlg | null
  log: string
  popup: Popup
  introSeen: boolean
  factOrder: number[]
  factI: number
  revealed: boolean // the dungeon stays dark until the party steps out the door
}

// doris has opinions and a good memory — all of this is true
const FACTS = [
  "the dev won FIRST PLACE at the csesoc 2025 flagship hackathon. built a real-time coding platform called onlycode. i don't know what that means but he seemed pleased.",
  "unihack 2026 — his team's game 'peersuade' took home BOTH 'most fun idea' and 'best design'. double trophies. we don't have room for trophies here.",
  "he once won a golden rubbish bin at the terrible ideas hackathon. ON PURPOSE. the game was called stall wars. he's weirdly proud of it.",
  "unsw computer science, sydney town. came all the way from indonesia to stare at charts.",
  "half analyst, half engineer, he says. sql and dashboards with one hand, react and node with the other.",
  "the stats page upstairs? built the whole analytics pipeline himself — tracker, api, database. trusts no third parties. respect.",
  "he reckons a good chart should make a room go 'oh'. i've seen it happen once. unsettling.",
  "this entire dungeon hides behind a nine-pixel dot on his name. he genuinely thought nobody would find it. yet here you are, drinking my ale.",
]

type MeshInfo = { grp: THREE.Group; body: THREE.Group; h: number; phase: number }
type Tween = { t0: number; dur: number; fn: (k: number) => void; res: () => void }

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)

// ── pixel textures (tiny canvases, nearest-filtered) ─────────────────────

function pixTex(size: number, draw: (px: (x: number, y: number, c: string) => void, rnd: () => number) => void): THREE.CanvasTexture {
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d') as CanvasRenderingContext2D
  let s = 1234
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const px = (x: number, y: number, c: string) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, 1, 1)
  }
  draw(px, rnd)
  const tex = new THREE.CanvasTexture(cv)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeTextures() {
  const floor = pixTex(16, (px, rnd) => {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const v = 0.75 + rnd() * 0.5
        px(x, y, `rgb(${Math.floor(52 * v)},${Math.floor(42 * v)},${Math.floor(36 * v)})`)
      }
    // grout lines
    for (let i = 0; i < 16; i++) {
      px(i, 0, '#241c18')
      px(0, i, '#241c18')
      px(i, 8, '#2b211c')
      px(8, i, '#2b211c')
    }
  })
  const wall = pixTex(16, (px, rnd) => {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const brickRow = y >> 2
        const shift = (brickRow % 2) * 4
        const isMortar = y % 4 === 0 || (x + shift) % 8 === 0
        const v = 0.8 + rnd() * 0.4
        px(x, y, isMortar ? '#191310' : `rgb(${Math.floor(66 * v)},${Math.floor(52 * v)},${Math.floor(43 * v)})`)
      }
  })
  const wallTop = pixTex(8, (px, rnd) => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) px(x, y, rnd() > 0.85 ? '#17110e' : '#100c0a')
  })
  // the tavern is warmer than the dungeon: plank floors, timbered plaster walls
  const tavFloor = pixTex(16, (px, rnd) => {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (y % 4 === 0) {
          px(x, y, '#3a2818') // plank seams
          continue
        }
        const v = 0.8 + rnd() * 0.4
        px(x, y, `rgb(${Math.floor(126 * v)},${Math.floor(88 * v)},${Math.floor(52 * v)})`)
      }
    // staggered plank joints
    for (let p = 0; p < 4; p++) {
      const jx = (p * 7 + 3) % 16
      for (let y = p * 4 + 1; y < p * 4 + 4; y++) px(jx, y, '#4a3420')
    }
  })
  const tavWall = pixTex(16, (px, rnd) => {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const beam = x < 2 || y < 2
        const v = 0.85 + rnd() * 0.3
        px(x, y, beam ? '#503a24' : `rgb(${Math.floor(184 * v)},${Math.floor(166 * v)},${Math.floor(134 * v)})`)
      }
  })
  return { floor, wall, wallTop, tavFloor, tavWall }
}

function faceTex(skin: string, eye: string, wide = false): THREE.CanvasTexture {
  return pixTex(8, (px) => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) px(x, y, skin)
    px(2, 3, eye)
    px(5, 3, eye)
    if (wide) {
      px(2, 4, eye)
      px(5, 4, eye)
    }
  })
}

// ── voxel-ish unit builders ──────────────────────────────────────────────

function lamb(color: string | number, opts: Partial<THREE.MeshLambertMaterialParameters> = {}) {
  return new THREE.MeshLambertMaterial({ color, ...opts })
}

function box(w: number, h: number, d: number, mat: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  return m
}

function headWithFace(size: number, skin: string, eye: string, y: number, wide = false): THREE.Mesh {
  const plain = lamb(skin)
  const face = new THREE.MeshLambertMaterial({ map: faceTex(skin, eye, wide) })
  // +z is the face; unit groups get rotated to face travel direction
  return box(size, size, size, [plain, plain, plain, plain, face, plain], 0, y, 0)
}

function makeUnitGroup(u: Unit): MeshInfo {
  const grp = new THREE.Group()
  const body = new THREE.Group()
  grp.add(body)
  let h = 1.2

  if (u.sprite === 'knight') {
    body.add(box(0.34, 0.22, 0.22, lamb('#3a3430'), 0, 0.11, 0))
    body.add(box(0.46, 0.36, 0.3, lamb('#8d8f98'), 0, 0.4, 0))
    body.add(box(0.5, 0.08, 0.34, lamb('#6e7078'), 0, 0.6, 0))
    body.add(headWithFace(0.3, '#d9a878', '#241a12', 0.82))
    body.add(box(0.08, 0.18, 0.08, lamb(ACID), 0, 1.05, 0)) // plume
    body.add(box(0.1, 0.34, 0.26, lamb('#5a4633'), 0.32, 0.42, 0)) // shield arm
    h = 1.25
  } else if (u.sprite === 'mage') {
    body.add(box(0.42, 0.52, 0.3, lamb('#5d3f85'), 0, 0.26, 0))
    body.add(headWithFace(0.28, '#e5b98c', '#221728', 0.68))
    body.add(box(0.52, 0.07, 0.52, lamb('#472f66'), 0, 0.85, 0)) // hat brim
    body.add(box(0.2, 0.24, 0.2, lamb('#472f66'), 0, 1.0, 0)) // hat tip
    body.add(box(0.06, 0.9, 0.06, lamb('#4a3828'), -0.3, 0.45, 0.08))
    body.add(box(0.12, 0.12, 0.12, new THREE.MeshBasicMaterial({ color: 0xffa438 }), -0.3, 0.95, 0.08))
    h = 1.25
  } else if (u.sprite === 'ranger') {
    body.add(box(0.34, 0.22, 0.22, lamb('#33402c'), 0, 0.11, 0))
    body.add(box(0.42, 0.34, 0.28, lamb('#3f5a3a'), 0, 0.39, 0))
    body.add(headWithFace(0.29, '#d9a878', '#20180f', 0.78))
    body.add(box(0.33, 0.1, 0.33, lamb('#2f4a2c'), 0, 0.96, 0)) // hood cap
    body.add(box(0.33, 0.3, 0.08, lamb('#2f4a2c'), 0, 0.78, -0.17)) // hood back
    body.add(box(0.05, 0.72, 0.05, lamb('#4a3828'), 0.3, 0.5, 0)) // bow stave
    h = 1.2
  } else if (u.sprite === 'cleric') {
    body.add(box(0.46, 0.5, 0.3, lamb('#cfc0a0'), 0, 0.25, 0))
    body.add(box(0.47, 0.08, 0.31, lamb(ACID), 0, 0.06, 0)) // hem trim
    body.add(headWithFace(0.29, '#e5b98c', '#2a1c12', 0.68))
    body.add(box(0.32, 0.07, 0.32, lamb('#8a7550'), 0, 0.86, 0)) // cap
    body.add(box(0.06, 0.5, 0.06, lamb('#4a3828'), -0.3, 0.45, 0))
    body.add(box(0.14, 0.14, 0.14, lamb('#9aa0a8'), -0.3, 0.75, 0)) // mace head
    h = 1.15
  } else if (u.sprite === 'keeper') {
    body.add(box(0.56, 0.44, 0.34, lamb('#6e4a2e'), 0, 0.22, 0))
    body.add(box(0.4, 0.36, 0.06, lamb('#d8cfc0'), 0, 0.24, 0.18)) // apron
    body.add(headWithFace(0.32, '#e0a878', '#241a12', 0.66))
    body.add(box(0.1, 0.1, 0.1, lamb('#f5c93a'), 0.34, 0.42, 0.1)) // mug, always
    h = 1.1
  } else if (u.sprite === 'slime') {
    body.add(headWithFace(0.6, '#59c135', '#173a0a', 0.3, true))
    h = 0.75
  } else if (u.sprite === 'goblin') {
    body.add(box(0.32, 0.3, 0.24, lamb('#5d6b34'), 0, 0.15, 0))
    body.add(headWithFace(0.34, '#7c8f42', '#1c220c', 0.5, true))
    body.add(box(0.06, 0.5, 0.06, lamb('#4a3828'), 0.26, 0.3, 0))
    h = 0.85
  } else if (u.sprite === 'skeleton') {
    body.add(box(0.3, 0.24, 0.18, lamb('#8f887a'), 0, 0.12, 0))
    body.add(box(0.38, 0.34, 0.24, lamb('#cfc9b8'), 0, 0.42, 0))
    body.add(headWithFace(0.28, '#e0dbcc', '#151210', 0.76))
    h = 1.1
  } else if (u.sprite === 'boss') {
    body.add(box(0.7, 0.4, 0.5, lamb('#3c2a24'), 0, 0.2, 0))
    body.add(box(0.95, 0.7, 0.62, lamb('#5b1f24'), 0, 0.72, 0))
    body.add(box(1.15, 0.14, 0.5, lamb('#43161a'), 0, 1.1, 0)) // shoulders
    body.add(headWithFace(0.42, '#732930', '#ffb03a', 1.4, true))
    body.add(box(0.1, 0.3, 0.1, lamb('#d8cfc0'), -0.28, 1.68, 0))
    body.add(box(0.1, 0.3, 0.1, lamb('#d8cfc0'), 0.28, 1.68, 0))
    h = 2.0
  } else {
    // ghost
    body.add(box(0.42, 0.6, 0.3, lamb('#cfd8e3', { transparent: true, opacity: 0.55 }), 0, 0.5, 0))
    body.add(headWithFace(0.3, '#dde5ee', '#3a4657', 0.95))
    h = 1.3
  }

  // fake blob shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(u.sprite === 'boss' ? 0.55 : 0.32, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.02
  grp.add(shadow)

  grp.position.set(u.pos.x, 0, u.pos.z)
  return { grp, body, h, phase: Math.random() * Math.PI * 2 }
}

// ── component ────────────────────────────────────────────────────────────

export default function DungeonGame() {
  const router = useRouter()
  const [, bump] = useReducer((c: number) => c + 1, 0)

  const mountRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const dissolveRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const gRef = useRef<G | null>(null)
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.OrthographicCamera
    renderer: THREE.WebGLRenderer
    raycaster: THREE.Raycaster
    ground: THREE.Plane
    meshes: Map<string, MeshInfo>
    lights: { l: THREE.PointLight; base: number; seed: number; tavern?: boolean }[]
    flames: THREE.Mesh[]
    hiPool: THREE.Mesh[]
    hover: THREE.Mesh
    ring: THREE.Mesh
    camGoal: THREE.Vector3
    camNow: THREE.Vector3
    zoom: number
  } | null>(null)
  const tweensRef = useRef<Tween[]>([])
  const hiMoveRef = useRef<Set<string>>(new Set())
  const dgnStaticRef = useRef<THREE.Object3D[]>([]) // dungeon geometry hidden until reveal
  const revealKRef = useRef(0) // 0 → dungeon lights dark · 1 → fully lit
  const mountedRef = useRef(true)
  const exitingRef = useRef(false)

  // lazily create game state so the seed differs per run without SSR concerns
  if (gRef.current === null) {
    gRef.current = {
      ...makeWorld((Math.random() * 2 ** 31) | 0),
      inventory: [],
      mode: 'explore',
      selected: 'bram',
      pending: null,
      round: 1,
      playerTurn: true,
      combatRoom: null,
      busy: false,
      gaveGift: false,
      dlg: null,
      log: 'the rubber duck inn hums. the dungeon waits beyond the door.',
      popup: null,
      introSeen: false,
      factOrder: Array.from({ length: FACTS.length }, (_, i) => i).sort(() => Math.random() - 0.5),
      factI: 0,
      revealed: false,
    }
  }
  const g = gRef.current
  // not a bug, a freebie — poke around, you found the dungeon after all
  if (typeof window !== 'undefined') (window as unknown as { __dgn?: G }).__dgn = g

  // ── helpers over game state ────────────────────────────────────────────

  const alive = (u: Unit) => u.hp > 0
  const heroes = () => g.units.filter((u) => u.faction === 'party' && alive(u))
  const foes = () => g.units.filter((u) => u.faction === 'foe' && alive(u))
  const engaged = () => foes().filter((u) => u.roomId === g.combatRoom)
  const unitAt = (v: Vec) => g.units.find((u) => alive(u) && u.pos.x === v.x && u.pos.z === v.z)
  const itemAt = (v: Vec) => g.items.find((i) => i.pos && i.pos.x === v.x && i.pos.z === v.z)
  const selectedHero = () => g.units.find((u) => u.id === g.selected && alive(u) && u.faction === 'party')
  const blockedSet = (except?: Unit) => {
    const s = new Set<string>()
    for (const u of g.units) if (alive(u) && u !== except) s.add(key(u.pos))
    for (const f of g.dun.furniture) s.add(`${f.x},${f.z}`)
    return s
  }
  const log = (msg: string) => {
    g.log = msg
  }

  // ── three setup ────────────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true
    const mount = mountRef.current
    if (!mount) return
    document.title = '??? — you found something'
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0705')
    scene.fog = new THREE.FogExp2(0x0a0705, 0.03)
    dgnStaticRef.current = []
    revealKRef.current = g.revealed ? 1 : 0

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(1)
    renderer.domElement.className = 'dgn-canvas'
    mount.appendChild(renderer.domElement)

    const texes = makeTextures()

    // ── level geometry ──
    // the tavern gets its own materials: plank floors and timbered walls
    const dun = g.dun
    const tav = dun.rooms[0]
    const floorTiles: Vec[] = []
    const tavFloorTiles: Vec[] = []
    const wallTiles: Vec[] = []
    const tavWallTiles: Vec[] = []
    for (let z = 0; z < dun.h; z++)
      for (let x = 0; x < dun.w; x++) {
        if (isFloor(dun, x, z)) {
          ;(inRoom(tav, { x, z }) ? tavFloorTiles : floorTiles).push({ x, z })
        } else {
          let nearFloor = false
          let nearTavern = false
          for (let dz = -1; dz <= 1; dz++)
            for (let dx = -1; dx <= 1; dx++)
              if (isFloor(dun, x + dx, z + dz)) {
                nearFloor = true
                if (inRoom(tav, { x: x + dx, z: z + dz })) nearTavern = true
              }
          if (nearFloor) (nearTavern ? tavWallTiles : wallTiles).push({ x, z })
        }
      }

    const tmpM = new THREE.Matrix4()
    const tmpC = new THREE.Color()
    const addFloors = (tiles: Vec[], tex: THREE.Texture): THREE.Object3D | null => {
      if (!tiles.length) return null
      const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.24, 1), lamb('#ffffff', { map: tex }), tiles.length)
      tiles.forEach((t, i) => {
        tmpM.setPosition(t.x, -0.12, t.z)
        m.setMatrixAt(i, tmpM)
        const v = 0.82 + ((t.x * 31 + t.z * 17) % 7) * 0.035
        m.setColorAt(i, tmpC.setRGB(v, v, v))
      })
      scene.add(m)
      return m
    }
    const dgnFloorMesh = addFloors(floorTiles, texes.floor)
    addFloors(tavFloorTiles, texes.tavFloor)

    const wallTopMat = lamb('#ffffff', { map: texes.wallTop })
    const addWalls = (tiles: Vec[], tex: THREE.Texture): THREE.Object3D | null => {
      if (!tiles.length) return null
      const side = lamb('#ffffff', { map: tex })
      const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1.7, 1), [side, side, wallTopMat, side, side, side], tiles.length)
      tiles.forEach((t, i) => {
        tmpM.setPosition(t.x, 0.73, t.z)
        m.setMatrixAt(i, tmpM)
        const v = 0.8 + ((t.x * 13 + t.z * 29) % 6) * 0.04
        m.setColorAt(i, tmpC.setRGB(v, v, v))
      })
      scene.add(m)
      return m
    }
    const dgnWallMesh = addWalls(wallTiles, texes.wall)
    addWalls(tavWallTiles, texes.tavWall)
    for (const o of [dgnFloorMesh, dgnWallMesh])
      if (o) {
        o.visible = g.revealed
        dgnStaticRef.current.push(o)
      }

    // ── torches + lights ──
    const flames: THREE.Mesh[] = []
    for (const t of dun.torches) {
      const sx = t.x + t.dx * 0.42
      const sz = t.z + t.dz * 0.42
      const stick = box(0.09, 0.34, 0.09, lamb('#4a3828'), sx, 1.0, sz)
      stick.rotation.z = t.dx * 0.35
      stick.rotation.x = -t.dz * 0.35
      scene.add(stick)
      const flame = box(0.16, 0.22, 0.16, new THREE.MeshBasicMaterial({ color: 0xffa438 }), sx - t.dx * 0.08, 1.24, sz - t.dz * 0.08)
      scene.add(flame)
      flames.push(flame)
      if (!inRoom(tav, { x: t.x, z: t.z })) {
        stick.visible = flame.visible = g.revealed
        dgnStaticRef.current.push(stick, flame)
      }
    }
    const lights: { l: THREE.PointLight; base: number; seed: number; tavern?: boolean }[] = []
    const addLight = (x: number, z: number, color: number, base: number, tavern = false) => {
      const l = new THREE.PointLight(color, base, 11, 1.7)
      l.position.set(x, 1.9, z)
      scene.add(l)
      lights.push({ l, base, seed: Math.random() * 10, tavern })
    }
    // the tavern glows warmer than the dungeon proper; the vault glows wrong
    dun.rooms.forEach((rm) =>
      addLight(rm.x + rm.w / 2, rm.z + rm.h / 2, rm.id === 3 ? 0xff5040 : rm.id === 0 ? 0xffb054 : 0xff8c3a, rm.id === 3 ? 26 : rm.id === 0 ? 30 : 22, rm.id === 0),
    )
    // two corridor glows + a lantern over the bar
    addLight((dun.rooms[0].x + dun.rooms[1].x) / 2 + 2, (dun.rooms[0].z + dun.rooms[1].z) / 2 + 2, 0xff8c3a, 12)
    addLight((dun.rooms[2].x + dun.rooms[3].x) / 2 + 2, (dun.rooms[2].z + dun.rooms[3].z) / 2 + 2, 0xff8c3a, 12)
    addLight(tav.x + 1.5, tav.z + 2.5, 0xffb054, 14, true)
    scene.add(new THREE.AmbientLight(0x6a5648, 0.55))
    const dir = new THREE.DirectionalLight(0x3a4a66, 0.4)
    dir.position.set(-4, 8, -6)
    scene.add(dir)

    // ── items on the floor ──
    const itemMeshes = new Map<string, THREE.Group>()
    for (const it of g.items) {
      if (!it.pos) continue
      const grp = new THREE.Group()
      if (it.effect === 'heal') {
        grp.add(box(0.2, 0.3, 0.2, lamb('#6b4a2f'), 0, 0.15, 0))
        grp.add(box(0.14, 0.08, 0.14, lamb('#2e1d12'), 0, 0.34, 0))
      } else {
        grp.add(box(0.3, 0.22, 0.24, lamb('#f5c93a'), 0, 0.13, 0))
        grp.add(box(0.14, 0.12, 0.12, lamb('#f5c93a'), 0.18, 0.22, 0))
      }
      grp.position.set(it.pos.x, 0, it.pos.z)
      scene.add(grp)
      itemMeshes.set(it.id, grp)
    }

    // ── tavern furniture ──
    for (const f of dun.furniture) {
      const grp = new THREE.Group()
      if (f.kind === 'counter') {
        // the bar runs north–south: long axis along z
        grp.add(box(0.85, 0.72, 1, lamb('#5a3f28'), 0, 0.36, 0))
        grp.add(box(0.95, 0.09, 1.04, lamb('#8a6a42'), 0, 0.8, 0))
        if ((f.x + f.z) % 2 === 0) grp.add(box(0.11, 0.12, 0.11, lamb('#f5c93a'), 0.12, 0.9, 0.22))
      } else if (f.kind === 'table') {
        grp.add(box(0.16, 0.5, 0.16, lamb('#3c2a1c'), 0, 0.25, 0))
        grp.add(box(0.85, 0.09, 0.85, lamb('#5a3f2a'), 0, 0.54, 0))
        grp.add(box(0.12, 0.12, 0.12, lamb('#f5c93a'), 0.2, 0.66, 0.12))
      } else if (f.kind === 'chair') {
        grp.add(box(0.52, 0.3, 0.52, lamb('#5a3f2a'), 0, 0.15, 0))
        // backrest sits opposite the table the chair faces
        if (f.dx) grp.add(box(0.09, 0.52, 0.52, lamb('#4a3322'), -f.dx * 0.22, 0.55, 0))
        else grp.add(box(0.52, 0.52, 0.09, lamb('#4a3322'), 0, 0.55, -(f.dz ?? 1) * 0.22))
      } else {
        grp.add(box(0.6, 0.7, 0.6, lamb('#5a3a26'), 0, 0.35, 0))
        grp.add(box(0.64, 0.07, 0.64, lamb('#2c2018'), 0, 0.2, 0))
        grp.add(box(0.64, 0.07, 0.64, lamb('#2c2018'), 0, 0.52, 0))
      }
      grp.position.set(f.x, 0, f.z)
      scene.add(grp)
    }

    // ── units ──
    const meshes = new Map<string, MeshInfo>()
    for (const u of g.units) {
      const mi = makeUnitGroup(u)
      if (u.id === 'doris') mi.grp.rotation.y = Math.PI / 2 // face the room, not the wall
      if (u.recruit) {
        const chair = dun.furniture.find((f) => f.kind === 'chair' && f.x === u.pos.x && f.z === u.pos.z)
        if (chair) {
          // perched on the seat, facing the table — they hop off when recruited
          mi.grp.position.y = 0.3
          mi.grp.rotation.y = Math.atan2(chair.dx ?? 0, chair.dz ?? 1)
        }
      }
      meshes.set(u.id, mi)
      scene.add(mi.grp)
    }

    // ── highlights, hover outline, selection ring ──
    const hiPool: THREE.Mesh[] = []
    for (let i = 0; i < 70; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.94), new THREE.MeshBasicMaterial({ color: ACID, transparent: true, opacity: 0.32, depthWrite: false }))
      m.rotation.x = -Math.PI / 2
      m.position.y = 0.03
      m.visible = false
      scene.add(m)
      hiPool.push(m)
    }
    const hover = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.62, 4, 1, Math.PI / 4),
      new THREE.MeshBasicMaterial({ color: 0xf2eae0, transparent: true, opacity: 0.5, depthWrite: false }),
    )
    hover.rotation.x = -Math.PI / 2
    hover.position.y = 0.035
    hover.visible = false
    scene.add(hover)
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.46, 20), new THREE.MeshBasicMaterial({ color: ACID, transparent: true, opacity: 0.9, depthWrite: false }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.04
    scene.add(ring)

    // ── camera ──
    const start = heroes()[0]?.pos ?? { x: 4, z: 13 }
    const camGoal = new THREE.Vector3(start.x, 0, start.z)
    const camNow = camGoal.clone()

    threeRef.current = {
      scene, camera, renderer,
      raycaster: new THREE.Raycaster(),
      ground: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      meshes, lights, flames, hiPool, hover, ring,
      camGoal, camNow, zoom: 1,
    }

    const applySize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      const scale = Math.min(1, 400 / h) // internal res ≈ 400px tall → chunky pixels
      renderer.setSize(Math.max(2, Math.floor(w * scale)), Math.max(2, Math.floor(h * scale)), false)
      const t = threeRef.current
      const viewH = 8
      const aspect = w / h
      camera.left = -viewH * aspect
      camera.right = viewH * aspect
      camera.top = viewH
      camera.bottom = -viewH
      camera.zoom = t ? t.zoom : 1
      camera.updateProjectionMatrix()
    }
    applySize()
    window.addEventListener('resize', applySize)

    // ── input ──
    const cvs = renderer.domElement
    let downAt: { x: number; y: number; btn: number } | null = null
    let dragging = false
    let last = { x: 0, y: 0 }

    const worldPerPixel = () => (camera.right - camera.left) / camera.zoom / mount.clientWidth

    const onDown = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY, btn: e.button }
      last = { x: e.clientX, y: e.clientY }
      dragging = false
    }
    const onMove = (e: PointerEvent) => {
      if (downAt) {
        if (!dragging && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) dragging = true
        if (dragging) {
          const t = threeRef.current
          if (t) {
            const wpp = worldPerPixel()
            const dx = (e.clientX - last.x) * wpp
            const dy = (e.clientY - last.y) * wpp
            // screen right ≈ (1,0,-1)/√2 · screen up on ground ≈ (-1,0,-1)/√2
            const s = Math.SQRT1_2
            t.camGoal.x += -dx * s + -dy * s
            t.camGoal.z += dx * s + -dy * s
            t.camNow.copy(t.camGoal)
          }
          last = { x: e.clientX, y: e.clientY }
          hideTip()
          return
        }
      }
      updateHover(e.clientX, e.clientY)
    }
    const onUp = (e: PointerEvent) => {
      if (!downAt) return // press started on UI chrome, not the canvas
      const wasDrag = dragging
      const btn = downAt.btn
      downAt = null
      dragging = false
      if (wasDrag) return
      if (btn === 0) handleClick(e.clientX, e.clientY)
      else if (btn === 2) handleInspect(e.clientX, e.clientY)
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const t = threeRef.current
      if (!t) return
      t.zoom = Math.min(2.4, Math.max(0.55, t.zoom * Math.exp(-e.deltaY * 0.0012)))
      camera.zoom = t.zoom
      camera.updateProjectionMatrix()
    }
    const onCtx = (e: Event) => e.preventDefault()
    const onLeaveCanvas = () => hideTip()

    cvs.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    cvs.addEventListener('wheel', onWheel, { passive: false })
    cvs.addEventListener('contextmenu', onCtx)
    cvs.addEventListener('pointerleave', onLeaveCanvas)

    // ── render loop ──
    let raf = 0
    let prev = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const t = threeRef.current
      if (!t) return

      // tweens
      const tws = tweensRef.current
      for (let i = tws.length - 1; i >= 0; i--) {
        const tw = tws[i]
        const k = Math.min(1, (now - tw.t0) / tw.dur)
        tw.fn(k)
        if (k >= 1) {
          tws.splice(i, 1)
          tw.res()
        }
      }

      // idle animation (units outside the tavern stay hidden until the reveal)
      for (const u of g.units) {
        const mi = t.meshes.get(u.id)
        if (!mi || u.hp <= 0) continue
        mi.grp.visible = g.revealed || inRoom(g.dun.rooms[0], u.pos)
        if (u.sprite === 'slime') {
          const sq = 1 + Math.sin(now / 260 + mi.phase) * 0.09
          mi.body.scale.set(2 - sq, sq, 2 - sq)
        } else if (u.sprite === 'ghost') {
          mi.body.position.y = 0.18 + Math.sin(now / 480 + mi.phase) * 0.07
        } else {
          mi.body.position.y = Math.abs(Math.sin(now / 340 + mi.phase)) * 0.035
        }
      }
      // item bobbing
      for (const it of g.items) {
        const im = itemMeshes.get(it.id)
        if (!im) continue
        im.visible = !!it.pos && g.revealed // all floor items live in the dungeon proper
        if (it.pos) im.position.y = 0.08 + Math.sin(now / 380 + it.id.length) * 0.05
      }
      // torch flicker
      t.flames.forEach((f, i) => {
        const k = 1 + Math.sin(now / 70 + i * 2.7) * 0.14 + Math.sin(now / 133 + i) * 0.1
        f.scale.set(1, k, 1)
      })
      t.lights.forEach(({ l, base, seed, tavern }) => {
        l.intensity = base * (1 + Math.sin(now / 90 + seed) * 0.09 + Math.sin(now / 47 + seed * 3) * 0.05) * (tavern ? 1 : revealKRef.current)
      })
      // selection ring
      const sel = selectedHero()
      const selMi = sel && t.meshes.get(sel.id)
      if (selMi) {
        t.ring.visible = true
        t.ring.position.set(selMi.grp.position.x, 0.04, selMi.grp.position.z)
        t.ring.rotation.z = now / 900
      } else t.ring.visible = false

      // camera
      t.camNow.lerp(t.camGoal, 1 - Math.exp(-dt * 5))
      camera.position.copy(t.camNow).add(ISO_OFFSET)
      camera.lookAt(t.camNow)

      renderer.render(scene, camera)
      positionBars()
    }
    raf = requestAnimationFrame(loop)

    // rAF pauses in hidden tabs, which would deadlock awaited animations —
    // this watchdog force-completes overdue tweens so game logic never stalls
    const watchdog = window.setInterval(() => {
      const now = performance.now()
      const tws = tweensRef.current
      for (let i = tws.length - 1; i >= 0; i--) {
        const tw = tws[i]
        if (now - tw.t0 >= tw.dur + 120) {
          tws.splice(i, 1)
          tw.fn(1)
          tw.res()
        }
      }
    }, 200)

    // ── entrance: dither the orange away ──
    runDissolve('in')

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
      clearInterval(watchdog)
      window.removeEventListener('resize', applySize)
      cvs.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      cvs.removeEventListener('wheel', onWheel)
      cvs.removeEventListener('contextmenu', onCtx)
      cvs.removeEventListener('pointerleave', onLeaveCanvas)
      document.documentElement.style.overflow = prevOverflow
      renderer.dispose()
      mount.removeChild(cvs)
      threeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── projection helpers (bars, floaters, tooltip) ───────────────────────

  function project(x: number, y: number, z: number): { px: number; py: number } | null {
    const t = threeRef.current
    const mount = mountRef.current
    if (!t || !mount) return null
    const v = new THREE.Vector3(x, y, z).project(t.camera)
    return { px: (v.x * 0.5 + 0.5) * mount.clientWidth, py: (-v.y * 0.5 + 0.5) * mount.clientHeight }
  }

  function positionBars() {
    const t = threeRef.current
    const bars = barsRef.current
    if (!t || !bars) return
    for (const el of Array.from(bars.children) as HTMLElement[]) {
      const uid = el.dataset.uid as string
      const u = g.units.find((x) => x.id === uid)
      const mi = t.meshes.get(uid)
      if (!u || !mi || u.hp <= 0) {
        el.style.display = 'none'
        continue
      }
      if (!mi.grp.visible) {
        el.style.display = 'none'
        continue
      }
      const p = project(mi.grp.position.x, mi.h + 0.35, mi.grp.position.z)
      if (!p) continue
      el.style.display = ''
      el.style.transform = `translate(${Math.round(p.px)}px, ${Math.round(p.py)}px) translate(-50%, -100%)`
    }
  }

  function floatText(at: Vec, h: number, text: string, color: string) {
    const holder = floatRef.current
    const p = project(at.x, h, at.z)
    if (!holder || !p) return
    const el = document.createElement('div')
    el.className = 'dgn-float'
    el.textContent = text
    el.style.left = `${p.px}px`
    el.style.top = `${p.py}px`
    el.style.color = color
    holder.appendChild(el)
    el.animate(
      [
        { transform: 'translate(-50%, 0)', opacity: 1 },
        { transform: 'translate(-50%, -38px)', opacity: 0 },
      ],
      { duration: 950, easing: 'ease-out' },
    ).onfinish = () => el.remove()
  }

  // ── tooltip / hover ────────────────────────────────────────────────────

  function hideTip() {
    const tip = tipRef.current
    if (tip) tip.style.display = 'none'
    const t = threeRef.current
    if (t) t.hover.visible = false
  }

  function pickTile(cx: number, cy: number): Vec | null {
    const t = threeRef.current
    const mount = mountRef.current
    if (!t || !mount) return null
    const r = mount.getBoundingClientRect()
    const ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    t.raycaster.setFromCamera(ndc, t.camera)
    const p = new THREE.Vector3()
    if (!t.raycaster.ray.intersectPlane(t.ground, p)) return null
    return { x: Math.round(p.x), z: Math.round(p.z) }
  }

  function updateHover(cx: number, cy: number) {
    const t = threeRef.current
    const tip = tipRef.current
    if (!t || !tip) return
    const tile = pickTile(cx, cy)
    if (!tile || !isFloor(g.dun, tile.x, tile.z) || g.mode === 'dialogue' || g.mode === 'victory' || g.mode === 'defeat') {
      hideTip()
      return
    }
    if (!g.revealed && !inRoom(g.dun.rooms[0], tile)) {
      hideTip() // nothing to see out there yet
      return
    }
    t.hover.visible = true
    t.hover.position.set(tile.x, 0.035, tile.z)

    const u = unitAt(tile)
    const it = itemAt(tile)
    let html = ''
    if (u) {
      if (u.faction === 'neutral') {
        html = `<b>${u.name}</b> · friendly<span class="dgn-tip-hint">${u.recruit ? 'click to meet them' : 'click to talk'}</span>`
      } else {
        const tag = u.faction === 'foe' ? 'foe' : 'party'
        html = `<b>${u.name}</b> · ${tag}<br/>${u.hp}/${u.maxHp} hp${u.shield ? ` · ${u.shield} shield` : ''}<span class="dgn-tip-hint">right-click to inspect</span>`
      }
    } else if (it) {
      html = `<b>${it.name}</b><br/>${it.desc}<span class="dgn-tip-hint">click to walk over &amp; grab it</span>`
    }
    if (html) {
      tip.style.display = 'block'
      tip.innerHTML = html
      tip.style.left = `${cx + 16}px`
      tip.style.top = `${cy + 12}px`
    } else tip.style.display = 'none'
  }

  // ── highlights ─────────────────────────────────────────────────────────

  function refreshHi() {
    const t = threeRef.current
    if (!t) return
    let n = 0
    const put = (v: Vec, color: number, opacity: number) => {
      const m = t.hiPool[n++]
      if (!m) return
      ;(m.material as THREE.MeshBasicMaterial).color.setHex(color)
      ;(m.material as THREE.MeshBasicMaterial).opacity = opacity
      m.position.set(v.x, 0.03, v.z)
      m.visible = true
    }
    hiMoveRef.current = new Set()

    const hero = selectedHero()
    if (g.mode === 'combat' && g.playerTurn && !g.busy && hero) {
      if (g.pending !== null) {
        const ab = hero.abilities[g.pending]
        for (const u of g.units) {
          if (!alive(u)) continue
          const okType = ab.dmg ? u.faction === 'foe' : u.faction === 'party'
          if (okType && manhattan(hero.pos, u.pos) <= ab.range && (!ab.dmg || hasLOS(g.dun, hero.pos, u.pos)))
            put(u.pos, ab.dmg ? 0xd83a3a : 0x3ac86a, 0.45)
        }
      } else if (!hero.moved) {
        for (const v of reachable(g.dun, blockedSet(hero), hero.pos, hero.move)) {
          hiMoveRef.current.add(key(v))
          put(v, 0xff5e1f, 0.22)
        }
      }
    }
    for (let i = n; i < t.hiPool.length; i++) t.hiPool[i].visible = false
  }

  // ── animation primitives ───────────────────────────────────────────────

  function tween(dur: number, fn: (k: number) => void): Promise<void> {
    return new Promise((res) => tweensRef.current.push({ t0: performance.now(), dur, fn, res }))
  }

  function faceToward(mi: MeshInfo, from: Vec, to: Vec) {
    if (from.x === to.x && from.z === to.z) return
    mi.grp.rotation.y = Math.atan2(to.x - from.x, to.z - from.z)
  }

  async function animMove(u: Unit, path: Vec[], follow = false) {
    const t = threeRef.current
    if (!t || path.length === 0) return
    const mi = t.meshes.get(u.id)
    if (!mi) return
    for (const step of path) {
      const from = { ...u.pos }
      faceToward(mi, from, step)
      await tween(TILE_STEP_MS, (k) => {
        const e = easeInOut(k)
        mi.grp.position.x = from.x + (step.x - from.x) * e
        mi.grp.position.z = from.z + (step.z - from.z) * e
        if (u.sprite !== 'ghost' && u.sprite !== 'slime') mi.grp.position.y = Math.sin(k * Math.PI) * 0.09
      })
      mi.grp.position.y = 0
      u.pos = { ...step }
      if (follow && threeRef.current) threeRef.current.camGoal.set(step.x, 0, step.z)
    }
  }

  async function animLunge(u: Unit, target: Unit) {
    const t = threeRef.current
    const mi = t?.meshes.get(u.id)
    if (!mi) return
    faceToward(mi, u.pos, target.pos)
    const dx = Math.sign(target.pos.x - u.pos.x) * 0.28
    const dz = Math.sign(target.pos.z - u.pos.z) * 0.28
    await tween(190, (k) => {
      const w = Math.sin(k * Math.PI)
      mi.body.position.x = dx * w
      mi.body.position.z = dz * w
    })
    mi.body.position.x = 0
    mi.body.position.z = 0
  }

  async function animProjectile(u: Unit, target: Unit, color: number) {
    const t = threeRef.current
    if (!t) return
    const mi = t.meshes.get(u.id)
    const tmi = t.meshes.get(target.id)
    if (!mi || !tmi) return
    faceToward(mi, u.pos, target.pos)
    const p = box(0.14, 0.14, 0.14, new THREE.MeshBasicMaterial({ color }))
    const a = mi.grp.position.clone().setY(mi.h * 0.6)
    const b = tmi.grp.position.clone().setY(tmi.h * 0.5)
    p.position.copy(a)
    t.scene.add(p)
    await tween(210, (k) => {
      p.position.lerpVectors(a, b, k)
      p.position.y += Math.sin(k * Math.PI) * 0.5
      p.rotation.x = k * 7
      p.rotation.y = k * 5
    })
    t.scene.remove(p)
  }

  async function animDeath(u: Unit) {
    const t = threeRef.current
    const mi = t?.meshes.get(u.id)
    if (!t || !mi) return
    await tween(420, (k) => {
      const s = 1 - k * 0.99
      mi.grp.scale.set(s, s, s)
      mi.grp.rotation.y += 0.15
    })
    t.scene.remove(mi.grp)
  }

  // ── combat mechanics ───────────────────────────────────────────────────

  function applyDamage(target: Unit, dmg: number) {
    let left = dmg
    if (target.shield > 0) {
      const absorbed = Math.min(target.shield, left)
      target.shield -= absorbed
      left -= absorbed
      if (absorbed > 0) floatText(target.pos, 1.4, `-${absorbed} shield`, '#7fb6ff')
    }
    if (left > 0) {
      target.hp = Math.max(0, target.hp - left)
      floatText(target.pos, 1.7, `-${left}`, '#ff6a5e')
    }
  }

  async function cast(u: Unit, ai: number, target: Unit) {
    const ab = u.abilities[ai]
    u.acted = true
    u.cooldowns[ai] = ab.cd
    if (ab.dmg && ab.range > 1) await animProjectile(u, target, u.faction === 'party' ? 0xffa438 : 0x9db06a)
    else await animLunge(u, target)
    if (ab.dmg) {
      applyDamage(target, ab.dmg)
      log(`${u.name} hits ${target.name} with ${ab.name} for ${ab.dmg}.`)
      if (target.hp <= 0) {
        log(`${target.name} is defeated!`)
        void animDeath(target)
      }
    }
    if (ab.heal) {
      target.hp = Math.min(target.maxHp, target.hp + ab.heal)
      floatText(target.pos, 1.6, `+${ab.heal}`, '#6fe08a')
      log(`${u.name} mends ${target.name} for ${ab.heal}.`)
    }
    if (ab.shield) {
      target.shield += ab.shield
      floatText(target.pos, 1.6, `+${ab.shield} shield`, '#7fb6ff')
      log(`${u.name} shields ${target.name}.`)
    }
    bump()
  }

  function checkCombatEnd(): boolean {
    if (g.mode !== 'combat') return false
    if (heroes().length === 0) {
      g.mode = 'defeat'
      g.busy = false
      refreshHi()
      bump()
      return true
    }
    if (engaged().length === 0) {
      const bossDead = !g.units.some((u) => u.sprite === 'boss' && alive(u))
      if (bossDead) {
        g.mode = 'victory'
      } else {
        g.mode = 'explore'
        g.combatRoom = null
        g.pending = null
        for (const h of heroes()) h.hp = Math.min(h.maxHp, h.hp + 6)
        log('room cleared — the party catches its breath (+6 hp).')
      }
      g.busy = false
      refreshHi()
      bump()
      return true
    }
    return false
  }

  function startCombat(roomId: number) {
    if (g.mode === 'combat') return
    g.mode = 'combat'
    g.combatRoom = roomId
    g.round = 1
    g.playerTurn = true
    g.pending = null
    g.popup = null
    for (const u of g.units) {
      u.moved = false
      u.acted = false
    }
    const n = engaged().length
    log(`steel out — ${n} foe${n === 1 ? '' : 's'} engage${n === 1 ? 's' : ''}!`)
    // frame the fight
    const t = threeRef.current
    if (t) {
      const all = [...engaged(), ...heroes()]
      const cx = all.reduce((s, u) => s + u.pos.x, 0) / all.length
      const cz = all.reduce((s, u) => s + u.pos.z, 0) / all.length
      t.camGoal.set(cx, 0, cz)
    }
    refreshHi()
    bump()
  }

  async function combatMove(hero: Unit, tile: Vec) {
    const path = bfsPath(g.dun, blockedSet(hero), hero.pos, tile)
    if (!path || path.length === 0 || path.length > hero.move) return
    g.busy = true
    refreshHi()
    bump()
    await animMove(hero, path)
    hero.moved = true
    g.busy = false
    refreshHi()
    bump()
  }

  async function castHero(hero: Unit, ai: number, target: Unit) {
    g.busy = true
    g.pending = null
    refreshHi()
    bump()
    await cast(hero, ai, target)
    if (!checkCombatEnd()) {
      g.busy = false
      refreshHi()
      bump()
    }
  }

  function bestRange(f: Unit): number {
    let r = 0
    f.abilities.forEach((a, i) => {
      if (f.cooldowns[i] === 0 && a.dmg) r = Math.max(r, a.range)
    })
    return r
  }

  function usableAbility(f: Unit, target: Unit): number | null {
    let best: number | null = null
    f.abilities.forEach((a, i) => {
      if (f.cooldowns[i] > 0 || !a.dmg) return
      if (manhattan(f.pos, target.pos) <= a.range && hasLOS(g.dun, f.pos, target.pos)) {
        if (best === null || (f.abilities[best].dmg ?? 0) < a.dmg) best = i
      }
    })
    return best
  }

  async function foesTurn() {
    if (g.busy || !g.playerTurn || g.mode !== 'combat') return
    g.busy = true
    g.playerTurn = false
    g.pending = null
    refreshHi()
    bump()
    await sleep(300)

    for (const f of engaged()) {
      if (!mountedRef.current || g.mode !== 'combat') return
      if (!alive(f)) continue
      const hs = heroes()
      if (hs.length === 0) break
      const target = hs.reduce((a, b) => (manhattan(f.pos, a.pos) <= manhattan(f.pos, b.pos) ? a : b))

      let ai = usableAbility(f, target)
      if (ai === null) {
        const path = bfsPath(g.dun, blockedSet(f), f.pos, target.pos, true)
        if (path) {
          path.pop() // never step onto the target itself
          let steps = path.slice(0, f.move)
          const r = bestRange(f)
          for (let i = 0; i < steps.length; i++) {
            if (manhattan(steps[i], target.pos) <= r && hasLOS(g.dun, steps[i], target.pos)) {
              steps = steps.slice(0, i + 1)
              break
            }
          }
          if (steps.length) await animMove(f, steps)
        }
        ai = usableAbility(f, target)
      }
      if (ai !== null) {
        await cast(f, ai, target)
        if (target.hp <= 0) {
          void animDeath(target)
          log(`${target.name} falls!`)
          bump()
        }
      }
      await sleep(160)
    }

    if (heroes().length === 0) {
      g.mode = 'defeat'
      g.busy = false
      bump()
      return
    }

    // new round
    g.round += 1
    g.playerTurn = true
    for (const u of g.units) {
      u.moved = false
      u.acted = false
      u.cooldowns = u.cooldowns.map((c) => Math.max(0, c - 1))
    }
    g.busy = false
    log(`round ${g.round} — your move.`)
    refreshHi()
    bump()
  }

  // ── explore mechanics ──────────────────────────────────────────────────

  function roomOf(v: Vec): number | null {
    for (const rm of g.dun.rooms) if (v.x >= rm.x && v.x < rm.x + rm.w && v.z >= rm.z && v.z < rm.z + rm.h) return rm.id
    return null
  }

  function checkAggro() {
    for (const f of foes()) {
      const near = heroes().some((h) => manhattan(h.pos, f.pos) <= 2)
      const sameRoom = heroes().some((h) => roomOf(h.pos) === f.roomId)
      if (near || sameRoom) {
        startCombat(f.roomId)
        return
      }
    }
  }

  function pickupAt(v: Vec) {
    const it = itemAt(v)
    if (!it) return
    it.pos = null
    g.inventory.push(it)
    floatText(v, 1.2, `+ ${it.name}`, '#f5c93a')
    log(`picked up the ${it.name}.`)
  }

  function revealDungeon() {
    if (g.revealed) return
    g.revealed = true
    for (const o of dgnStaticRef.current) o.visible = true
    void tween(1200, (k) => {
      revealKRef.current = k
    })
    log('the inn door groans open — torches gutter awake in the dark below.')
    bump()
  }

  async function moveParty(tile: Vec, after?: () => void) {
    const leader = selectedHero() ?? heroes()[0]
    if (!leader) return
    // nobody delves alone — the tavern door stays shut until you recruit
    if (heroes().length < 2 && !inRoom(g.dun.rooms[0], tile)) {
      log("doris tuts: 'nobody delves alone, love. one of these three goes with you.'")
      bump()
      return
    }
    const others = heroes().filter((h) => h !== leader)
    const blocked = blockedSet(leader)
    for (const o of others) blocked.delete(key(o.pos)) // heroes flow through each other
    const path = bfsPath(g.dun, blocked, leader.pos, tile)
    if (!path || path.length === 0) return
    // stepping out the door lights the dungeon
    if (!g.revealed && !inRoom(g.dun.rooms[0], tile)) revealDungeon()

    g.busy = true
    bump()
    const leaderStart = { ...leader.pos }
    const moves: Promise<void>[] = [animMove(leader, path, true)]
    const follower = others[0]
    if (follower) {
      const fBlocked = blockedSet(follower)
      fBlocked.delete(key(leader.pos))
      const fPath = bfsPath(g.dun, fBlocked, follower.pos, leaderStart)
      if (fPath && fPath.length) moves.push(animMove(follower, fPath.slice(0, path.length + 2)))
    }
    await Promise.all(moves)
    for (const h of heroes()) pickupAt(h.pos)
    g.busy = false
    after?.()
    if (g.mode === 'explore') checkAggro()
    refreshHi()
    bump()
  }

  // ── dialogue ───────────────────────────────────────────────────────────

  const PUCK = "puck · the intern's ghost"
  const DORIS = 'doris · keeper of the rubber duck inn'

  function closeDlg() {
    g.dlg = null
    g.mode = 'explore'
    bump()
  }
  const farewell = (): DlgChoice => ({ label: '[ farewell ]', act: closeDlg })

  function say(title: string, text: string, choices: DlgChoice[]) {
    g.mode = 'dialogue'
    g.dlg = { title, text, choices }
    hideTip()
    bump()
  }

  function openPuck() {
    say(PUCK, "GAH— a user?! Nobody ever finds this place. I'm Puck. I haunt the hidden dev dungeon. The beast in the far vault holds the place together — or apart, hard to say.", [
      {
        label: '“what is this place?”',
        act: () =>
          say(PUCK, "An easter egg. The résumé is upstairs — down here it's just me, some slimes, and a beast made of legacy code. Clear the vault and the dungeon is yours.", [farewell()]),
      },
      {
        label: '“any advice before I fight?”',
        act: () => {
          let text = 'Keep your ranged friend at range, save the shield for the big lad.'
          if (!g.gaveGift) {
            g.gaveGift = true
            g.inventory.push({ id: 'gift', name: 'cold brew of vigor', desc: 'heals your most wounded hero for 10', pos: null, effect: 'heal' })
            text += " Here — cold brew. I made it during standup. It's barely cursed."
          }
          say(PUCK, text, [farewell()])
        },
      },
      {
        label: '“are you… a ghost?”',
        act: () =>
          say(PUCK, "An unmerged feature branch, technically. Four thousand commits behind main and full of regrets. Don't be like me, traveler — ship.", [farewell()]),
      },
      farewell(),
    ])
  }

  function nextFact() {
    if (g.factI >= g.factOrder.length) g.factI = 0
    const fact = FACTS[g.factOrder[g.factI++]]
    say(DORIS, fact, [{ label: '“another one.”', act: nextFact }, farewell()])
  }

  function openDoris() {
    say(DORIS, "welcome to the rubber duck inn — last warm room before the dungeon. the dev built this whole place, y'know. what'll it be?", [
      { label: '“tell me about the dev.”', act: nextFact },
      {
        label: '“who should I take below?”',
        act: () =>
          say(DORIS, 'the witch burns from afar, the ranger reaches further, the cleric keeps you standing. no wrong pick, love — only different funerals avoided.', [
            farewell(),
          ]),
      },
      farewell(),
    ])
  }

  function npcInteract(npc: Unit) {
    // radius 3 with line of sight — close enough to chat across the bar
    const near = heroes().some((h) => manhattan(h.pos, npc.pos) <= 3 && hasLOS(g.dun, h.pos, npc.pos))
    if (near) {
      if (npc.id === 'doris') openDoris()
      else openPuck()
      return
    }
    // walk within earshot first — doris is boxed in behind the counter
    const leader = selectedHero() ?? heroes()[0]
    if (!leader) return
    const blocked = blockedSet(leader)
    const spots: Vec[] = []
    for (let dz = -3; dz <= 3; dz++)
      for (let dx = -3; dx <= 3; dx++) {
        const d = Math.abs(dx) + Math.abs(dz)
        if (d === 0 || d > 3) continue
        const v = { x: npc.pos.x + dx, z: npc.pos.z + dz }
        if (isFloor(g.dun, v.x, v.z) && !blocked.has(key(v)) && hasLOS(g.dun, v, npc.pos)) spots.push(v)
      }
    spots.sort((a, b) => manhattan(leader.pos, a) - manhattan(leader.pos, b))
    for (const s of spots) {
      if (bfsPath(g.dun, blocked, leader.pos, s)) {
        void moveParty(s, () => npcInteract(npc))
        return
      }
    }
  }

  function recruitUnit(u: Unit) {
    if (!u.recruit || heroes().length >= 2 || g.mode !== 'explore') return
    u.faction = 'party'
    g.popup = null
    log(`${u.name.toLowerCase()} ${u.title.toLowerCase()} joins the party. doris nods approvingly.`)
    bump()
  }

  function consumeItem(idx: number) {
    if (g.busy) return
    const it = g.inventory[idx]
    if (!it) return
    g.inventory.splice(idx, 1)
    if (it.effect === 'heal') {
      const target = heroes().reduce((a, b) => (a.maxHp - a.hp >= b.maxHp - b.hp ? a : b), heroes()[0])
      if (!target) return
      target.hp = Math.min(target.maxHp, target.hp + 10)
      floatText(target.pos, 1.6, '+10', '#6fe08a')
      log(`${target.name} downs the cold brew. immediate deadline energy.`)
    } else {
      for (const h of heroes()) {
        h.shield += 6
        floatText(h.pos, 1.6, '+6 shield', '#7fb6ff')
      }
      log('the duck listens. the party feels understood. +6 shield each.')
    }
    bump()
  }

  // ── click routing ──────────────────────────────────────────────────────

  function handleClick(cx: number, cy: number) {
    if (g.busy || g.mode === 'victory' || g.mode === 'defeat' || g.mode === 'dialogue') return
    if (g.popup) {
      g.popup = null
      bump()
    }
    if (!g.introSeen) {
      g.introSeen = true
      bump()
    }
    const tile = pickTile(cx, cy)
    if (!tile || !isFloor(g.dun, tile.x, tile.z)) return
    const u = unitAt(tile)

    if (g.mode === 'explore') {
      // clicking into the unrevealed dark just walks toward it
      if (!g.revealed && !inRoom(g.dun.rooms[0], tile)) {
        void moveParty(tile)
        return
      }
      if (u?.faction === 'party') {
        g.selected = u.id
        bump()
      } else if (u?.faction === 'foe') {
        g.popup = { unitId: u.id, x: cx, y: cy }
        bump()
      } else if (u?.faction === 'neutral') {
        if (u.recruit) {
          g.popup = { unitId: u.id, x: cx, y: cy }
          bump()
        } else npcInteract(u)
      } else {
        void moveParty(tile)
      }
      return
    }

    // combat
    const hero = selectedHero()
    if (g.pending !== null && hero) {
      const ai = g.pending
      const ab = hero.abilities[ai]
      const okType = u && alive(u) && (ab.dmg ? u.faction === 'foe' : u.faction === 'party')
      if (u && okType && manhattan(hero.pos, u.pos) <= ab.range && (!ab.dmg || hasLOS(g.dun, hero.pos, u.pos))) {
        void castHero(hero, ai, u)
      } else {
        g.pending = null
        refreshHi()
        bump()
      }
      return
    }
    if (u?.faction === 'party') {
      g.selected = u.id
      refreshHi()
      bump()
      return
    }
    if (u?.faction === 'foe') {
      g.popup = { unitId: u.id, x: cx, y: cy }
      bump()
      return
    }
    if (!u && hero && g.playerTurn && !hero.moved && hiMoveRef.current.has(key(tile))) void combatMove(hero, tile)
  }

  function handleInspect(cx: number, cy: number) {
    if (g.mode !== 'explore' && g.mode !== 'combat') return
    const tile = pickTile(cx, cy)
    if (!tile) return
    if (!g.revealed && !inRoom(g.dun.rooms[0], tile)) return
    const u = unitAt(tile)
    if (u) {
      g.popup = { unitId: u.id, x: cx, y: cy }
      bump()
    }
  }

  function abilityClick(ai: number) {
    const hero = selectedHero()
    if (!hero || g.mode !== 'combat' || !g.playerTurn || g.busy) return
    if (hero.acted || hero.cooldowns[ai] > 0) return
    g.pending = g.pending === ai ? null : ai
    refreshHi()
    bump()
  }

  // ── dissolve transitions + exit ────────────────────────────────────────

  function runDissolve(dirn: 'in' | 'out', done?: () => void) {
    const cv = dissolveRef.current
    if (!cv) return
    const CW = 96
    const CH = 54
    cv.width = CW
    cv.height = CH
    cv.style.display = 'block'
    const ctx = cv.getContext('2d') as CanvasRenderingContext2D
    const total = CW * CH
    const order: number[] = Array.from({ length: total }, (_, i) => i)
    for (let i = total - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const img = ctx.createImageData(CW, CH)
    for (let i = 0; i < total; i++) {
      img.data[i * 4] = 255
      img.data[i * 4 + 1] = 94
      img.data[i * 4 + 2] = 31
      img.data[i * 4 + 3] = dirn === 'in' ? 255 : 0
    }
    ctx.putImageData(img, 0, 0)
    const dur = dirn === 'in' ? 2000 : 1000
    const t0 = performance.now()
    let cleared = 0
    const title = titleRef.current
    if (title && dirn === 'in') title.style.opacity = '1'
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur)
      const upto = Math.floor(k * total)
      for (; cleared < upto; cleared++) img.data[order[cleared] * 4 + 3] = dirn === 'in' ? 0 : 255
      ctx.putImageData(img, 0, 0)
      if (title && dirn === 'in') title.style.opacity = String(1 - Math.max(0, (k - 0.55)) / 0.45)
      if (k < 1) requestAnimationFrame(step)
      else {
        if (dirn === 'in') {
          cv.style.display = 'none'
          if (title) title.style.display = 'none'
        }
        done?.()
      }
    }
    requestAnimationFrame(step)
  }

  function exitToPortfolio() {
    if (exitingRef.current) return
    exitingRef.current = true
    runDissolve('out', () => {
      try {
        sessionStorage.setItem('mv-dgn-exit', '1')
      } catch {}
      router.push('/')
    })
  }

  function respawn() {
    // a fresh seed, a fresh dungeon — the cleanest reset is a clean reload
    window.location.reload()
  }

  // ── render ─────────────────────────────────────────────────────────────

  const hero = selectedHero()
  const popupUnit = g.popup ? g.units.find((u) => u.id === g.popup?.unitId) : null
  // engaging needs a hero close enough to actually see the foe
  const engageable = popupUnit ? heroes().some((h) => manhattan(h.pos, popupUnit.pos) <= 6 && hasLOS(g.dun, h.pos, popupUnit.pos)) : false
  const partyUnits = g.units.filter((u) => u.faction === 'party')
  const barUnits = g.units.filter((u) => alive(u) && u.faction !== 'neutral')
  const npcUnits = g.units.filter((u) => alive(u) && u.faction === 'neutral')

  return (
    <div className="dgn-root">
      <div className="dgn-mount" ref={mountRef} />

      {/* hp bars + npc labels, positioned every frame from the 3d scene */}
      <div className="dgn-bars" ref={barsRef} aria-hidden="true">
        {barUnits.map((u) => (
          <div key={u.id} data-uid={u.id} className="dgn-bar">
            <div className="dgn-bar-shell">
              <i className={u.faction === 'party' ? 'dgn-bar-hp' : 'dgn-bar-hp foe'} style={{ width: `${(u.hp / u.maxHp) * 100}%` }} />
              {u.shield > 0 && <i className="dgn-bar-sh" style={{ width: `${Math.min(100, (u.shield / u.maxHp) * 100)}%` }} />}
            </div>
          </div>
        ))}
        {npcUnits.map((u) => (
          <div key={u.id} data-uid={u.id} className="dgn-bar">
            <span className="dgn-npc-tag">✦ {u.name.toLowerCase()}</span>
          </div>
        ))}
      </div>
      <div className="dgn-floaters" ref={floatRef} aria-hidden="true" />
      <div className="dgn-tip" ref={tipRef} />

      {/* top chrome */}
      <div className="dgn-top">
        <span className="dgn-log">&gt; {g.log}</span>
        {g.mode === 'combat' && (
          <span className="dgn-turn">{g.playerTurn ? `round ${g.round} · your turn` : 'foes advance…'}</span>
        )}
        <button className="dgn-close" onClick={exitToPortfolio} title="back to the portfolio">✕</button>
      </div>

      {/* bottom action bar */}
      <div className="dgn-hud">
        <div className="dgn-party">
          {partyUnits.map((u) => (
            <button
              key={u.id}
              className={`dgn-port${g.selected === u.id ? ' sel' : ''}${u.hp <= 0 ? ' dead' : ''}`}
              onClick={() => {
                if (u.hp <= 0) return
                g.selected = u.id
                g.pending = null
                refreshHi()
                bump()
              }}
            >
              <b>{u.name[0]}</b>
              <i style={{ width: `${(u.hp / u.maxHp) * 100}%` }} />
              <span>{u.hp <= 0 ? '✝' : `${u.hp}/${u.maxHp}`}</span>
            </button>
          ))}
        </div>

        <div className="dgn-abilities">
          {(hero?.abilities ?? []).map((ab: Ability, i: number) => {
            const cd = hero?.cooldowns[i] ?? 0
            const usable = g.mode === 'combat' && g.playerTurn && !g.busy && hero && !hero.acted && cd === 0
            return (
              <button
                key={ab.id}
                className={`dgn-ab${g.pending === i ? ' armed' : ''}${usable ? '' : ' off'}`}
                onClick={() => abilityClick(i)}
                title={`${ab.name} — ${ab.desc || 'attack'} · range ${ab.range}${ab.dmg ? ` · ${ab.dmg} dmg` : ''}${ab.heal ? ` · heals ${ab.heal}` : ''}${ab.shield ? ` · ${ab.shield} shield` : ''}`}
              >
                <span className="dgn-ab-name">{ab.name}</span>
                <span className="dgn-ab-meta">
                  {ab.dmg ? `${ab.dmg} dmg` : ab.heal ? `+${ab.heal} hp` : `+${ab.shield} sh`} · r{ab.range}
                </span>
                {cd > 0 && <span className="dgn-ab-cd">{cd}</span>}
              </button>
            )
          })}
        </div>

        <div className="dgn-side">
          {g.inventory.map((it, i) => (
            <button key={`${it.id}${i}`} className="dgn-item" onClick={() => consumeItem(i)} title={it.desc}>
              {it.effect === 'heal' ? '☕' : '🦆'}
            </button>
          ))}
          {g.mode === 'combat' && (
            <button className="dgn-end" disabled={!g.playerTurn || g.busy} onClick={() => void foesTurn()}>
              end turn
            </button>
          )}
        </div>
      </div>

      {/* inspect / engage / recruit popup */}
      {popupUnit && g.popup && (
        <div className="dgn-pop" style={{ left: Math.min(g.popup.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 260), top: g.popup.y }}>
          <b>{popupUnit.name}</b>
          <em>{popupUnit.title}</em>
          {popupUnit.faction !== 'neutral' && (
            <span>
              {popupUnit.hp}/{popupUnit.maxHp} hp{popupUnit.shield ? ` · ${popupUnit.shield} shield` : ''}
            </span>
          )}
          <p>{popupUnit.flavor}</p>
          {popupUnit.recruit && (
            <span className="dgn-pop-abs">
              {popupUnit.abilities.map((a) => (
                <span key={a.id}>
                  {a.name} · {a.dmg ? `${a.dmg} dmg` : a.heal ? `+${a.heal} hp` : `+${a.shield} sh`} · r{a.range}
                </span>
              ))}
            </span>
          )}
          {popupUnit.recruit && heroes().length >= 2 && <span className="dgn-pop-note">the party is full.</span>}
          {popupUnit.faction === 'foe' && g.mode === 'explore' && !engageable && (
            <span className="dgn-pop-note">too far away to engage — move closer.</span>
          )}
          <div className="dgn-pop-row">
            {popupUnit.faction === 'foe' && g.mode === 'explore' && engageable && (
              <button className="dgn-btn acid" onClick={() => startCombat(popupUnit.roomId)}>⚔ engage</button>
            )}
            {popupUnit.recruit && heroes().length < 2 && g.mode === 'explore' && (
              <button className="dgn-btn acid" onClick={() => recruitUnit(popupUnit)}>+ recruit</button>
            )}
            <button
              className="dgn-btn"
              onClick={() => {
                g.popup = null
                bump()
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* dialogue */}
      {g.dlg && (
        <div className="dgn-dlg">
          <b>{g.dlg.title}</b>
          <p>{g.dlg.text}</p>
          <div className="dgn-dlg-choices">
            {g.dlg.choices.map((c, i) => (
              <button key={i} className={`dgn-btn${c.label.startsWith('[') ? ' acid' : ''}`} onClick={c.act}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* victory / defeat */}
      {g.mode === 'victory' && (
        <div className="dgn-over">
          <div className="dgn-over-card">
            <b>dungeon cleared</b>
            <p>
              you hovered a suspicious dot, befriended a ghost, and slew a beast made of legacy code.
              this has been the hidden dev dungeon — thanks for playing. <span className="acid">— m</span>
            </p>
            <div className="dgn-dlg-choices">
              <button className="dgn-btn acid" onClick={exitToPortfolio}>return to the portfolio</button>
              <button
                className="dgn-btn"
                onClick={() => {
                  g.mode = 'explore'
                  g.combatRoom = null
                  bump()
                }}
              >
                keep wandering
              </button>
            </div>
          </div>
        </div>
      )}
      {g.mode === 'defeat' && (
        <div className="dgn-over">
          <div className="dgn-over-card">
            <b>the party wipes</b>
            <p>…like a hard drive. the dungeon rearranges itself, as dungeons do.</p>
            <div className="dgn-dlg-choices">
              <button className="dgn-btn acid" onClick={respawn}>respawn</button>
              <button className="dgn-btn" onClick={exitToPortfolio}>flee to the portfolio</button>
            </div>
          </div>
        </div>
      )}

      {/* intro hint */}
      {!g.introSeen && (
        <div className="dgn-hint">
          <b>mouse only.</b> click — move &amp; talk · drag — pan · wheel — zoom · right-click — inspect. recruit a companion at a table before you descend — and doris behind the bar keeps facts about the dev on tap.
        </div>
      )}

      {/* enter/exit dither + title card */}
      <div className="dgn-title" ref={titleRef}>
        <b>the hidden dev dungeon</b>
        <span>an easter egg, apparently</span>
      </div>
      <canvas className="dgn-dissolve" ref={dissolveRef} />

      <style>{CSS}</style>
    </div>
  )
}

const CSS = `
.dgn-root {
  position: fixed; inset: 0; z-index: 2000;
  background: #0a0705; color: #f2eae0;
  font-family: var(--font-pixel), 'Courier New', monospace;
  user-select: none; -webkit-user-select: none;
  cursor: default;
}
.dgn-mount { position: absolute; inset: 0; }
.dgn-canvas {
  position: absolute; inset: 0; width: 100% !important; height: 100% !important;
  image-rendering: pixelated;
  touch-action: none;
}
.dgn-bars, .dgn-floaters { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.dgn-bar { position: absolute; left: 0; top: 0; will-change: transform; }
.dgn-bar-shell {
  width: 38px; height: 6px; background: #000;
  box-shadow: 0 0 0 2px #000; position: relative;
}
.dgn-bar-hp { position: absolute; inset: 0; background: #6fe08a; }
.dgn-bar-hp.foe { background: #e0574a; }
.dgn-bar-sh { position: absolute; left: 0; top: -3px; height: 2px; background: #7fb6ff; }
.dgn-npc-tag { font-size: 8px; color: #cfd8e3; text-shadow: 1px 1px 0 #000; white-space: nowrap; }
.dgn-float {
  position: absolute; transform: translate(-50%, 0);
  font-size: 10px;
  text-shadow: 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000;
  pointer-events: none; white-space: nowrap;
}

/* pixel chrome — notched black frame + hard drop shadow, no smooth borders */
.dgn-tip, .dgn-turn, .dgn-hud, .dgn-pop, .dgn-dlg, .dgn-over-card, .dgn-hint {
  border: none; border-radius: 0;
  box-shadow:
    0 -3px 0 0 #000, 0 3px 0 0 #000, -3px 0 0 0 #000, 3px 0 0 0 #000,
    0 -6px 0 0 rgba(255,94,31,.28), 0 6px 0 0 rgba(255,94,31,.28),
    -6px 0 0 0 rgba(255,94,31,.28), 6px 0 0 0 rgba(255,94,31,.28),
    7px 9px 0 0 rgba(0,0,0,.5);
}
/* pixel buttons — notched frame + bevel (light top-left, dark bottom-right) */
.dgn-btn, .dgn-ab, .dgn-port, .dgn-item, .dgn-end, .dgn-close {
  border: none; border-radius: 0;
  box-shadow:
    0 -3px 0 0 #000, 0 3px 0 0 #000, -3px 0 0 0 #000, 3px 0 0 0 #000,
    inset 3px 3px 0 0 rgba(255,255,255,.09), inset -3px -3px 0 0 rgba(0,0,0,.4);
}
.dgn-btn:hover, .dgn-ab:not(.off):hover, .dgn-item:hover, .dgn-close:hover, .dgn-port:not(.dead):hover, .dgn-end:not(:disabled):hover {
  box-shadow:
    0 -3px 0 0 #ff5e1f, 0 3px 0 0 #ff5e1f, -3px 0 0 0 #ff5e1f, 3px 0 0 0 #ff5e1f,
    inset 3px 3px 0 0 rgba(255,255,255,.09), inset -3px -3px 0 0 rgba(0,0,0,.4);
}
.dgn-ab.armed, .dgn-btn:active, .dgn-end:not(:disabled):active {
  box-shadow:
    0 -3px 0 0 #000, 0 3px 0 0 #000, -3px 0 0 0 #000, 3px 0 0 0 #000,
    inset -3px -3px 0 0 rgba(255,255,255,.12), inset 3px 3px 0 0 rgba(0,0,0,.35);
}

.dgn-tip {
  position: fixed; display: none; z-index: 40; max-width: 250px;
  background: #16100c;
  padding: 8px 10px; font-size: 8px; line-height: 1.9;
  pointer-events: none;
}
.dgn-tip b { color: #ff9d5e; }
.dgn-tip-hint { display: block; margin-top: 4px; color: rgba(242,234,224,.45); font-size: 7px; }

.dgn-top {
  position: absolute; top: 0; left: 0; right: 0; z-index: 30;
  display: flex; align-items: center; gap: 18px; padding: 16px 20px;
  pointer-events: none;
}
.dgn-log { font-size: 8px; line-height: 1.6; color: rgba(242,234,224,.75); text-shadow: 1px 1px 0 #000; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dgn-turn {
  font-size: 8px; text-transform: uppercase; color: #ff9d5e;
  background: #16100c; padding: 8px 12px;
}
.dgn-close {
  pointer-events: auto; width: 36px; height: 36px; flex: 0 0 auto;
  background: #16100c; color: #f2eae0;
  font-size: 12px; cursor: pointer; font-family: inherit; line-height: 1;
}
.dgn-close:hover { background: #ff5e1f; color: #0a0705; }

.dgn-hud {
  position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 30;
  display: flex; align-items: stretch; gap: 9px; padding: 10px;
  background: #16100c;
  max-width: calc(100vw - 28px);
}
.dgn-party { display: flex; gap: 9px; }
.dgn-port {
  position: relative; width: 56px; padding: 7px 0 5px; text-align: center;
  background: #221812; cursor: pointer; color: #f2eae0; font-family: inherit;
}
.dgn-port b { display: block; font-size: 12px; }
.dgn-port i { display: block; height: 3px; background: #6fe08a; margin: 4px 6px 3px; }
.dgn-port span { font-size: 7px; color: rgba(242,234,224,.6); }
.dgn-port.sel { background: #38220f; box-shadow: 0 -3px 0 0 #ff5e1f, 0 3px 0 0 #ff5e1f, -3px 0 0 0 #ff5e1f, 3px 0 0 0 #ff5e1f, inset 3px 3px 0 0 rgba(255,255,255,.09), inset -3px -3px 0 0 rgba(0,0,0,.4); }
.dgn-port.dead { opacity: .35; cursor: default; }
.dgn-abilities { display: flex; gap: 9px; }
.dgn-ab {
  position: relative; min-width: 96px; padding: 8px 10px 7px; text-align: left;
  background: #221812; cursor: pointer; color: #f2eae0; font-family: inherit;
}
.dgn-ab-name { display: block; font-size: 8px; }
.dgn-ab-meta { display: block; font-size: 7px; color: rgba(242,234,224,.5); margin-top: 4px; }
.dgn-ab.armed { background: #ff5e1f; color: #0a0705; }
.dgn-ab.armed .dgn-ab-meta { color: rgba(10,7,5,.7); }
.dgn-ab.off { opacity: .45; cursor: default; }
.dgn-ab-cd {
  position: absolute; right: -5px; top: -7px; width: 18px; height: 18px; line-height: 18px;
  background: #0a0705; color: #ff9d5e; box-shadow: 0 0 0 2px #000; font-size: 8px; text-align: center;
}
.dgn-side { display: flex; gap: 9px; align-items: stretch; }
.dgn-item { width: 42px; background: #221812; cursor: pointer; font-size: 15px; font-family: inherit; }
.dgn-end {
  padding: 0 14px; background: #ff5e1f; color: #0a0705;
  font-family: inherit; font-size: 8px; text-transform: uppercase; cursor: pointer;
}
.dgn-end:disabled { opacity: .4; cursor: default; }

.dgn-pop {
  position: fixed; z-index: 45; width: 240px;
  background: #16100c;
  padding: 12px 13px; font-size: 8px; line-height: 1.9;
}
.dgn-pop b { color: #ff9d5e; display: block; font-size: 9px; }
.dgn-pop em { display: block; font-style: normal; color: rgba(242,234,224,.55); margin-bottom: 5px; font-size: 7px; }
.dgn-pop p { margin: 7px 0; color: rgba(242,234,224,.75); }
.dgn-pop-abs { display: block; margin: 7px 0; color: #ff9d5e; font-size: 7px; line-height: 2.1; }
.dgn-pop-abs span { display: block; }
.dgn-pop-note { display: block; color: rgba(242,234,224,.4); font-size: 7px; margin: 5px 0; }
.dgn-pop-row { display: flex; gap: 9px; margin-top: 10px; }
.dgn-btn {
  background: #221812; color: #f2eae0;
  padding: 8px 10px; font-family: inherit; font-size: 8px; line-height: 1.6; cursor: pointer; text-align: left;
}
.dgn-btn.acid { background: #ff5e1f; color: #0a0705; }

.dgn-dlg {
  position: absolute; left: 50%; bottom: 116px; transform: translateX(-50%); z-index: 44;
  width: min(540px, calc(100vw - 36px));
  background: #16100c;
  padding: 15px 17px; font-size: 8px; line-height: 2;
}
.dgn-dlg b { color: #9fc6e8; font-size: 8px; text-transform: uppercase; }
.dgn-dlg p { margin: 9px 0 11px; color: rgba(242,234,224,.9); }
.dgn-dlg-choices { display: flex; flex-direction: column; gap: 9px; }

.dgn-over {
  position: absolute; inset: 0; z-index: 46; display: flex; align-items: center; justify-content: center;
  background: rgba(10,7,5,.72);
}
.dgn-over-card {
  width: min(500px, calc(100vw - 36px)); padding: 24px 26px;
  background: #16100c;
  font-size: 9px; line-height: 2;
}
.dgn-over-card b { display: block; color: #ff9d5e; font-size: 13px; margin-bottom: 10px; text-transform: uppercase; }
.dgn-over-card p { margin: 0 0 16px; color: rgba(242,234,224,.85); }
.dgn-over-card .acid { color: #ff5e1f; }

.dgn-hint {
  position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 28;
  max-width: min(600px, calc(100vw - 36px));
  background: rgba(22,16,12,.94);
  padding: 10px 15px; font-size: 8px; line-height: 2.1; text-align: center;
  color: rgba(242,234,224,.8); pointer-events: none;
}
.dgn-hint b { color: #ff9d5e; }

.dgn-title {
  position: absolute; inset: 0; z-index: 52; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px; pointer-events: none; opacity: 0;
  text-align: center;
}
.dgn-title b { font-size: clamp(13px, 2.4vw, 22px); text-transform: uppercase; color: #0a0705; text-shadow: 3px 3px 0 rgba(242,234,224,.35); line-height: 1.6; }
.dgn-title span { font-size: 8px; color: rgba(10,7,5,.7); text-transform: uppercase; }

.dgn-dissolve {
  position: absolute; inset: 0; z-index: 50; width: 100%; height: 100%;
  image-rendering: pixelated; pointer-events: none;
}
@media (max-width: 760px) {
  .dgn-hud { flex-wrap: wrap; justify-content: center; }
  .dgn-log { display: none; }
}
`
