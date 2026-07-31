'use client'

import dynamic from 'next/dynamic'

const ThinkingOrb = dynamic(() => import('thinking-orbs').then((m) => m.ThinkingOrb), { ssr: false })

export function ThinkingOrbWrapper({ state = 'working', size = 64 }) {
  return <ThinkingOrb state={state} size={size} />
}