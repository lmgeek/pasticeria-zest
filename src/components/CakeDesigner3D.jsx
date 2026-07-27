import React, { useRef, useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Text, Center } from '@react-three/drei'
import * as THREE from 'three'
import SendModal from './SendModal'
import './CakeDesigner3D.css'

const SHAPES = ['round', 'square', 'heart', 'oval', 'hexagon']
const SIZES = ['small', 'medium', 'large', 'xlarge']
const TIERS = [1, 2, 3]
const COLORS = [
  '#F5E6CC','#D4A853','#E8A87C','#8B5E3C','#7A8B6E','#C94C4C',
  '#6B3A5A','#2C1810','#F0C4A0','#A8C0A0','#B8A0C0','#E8C4A0',
  '#F5D0D0','#C0D4E8','#D4DDCB','#F0E0C0'
]
const FROSTING_COLORS = [
  '#FFFFFF','#FFF5E6','#FFE4E1','#E6F3FF','#F0FFF0','#FFF0F5',
  '#FFFAF0','#FFFAED','#FFF8DC','#FAF0E6','#FAEBD7','#F5F5DC'
]
const DECOS = [
  { id: 'cream', label: 'Glassa' },
  { id: 'cherry', label: 'Ciliegia' },
  { id: 'berry', label: 'Lamponi' },
  { id: 'chocolate', label: 'Cioccolato' },
  { id: 'flowers', label: 'Fiori' },
  { id: 'sprinkles', label: 'Codette' },
  { id: 'gold', label: 'Foglia Oro' },
  { id: 'macaron', label: 'Macaron' },
  { id: 'candle', label: 'Candela' },
  { id: 'meringue', label: 'Meringa' },
  { id: 'nuts', label: 'Frutta Secca' },
  { id: 'lemon', label: 'Limone' },
]
const PATTERNS = [
  { id: 'none', label: 'Nessuno' },
  { id: 'dots', label: 'Puntini' },
  { id: 'stripes', label: 'Strisce' },
  { id: 'waves', label: 'Onde' },
]
const FONTS = ['Playfair Display', 'Dancing Script', 'DM Sans', 'Georgia', 'Courier New']

const sizeMap = { small: 1.2, medium: 1.8, large: 2.4, xlarge: 3.0 }
const TIER_HEIGHT = 0.9

