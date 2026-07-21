import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import GameLoader from './game-loader'

// loaded only on this route — the main portfolio never ships the pixel font
const pixel = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' })

export const metadata: Metadata = {
  // `absolute` opts out of the root title template — the easter egg should not
  // announce whose site it is in the tab title.
  title: { absolute: '??? — you found something' },
  robots: { index: false, follow: false },
}

export default function DungeonPage() {
  return (
    <div className={pixel.variable}>
      <GameLoader />
    </div>
  )
}
