'use client'

import dynamic from 'next/dynamic'

const CakeDesigner = dynamic(() => import('./CakeDesignerInner'), { ssr: false })

export default function CakeDesigner3D() {
  return <CakeDesigner />
}
