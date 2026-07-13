"use client"

import dynamic from 'next/dynamic'

// stay solid orange while the game chunk loads, so the hover-wipe from the
// portfolio feels continuous — the game then dithers the orange away itself
const OrangeVoid = () => <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#ff5e1f' }} />

const DungeonGame = dynamic(() => import('./game/dungeon-game'), {
  ssr: false,
  loading: OrangeVoid,
})

export default function GameLoader() {
  return <DungeonGame />
}