export default function CakeDesigner3D() {
  const [shape, setShape] = useState('round')
  const [size, setSize] = useState('medium')
  const [tiers, setTiers] = useState(1)
  const [color, setColor] = useState('#F5E6CC')
  const [frostingColor, setFrostingColor] = useState('#FFFFFF')
  const [pattern, setPattern] = useState('none')
  const [decos, setDecos] = useState([])
  const [texts, setTexts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [nextText, setNextText] = useState({ text: 'Buon Compleanno', color: '#2C1810', font: 'Playfair Display', size: 0.3 })
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef(null)

  const addDeco = (type) => {
    const angle = (decos.length * 1.1) % (Math.PI * 2)
    const cakeRadius = sizeMap[size] * 0.5
    const radius = cakeRadius * 0.3 + (((decos.length * 7 + 3) % 11) / 11) * cakeRadius * 0.5
    const topY = tiers * TIER_HEIGHT * 0.85 + 0.06
    setDecos(prev => [...prev, {
      id: Date.now() + Math.random(),
      type,
      position: [Math.cos(angle) * radius, topY, Math.sin(angle) * radius],
      rotation: [0, ((decos.length * 3 + 5) % 7) / 7 * Math.PI * 2, 0]
    }])
  }

  const addText = () => {
    if (!nextText.text.trim()) return
    const topY = tiers * TIER_HEIGHT * 0.85 + 0.1
    setTexts(prev => [...prev, {
      ...nextText,
      id: Date.now() + Math.random(),
      position: [0, topY + 0.15, 0]
    }])
    setNextText(s => ({ ...s, text: '' }))
  }

  const removeSelected = () => {
    if (!selectedId) return
    if (selectedId.startsWith('deco-')) {
      const id = parseFloat(selectedId.replace('deco-', ''))
      setDecos(prev => prev.filter(d => d.id !== id))
    } else if (selectedId.startsWith('text-')) {
      const id = parseFloat(selectedId.replace('text-', ''))
      setTexts(prev => prev.filter(t => t.id !== id))
    }
    setSelectedId(null)
  }

  const clearAll = () => {
    setDecos([])
    setTexts([])
    setSelectedId(null)
  }

  const updateDecoPosition = useCallback((id, newPos) => {
    setDecos(prev => prev.map(d => d.id === id ? { ...d, position: newPos } : d))
  }, [])

  const updateTextPosition = useCallback((id, newPos) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, position: newPos } : t))
  }, [])

  return (
    <div className="designer-3d">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Design Studio 3D</span>
          <h2 className="section-title">Crea il tuo <span className="italic">capolavoro</span></h2>
          <p className="section-desc">
            Modella la tua torta in 3D con texture realistiche, decorazioni e illuminazione professionale.
          </p>
        </div>

        <div className="designer-3d-layout">
          <div className="designer-3d-controls">
            <div className="ctrl-section">
              <h4>Forma</h4>
              <div className="shape-grid">
                {SHAPES.map(s => (
                  <button key={s} className={`shape-btn${shape === s ? ' active' : ''}`} onClick={() => setShape(s)}>
                    <ShapeIcon3D type={s} />
                    <span>{s === 'round' ? 'Tonda' : s === 'square' ? 'Quadrata' : s === 'heart' ? 'Cuore' : s === 'oval' ? 'Ovale' : 'Esagonale'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Dimensione</h4>
              <div className="inline-options">
                {SIZES.map(s => (
                  <button key={s} className={`sm-btn${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>
                    {s === 'small' ? 'Piccolo' : s === 'medium' ? 'Medio' : s === 'large' ? 'Grande' : 'Extra'}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Piani</h4>
              <div className="inline-options">
                {TIERS.map(t => (
                  <button key={t} className={`sm-btn${tiers === t ? ' active' : ''}`} onClick={() => setTiers(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Colore Base</h4>
              <div className="color-grid">
                {COLORS.map(c => (
                  <button key={c} className={`color-btn${color === c ? ' active' : ''}`}
                    style={{ background: c }} onClick={() => setColor(c)} />
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Colore Glassa</h4>
              <div className="color-grid">
                {FROSTING_COLORS.map(c => (
                  <button key={c} className={`color-btn${frostingColor === c ? ' active' : ''}`}
                    style={{ background: c }} onClick={() => setFrostingColor(c)} />
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Motivo</h4>
              <div className="inline-options">
                {PATTERNS.map(p => (
                  <button key={p.id} className={`sm-btn${pattern === p.id ? ' active' : ''}`} onClick={() => setPattern(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Decorazioni</h4>
              <div className="deco-grid-3d">
                {DECOS.map(d => (
                  <button key={d.id} className="deco-btn-3d" onClick={() => addDeco(d.id)}>
                    <DecoPreview type={d.id} />
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-section">
              <h4>Carica Immagine</h4>
              <input type="file" accept="image/*" style={{ display: 'none' }} id="deco-upload" />
              <label htmlFor="deco-upload" className="btn btn-outline btn-small" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', display: 'inline-flex' }}>
                + Aggiungi Immagine
              </label>
            </div>

            <div className="ctrl-section">
              <h4>Testo</h4>
              <input className="text-input" value={nextText.text}
                onChange={e => setNextText(s => ({ ...s, text: e.target.value }))}
                placeholder="Scrivi un messaggio..." maxLength={24} />
              <div className="text-options">
                <input type="color" value={nextText.color}
                  onChange={e => setNextText(s => ({ ...s, color: e.target.value }))} />
                <select value={nextText.font}
                  onChange={e => setNextText(s => ({ ...s, font: e.target.value }))}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={nextText.size}
                  onChange={e => setNextText(s => ({ ...s, size: Number(e.target.value) }))}>
                  <option value={0.2}>Piccolo</option>
                  <option value={0.3}>Medio</option>
                  <option value={0.4}>Grande</option>
                  <option value={0.5}>Maxi</option>
                </select>
              </div>
              <button className="btn btn-small btn-primary" onClick={addText}>Aggiungi Testo</button>
            </div>

            <div className="ctrl-actions-3d">
              <button className="btn btn-outline btn-small" onClick={removeSelected} disabled={!selectedId}>
                Rimuovi Selezionato
              </button>
              <button className="btn btn-outline btn-small" onClick={clearAll}>Cancella Tutto</button>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Invia per Valutazione
              </button>
            </div>

            <div className="ctrl-section" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <h4>Camera</h4>
              <label className="checkbox-label">
                <input type="checkbox" checked={autoRotate}
                  onChange={e => setAutoRotate(e.target.checked)} />
                Rotazione Automatica
              </label>
            </div>
          </div>

          <div className="designer-3d-canvas">
            <Canvas
              ref={canvasRef}
              camera={{ position: [5, 4, 5], fov: 35 }}
              shadows
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              style={{ background: 'linear-gradient(180deg, #f8f4f0 0%, #ede5d8 100%)' }}>
              <Suspense fallback={null}>
                <Scene
                  shape={shape}
                  size={sizeMap[size]}
                  tiers={tiers}
                  color={color}
                  frostingColor={frostingColor}
                  pattern={pattern}
                  decos={decos}
                  texts={texts}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  autoRotate={autoRotate}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  updateDecoPosition={updateDecoPosition}
                  updateTextPosition={updateTextPosition}
                />
              </Suspense>
            </Canvas>

            <div className="canvas-info-3d">
              <span>Click: seleziona | Trascina: muovi elemento | Scroll: zoom</span>
            </div>
          </div>
        </div>
      </div>
      {showModal && <SendModal canvasRef={canvasRef} onClose={() => setShowModal(false)} />}
    </div>
  )
}

/* ====== Drag controller - attaches DOM listeners to canvas ====== */
function DragController({ isDragging, setIsDragging, decos, texts, updateDecoPosition, updateTextPosition, setSelectedId }) {
  const { camera, gl, raycaster } = useThree()
  const dragPlane = useMemo(() => new THREE.Plane(), [])
  const dragOffset = useMemo(() => new THREE.Vector3(), [])
  const intersection = useMemo(() => new THREE.Vector3(), [])
  const dragInfo = useRef(null)
  const decosRef = useRef(decos)
  const textsRef = useRef(texts)

  decosRef.current = decos
  textsRef.current = texts

  useEffect(() => {
    const canvas = gl.domElement

    const getPointerPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
    }

    const onPointerDown = (e) => {
      if (e.button !== 0) return

      const pos = getPointerPos(e)
      raycaster.setFromCamera(pos, camera)

      let hitItem = null
      let hitType = null

      const currentDecos = decosRef.current
      const currentTexts = textsRef.current

      for (let i = currentDecos.length - 1; i >= 0; i--) {
        const decoPos = new THREE.Vector3(...currentDecos[i].position)
        const sphere = new THREE.Sphere(decoPos, 0.3)
        if (raycaster.ray.intersectSphere(sphere, intersection)) {
          hitItem = currentDecos[i]
          hitType = 'deco'
          break
        }
      }

      if (!hitItem) {
        for (let i = currentTexts.length - 1; i >= 0; i--) {
          const textPos = new THREE.Vector3(...currentTexts[i].position)
          const sphere = new THREE.Sphere(textPos, 0.5)
          if (raycaster.ray.intersectSphere(sphere, intersection)) {
            hitItem = currentTexts[i]
            hitType = 'text'
            break
          }
        }
      }

      if (hitItem) {
        e.stopPropagation()
        setSelectedId(`${hitType}-${hitItem.id}`)

        const itemPos = new THREE.Vector3(...hitItem.position)
        dragPlane.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 1, 0),
          itemPos
        )

        raycaster.ray.intersectPlane(dragPlane, intersection)
        dragOffset.copy(itemPos).sub(intersection)

        dragInfo.current = { type: hitType, id: hitItem.id }
        setIsDragging(true)
        canvas.style.cursor = 'grabbing'
      }
    }

    const onPointerMove = (e) => {
      if (!dragInfo.current) return

      const pos = getPointerPos(e)
      raycaster.setFromCamera(pos, camera)
      raycaster.ray.intersectPlane(dragPlane, intersection)

      if (!intersection) return

      const newPos = intersection.clone().add(dragOffset)

      if (dragInfo.current.type === 'deco') {
        updateDecoPosition(dragInfo.current.id, [newPos.x, newPos.y, newPos.z])
      } else if (dragInfo.current.type === 'text') {
        updateTextPosition(dragInfo.current.id, [newPos.x, newPos.y, newPos.z])
      }
    }

    const onPointerUp = () => {
      if (dragInfo.current) {
        dragInfo.current = null
        setIsDragging(false)
        canvas.style.cursor = 'default'
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
    }
  }, [camera, gl, raycaster, dragPlane, dragOffset, intersection, setSelectedId, setIsDragging, updateDecoPosition, updateTextPosition])

  return null
}

/* ====== Scene ====== */
function Scene({ shape, size, tiers, color, frostingColor, pattern, decos, texts, selectedId, setSelectedId, autoRotate, isDragging, setIsDragging, updateDecoPosition, updateTextPosition }) {
  const cakeY = 0.5

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-4, 6, -4]} intensity={0.4} color="#fff5e6" />
      <pointLight position={[4, 4, 4]} intensity={0.3} color="#e6f3ff" />

      <Environment preset="apartment" />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={5}
      />

      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[size * 0.65, size * 0.7, 0.1, 64]} />
        <meshStandardMaterial color="#f0ebe3" roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[size * 0.62, size * 0.62, 0.02, 64]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.15} metalness={0.08} />
      </mesh>

      <group position={[0, cakeY, 0]}>
        <CakeModel
          shape={shape}
          size={size}
          tiers={tiers}
          color={color}
          frostingColor={frostingColor}
          pattern={pattern}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />

        {decos.map(deco => (
          <DecoModel
            key={deco.id}
            deco={deco}
            isSelected={selectedId === `deco-${deco.id}`}
            isDragging={isDragging}
          />
        ))}

        {texts.map(text => (
          <TextModel
            key={text.id}
            text={text}
            isSelected={selectedId === `text-${text.id}`}
            isDragging={isDragging}
          />
        ))}
      </group>

      <DragController
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        decos={decos}
        texts={texts}
        updateDecoPosition={updateDecoPosition}
        updateTextPosition={updateTextPosition}
        setSelectedId={setSelectedId}
      />

      <OrbitControls
        autoRotate={autoRotate && !isDragging}
        autoRotateSpeed={1.2}
        enablePan={false}
        enabled={!isDragging}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.3}
        minDistance={4}
        maxDistance={12}
        target={[0, cakeY + tiers * TIER_HEIGHT * 0.4, 0]}
      />
    </>
  )
}

/* ====== Cake Model ====== */
function CakeModel({ shape, size, tiers, color, frostingColor, pattern, selectedId, setSelectedId }) {
  return (
    <group onClick={(e) => { e.stopPropagation(); setSelectedId('cake') }}>
      {Array.from({ length: tiers }).map((_, i) => {
        const scale = 1 - i * 0.15
        const y = i * TIER_HEIGHT * 0.85
        const tierSize = size * scale

        return (
          <group key={i} position={[0, y, 0]}>
            <CakeTier
              shape={shape}
              size={tierSize}
              height={TIER_HEIGHT}
              color={color}
              frostingColor={frostingColor}
              pattern={pattern}
              tierIndex={i}
              isSelected={selectedId === 'cake'}
            />
          </group>
        )
      })}
    </group>
  )
}

function CakeTier({ shape, size, height, color, frostingColor, pattern, tierIndex, isSelected }) {
  const [hovered, setHovered] = useState(false)

  const dripData = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2
      return {
        angle,
        length: 0.15 + (((i * 7 + 3) % 11) / 11) * 0.35,
        width: 0.06 + (((i * 3 + 5) % 7) / 7) * 0.04,
      }
    })
  }, [])

  const patternElements = useMemo(() => {
    if (pattern === 'none') return []
    const elements = []
    if (pattern === 'dots') {
      const count = 24
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const r = size / 2 + 0.01
        elements.push({
          key: `dot-${tierIndex}-${i}`,
          pos: [Math.cos(angle) * r, height / 2 + 0.01, Math.sin(angle) * r],
          type: 'dot'
        })
      }
    } else if (pattern === 'stripes') {
      const count = 10
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const r = size / 2 + 0.005
        elements.push({
          key: `stripe-${tierIndex}-${i}`,
          pos: [Math.cos(angle) * r * 0.85, 0, Math.sin(angle) * r * 0.85],
          rot: [0, -angle + Math.PI / 2, 0],
          type: 'stripe'
        })
      }
    } else if (pattern === 'waves') {
      const count = 8
      for (let i = 0; i < count; i++) {
        const yPos = -height / 2 + (i + 1) * (height / (count + 1))
        elements.push({
          key: `wave-${tierIndex}-${i}`,
          pos: [0, yPos, 0],
          type: 'wave',
          radius: size / 2 + 0.005
        })
      }
    }
    return elements
  }, [pattern, size, height, tierIndex])

  const renderGeometry = () => {
    switch (shape) {
      case 'round':
        return <cylinderGeometry args={[size / 2, size / 2, height, 64]} />
      case 'square':
        return <boxGeometry args={[size, height, size]} />
      case 'heart':
        return <HeartGeometry size={size} height={height} />
      case 'oval':
        return <OvalGeometry size={size} height={height} />
      case 'hexagon':
        return <cylinderGeometry args={[size / 2, size / 2, height, 6]} />
      default:
        return <cylinderGeometry args={[size / 2, size / 2, height, 64]} />
    }
  }

  const renderFrostingGeo = () => {
    const extra = 0.04
    switch (shape) {
      case 'square':
        return <boxGeometry args={[size + extra * 2, 0.06, size + extra * 2]} />
      default:
        return <cylinderGeometry args={[size / 2 + extra, size / 2 + extra, 0.06, 64]} />
    }
  }

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}>
        {renderGeometry()}
        <meshStandardMaterial
          color={hovered ? lightenColor(color, 15) : color}
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.03, 0]} castShadow>
        {renderFrostingGeo()}
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {shape === 'round' && (
        <group>
          {dripData.map((d, i) => {
            const r = size / 2
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(d.angle) * (r + 0.01),
                  height / 2 - d.length * 0.3,
                  Math.sin(d.angle) * (r + 0.01)
                ]}
                scale={[d.width, d.length, d.width]}
                castShadow>
                <sphereGeometry args={[1, 8, 12]} />
                <meshPhysicalMaterial
                  color={frostingColor}
                  roughness={0.25}
                  metalness={0.05}
                  clearcoat={0.5}
                  clearcoatRoughness={0.3}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {patternElements.map(el => {
        if (el.type === 'dot') {
          return (
            <mesh key={el.key} position={el.pos}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} transparent opacity={0.7} />
            </mesh>
          )
        }
        if (el.type === 'stripe') {
          return (
            <mesh key={el.key} position={el.pos} rotation={el.rot}>
              <boxGeometry args={[0.015, height * 0.8, 0.015]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} transparent opacity={0.5} />
            </mesh>
          )
        }
        if (el.type === 'wave') {
          return <WaveRing key={el.key} pos={el.pos} radius={el.radius} />
        }
        return null
      })}

      {isSelected && (
        <mesh position={[0, height / 2 + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size / 2 + 0.08, size / 2 + 0.12, 48]} />
          <meshBasicMaterial color="#D4A853" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

/* ====== Heart Geometry ====== */
function HeartGeometry({ size, height }) {
  const shape = new THREE.Shape()
  const s = size / 2

  shape.moveTo(0, -s * 0.4)
  shape.bezierCurveTo(0, -s * 0.55, -s * 0.1, -s * 0.7, -s * 0.35, -s * 0.7)
  shape.bezierCurveTo(-s * 0.7, -s * 0.7, -s * 0.7, -s * 0.35, -s * 0.7, -s * 0.35)
  shape.bezierCurveTo(-s * 0.7, -s * 0.05, -s * 0.45, s * 0.2, 0, s * 0.55)
  shape.bezierCurveTo(s * 0.45, s * 0.2, s * 0.7, -s * 0.05, s * 0.7, -s * 0.35)
  shape.bezierCurveTo(s * 0.7, -s * 0.35, s * 0.7, -s * 0.7, s * 0.35, -s * 0.7)
  shape.bezierCurveTo(s * 0.1, -s * 0.7, 0, -s * 0.55, 0, -s * 0.4)

  const extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4
  }

  return <extrudeGeometry args={[shape, extrudeSettings]} rotation={[-Math.PI / 2, 0, 0]} />
}

function OvalGeometry({ size, height }) {
  return (
    <mesh scale={[1, 1, 0.65]}>
      <cylinderGeometry args={[size / 2, size / 2, height, 64]} />
    </mesh>
  )
}

function WaveRing({ pos, radius }) {
  const curve = useMemo(() => {
    const pts = []
    for (let a = 0; a <= Math.PI * 2; a += 0.1) {
      const wobble = Math.sin(a * 6) * 0.02
      pts.push(new THREE.Vector3(
        Math.cos(a) * (radius + wobble),
        0,
        Math.sin(a) * (radius + wobble)
      ))
    }
    return new THREE.CatmullRomCurve3(pts, true)
  }, [radius])

  return (
    <mesh position={pos}>
      <tubeGeometry args={[curve, 64, 0.008, 4, true]} />
      <meshStandardMaterial color="#ffffff" roughness={0.4} transparent opacity={0.4} />
    </mesh>
  )
}

/* ====== DecoModel - Draggable ====== */
function DecoModel({ deco, isSelected, isDragging }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current && !isSelected) {
      ref.current.rotation.y += 0.003
    }
  })

  const renderDeco = () => {
    switch (deco.type) {
      case 'cherry':
        return (
          <group>
            <mesh castShadow position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshPhysicalMaterial color="#C94C4C" roughness={0.2} metalness={0.15} clearcoat={0.9} clearcoatRoughness={0.1} />
            </mesh>
            <mesh position={[0.02, 0.14, 0]}>
              <cylinderGeometry args={[0.008, 0.012, 0.1, 6]} />
              <meshStandardMaterial color="#4A6B3A" roughness={0.6} />
            </mesh>
          </group>
        )
      case 'cream':
        return (
          <mesh castShadow position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshPhysicalMaterial color="#FFF5E6" roughness={0.2} metalness={0.05} clearcoat={0.7} clearcoatRoughness={0.15} />
          </mesh>
        )
      case 'berry':
        return (
          <group>
            {[[-0.06, 0.04, 0], [0.06, 0.04, 0], [0, 0.04, -0.06], [0, 0.08, 0.04]].map((pos, i) => (
              <mesh key={i} position={pos} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={['#8B2252', '#A0325A', '#7A2850', '#943060'][i]} roughness={0.5} />
              </mesh>
            ))}
          </group>
        )
      case 'chocolate':
        return (
          <group>
            {[0, 1, 2, 3, 4].map(i => {
              const a = (i / 5) * Math.PI * 2
              return (
                <mesh key={i} position={[Math.cos(a) * 0.06, 0.03, Math.sin(a) * 0.06]}
                  rotation={[0.3 * i, a, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.04, 0.02]} />
                  <meshStandardMaterial color={`hsl(25, 50%, ${18 + i * 5}%)`} roughness={0.4} metalness={0.1} />
                </mesh>
              )
            })}
          </group>
        )
      case 'flowers':
        return (
          <group>
            {[0, 1, 2, 3, 4].map(i => {
              const a = (i / 5) * Math.PI * 2
              const petalColors = ['#E8A87C', '#D4A0A0', '#F5E6CC', '#D4A853', '#E8C4A0']
              return (
                <mesh key={i}
                  position={[Math.cos(a) * 0.07, 0.04, Math.sin(a) * 0.07]}
                  castShadow>
                  <sphereGeometry args={[0.04, 8, 6]} />
                  <meshStandardMaterial color={petalColors[i]} roughness={0.5} />
                </mesh>
              )
            })}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#D4A853" roughness={0.3} />
            </mesh>
          </group>
        )
      case 'sprinkles':
        return (
          <group>
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2
              const r = 0.06 + (i % 3) * 0.03
              const colors = ['#D4A853', '#E8A87C', '#C94C4C', '#7A8B6E', '#B8A0C0', '#E8C4A0']
              const rotX = (((i * 3 + 1) % 7) / 7) * 0.5
              const rotZ = (((i * 5 + 2) % 7) / 7) * 0.5
              return (
                <mesh key={i}
                  position={[Math.cos(a) * r, 0.04, Math.sin(a) * r]}
                  rotation={[rotX, a, rotZ]}
                  castShadow>
                  <capsuleGeometry args={[0.008, 0.03, 4, 6]} />
                  <meshStandardMaterial color={colors[i % colors.length]} roughness={0.4} />
                </mesh>
              )
            })}
          </group>
        )
      case 'gold':
        return (
          <mesh castShadow position={[0, 0.04, 0]}>
            <dodecahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.85} />
          </mesh>
        )
      case 'macaron':
        return (
          <group position={[0, 0.06, 0]}>
            <mesh position={[0, 0.035, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
              <meshStandardMaterial color="#B8A0C0" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.085, 0.085, 0.025, 16]} />
              <meshPhysicalMaterial color="#E8D5A3" roughness={0.25} clearcoat={0.4} clearcoatRoughness={0.3} />
            </mesh>
            <mesh position={[0, -0.035, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
              <meshStandardMaterial color="#B8A0C0" roughness={0.45} />
            </mesh>
          </group>
        )
      case 'candle':
        return (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
              <meshStandardMaterial color="#F0C4A0" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
            <pointLight position={[0, 0.42, 0]} intensity={0.6} color="#FFAA00" distance={1.5} decay={2} />
          </group>
        )
      case 'meringue':
        return (
          <group position={[0, 0.06, 0]}>
            {[0, 1, 2].map(i => {
              const a = (i / 3) * Math.PI * 2
              return (
                <mesh key={i} position={[Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05]} castShadow>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color="#F5E6CC" roughness={0.35} />
                </mesh>
              )
            })}
          </group>
        )
      case 'nuts':
        return (
          <group>
            {[0, 1, 2].map(i => {
              const a = (i / 3) * Math.PI * 2 + 0.3
              return (
                <mesh key={i} position={[Math.cos(a) * 0.06, 0.03, Math.sin(a) * 0.06]}
                  rotation={[0.5, a, 0]} castShadow>
                  <capsuleGeometry args={[0.025, 0.04, 4, 8]} />
                  <meshStandardMaterial color="#8B5E3C" roughness={0.7} />
                </mesh>
              )
            })}
          </group>
        )
      case 'lemon':
        return (
          <group position={[0, 0.05, 0]}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#E8D44D" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <circleGeometry args={[0.04, 12]} />
              <meshStandardMaterial color="#F5F0A0" roughness={0.3} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh castShadow position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#cccccc" roughness={0.5} />
          </mesh>
        )
    }
  }

  return (
    <group
      ref={ref}
      position={deco.position}
      rotation={deco.rotation}>
      {renderDeco()}
      {isSelected && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.18, 24]} />
          <meshBasicMaterial color="#D4A853" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

/* ====== TextModel - Draggable ====== */
function TextModel({ text, isSelected }) {
  return (
    <group
      position={text.position}>
      <Center>
        <Text
          fontSize={text.size}
          color={text.color}
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
          lineHeight={1.2}
          letterSpacing={0.02}
          castShadow>
          {text.text}
        </Text>
      </Center>
      {isSelected && (
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[text.text.length * text.size * 0.55 + 0.3, text.size + 0.25]} />
          <meshBasicMaterial color="#D4A853" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

/* ====== Icons & Utils ====== */
function ShapeIcon3D({ type }) {
  const props = { viewBox: '0 0 60 60', width: 28, height: 28, style: { color: 'currentColor' } }
  if (type === 'round') return <svg {...props}><ellipse cx="30" cy="35" rx="20" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 35 L10 25 Q10 15 30 15 Q50 15 50 25 L50 35" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'square') return <svg {...props}><rect x="12" y="20" width="36" height="25" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 20 L18 10 L42 10 L48 20" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'heart') return <svg {...props}><path d="M30 45 C30 45 10 32 10 20 C10 12 16 7 22 7 C26 7 30 12 30 12 C30 12 34 7 38 7 C44 7 50 12 50 20 C50 32 30 45 30 45Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'oval') return <svg {...props}><ellipse cx="30" cy="32" rx="22" ry="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 32 L8 22 Q8 12 30 12 Q52 12 52 22 L52 32" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'hexagon') return <svg {...props}><polygon points="30,8 48,18 48,38 30,48 12,38 12,18" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  return null
}

function DecoPreview({ type }) {
  const previewMap = {
    cream: '◯', cherry: '●', berry: '∘∘', chocolate: '▬',
    flowers: '✿', sprinkles: '∴', gold: '◆', macaron: '◎',
    candle: '│', meringue: '∩', nuts: '○○', lemon: '○'
  }
  return <span className="deco-preview-icon">{previewMap[type] || '•'}</span>
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
