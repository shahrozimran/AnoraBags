"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import * as THREE from "three"
import {
  RotateCw,
  Sparkles,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Camera,
  Layers,
  Check,
  AlertCircle
} from "lucide-react"

export type CameraAngle = "front" | "threeQuarter" | "side" | "top"

export interface Bag3DCanvasProps {
  initialColor?: string
  color?: string
  onColorChange?: (colorHex: string) => void
  bagModel?: "crossbody" | "satchel" | "top-handle"
  interactive?: boolean
  className?: string
  showControls?: boolean
  cameraAngle?: CameraAngle
}

export const COLOR_PRESETS = [
  { name: "Anora Chocolate Brown", hex: "#462F1D", roughness: 0.35, metalness: 0.05 },
  { name: "Anora Light Nude", hex: "#ECE2D8", roughness: 0.3, metalness: 0.05 },
  { name: "Obsidian Noir", hex: "#1A1715", roughness: 0.35, metalness: 0.05 },
  { name: "Saddle Cognac", hex: "#9E5B32", roughness: 0.38, metalness: 0.05 },
  { name: "Rich Bordeaux", hex: "#4A1525", roughness: 0.35, metalness: 0.05 }
]

const CAMERA_PRESETS: Record<CameraAngle, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  front: { position: [0, 0.2, 3.8], lookAt: [0, 0, 0] },
  threeQuarter: { position: [2.0, 1.1, 3.2], lookAt: [0, 0, 0] },
  side: { position: [3.4, 0.2, 0.4], lookAt: [0, 0, 0] },
  top: { position: [0, 3.4, 1.2], lookAt: [0, 0, 0] }
}

export function Bag3DCanvas({
  initialColor = "#462F1D",
  color,
  onColorChange,
  bagModel = "crossbody",
  interactive = true,
  className = "w-full h-full min-h-[420px]",
  showControls = true,
  cameraAngle
}: Bag3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeColor, setActiveColor] = useState(color || initialColor)
  const [isRotating, setIsRotating] = useState(true)
  const [hardwareFinish, setHardwareFinish] = useState<"gold" | "silver">("gold")
  const [activeAngle, setActiveAngle] = useState<CameraAngle>(cameraAngle || "threeQuarter")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasWebGLError, setHasWebGLError] = useState(false)

  // Sync external color prop if provided
  useEffect(() => {
    if (color && color !== activeColor) {
      setActiveColor(color)
    }
  }, [color])

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const bagGroupRef = useRef<THREE.Group | null>(null)
  const leatherMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([])
  const hardwareMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([])
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 })
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.0, 1.1, 3.2))

  const handleSelectColor = (hex: string) => {
    setActiveColor(hex)
    if (onColorChange) {
      onColorChange(hex)
    }
  }

  // 1. Scene & Renderer Initialization
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Pre-flight WebGL support check
    try {
      const testCanvas = document.createElement("canvas")
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl")
      if (!gl) {
        throw new Error("WebGL context unavailable")
      }
    } catch {
      setHasWebGLError(true)
      return
    }

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
    } catch {
      setHasWebGLError(true)
      return
    }

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const width = Math.max(container.clientWidth || 600, 320)
    const height = Math.max(container.clientHeight || 450, 320)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    const initialPreset = CAMERA_PRESETS.threeQuarter
    camera.position.set(...initialPreset.position)
    camera.lookAt(...initialPreset.lookAt)
    cameraRef.current = camera
    targetCameraPosRef.current.set(...initialPreset.position)

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    rendererRef.current = renderer

    container.replaceChildren(renderer.domElement)

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.15)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.4)
    keyLight.position.set(4, 5, 4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.001
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe4edff, 1.3)
    fillLight.position.set(-4, 3, -2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffd700, 1.5)
    rimLight.position.set(0, -2, -4)
    scene.add(rimLight)

    const spotLight = new THREE.SpotLight(0xffffff, 1.8, 15, Math.PI / 5, 0.4)
    spotLight.position.set(0, 5, 2)
    scene.add(spotLight)

    // Procedural leather bump map
    leatherMaterialsRef.current = []
    hardwareMaterialsRef.current = []

    const bumpCanvas = document.createElement("canvas")
    bumpCanvas.width = 128
    bumpCanvas.height = 128
    const ctx = bumpCanvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#808080"
      ctx.fillRect(0, 0, 128, 128)
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 128
        const y = Math.random() * 128
        const r = Math.random() * 2 + 0.5
        ctx.fillStyle = Math.random() > 0.5 ? "#999999" : "#666666"
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
    bumpTexture.wrapS = THREE.RepeatWrapping
    bumpTexture.wrapT = THREE.RepeatWrapping
    bumpTexture.repeat.set(6, 6)

    const baseColor = new THREE.Color(activeColor)
    const leatherMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0.04,
      bumpMap: bumpTexture,
      bumpScale: 0.015
    })
    leatherMaterialsRef.current.push(leatherMat)

    const accentColor = new THREE.Color(activeColor).offsetHSL(0.02, 0.05, 0.08)
    const accentLeatherMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.32,
      metalness: 0.04,
      bumpMap: bumpTexture,
      bumpScale: 0.012
    })
    leatherMaterialsRef.current.push(accentLeatherMat)

    const hardwareColor = hardwareFinish === "gold" ? new THREE.Color(0xd4af37) : new THREE.Color(0xdcdcdc)
    const goldHardwareMat = new THREE.MeshStandardMaterial({
      color: hardwareColor,
      metalness: 0.94,
      roughness: 0.2
    })
    hardwareMaterialsRef.current.push(goldHardwareMat)

    // Build Luxury Handbag Procedural Model
    const bagGroup = new THREE.Group()
    bagGroupRef.current = bagGroup

    // Main Bag Body: Trapezoidal structured box
    const bodyGeometry = new THREE.BoxGeometry(1.6, 1.25, 0.75, 4, 4, 4)
    const posAttr = bodyGeometry.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i)
      if (y > 0) {
        posAttr.setX(i, posAttr.getX(i) * 0.9)
        posAttr.setZ(i, posAttr.getZ(i) * 0.82)
      }
    }
    bodyGeometry.computeVertexNormals()

    const bodyMesh = new THREE.Mesh(bodyGeometry, leatherMat)
    bodyMesh.castShadow = true
    bodyMesh.receiveShadow = true
    bagGroup.add(bodyMesh)

    // Gusset / Side Panels (Accordion pleats)
    const sideGussetGeo = new THREE.BoxGeometry(0.04, 1.15, 0.65)
    const leftGusset = new THREE.Mesh(sideGussetGeo, accentLeatherMat)
    leftGusset.position.set(-0.78, -0.02, 0)
    bagGroup.add(leftGusset)

    const rightGusset = new THREE.Mesh(sideGussetGeo, accentLeatherMat)
    rightGusset.position.set(0.78, -0.02, 0)
    bagGroup.add(rightGusset)

    // Front Flap: Curves over the front with gentle radius
    const flapGeo = new THREE.CylinderGeometry(0.75, 0.77, 0.06, 32, 1, false, 0, Math.PI)
    flapGeo.rotateZ(Math.PI / 2)
    flapGeo.rotateY(Math.PI / 2)
    const flapMesh = new THREE.Mesh(flapGeo, leatherMat)
    flapMesh.position.set(0, 0.18, 0.38)
    flapMesh.castShadow = true
    bagGroup.add(flapMesh)

    // Flap top bridge
    const flapTopGeo = new THREE.BoxGeometry(1.54, 0.4, 0.68)
    const flapTopMesh = new THREE.Mesh(flapTopGeo, leatherMat)
    flapTopMesh.position.set(0, 0.5, 0.05)
    flapTopMesh.castShadow = true
    bagGroup.add(flapTopMesh)

    // Luxury Anora Hardware Clasp (Circular twist-lock as seen in photos)
    const ringLockOuterGeo = new THREE.TorusGeometry(0.14, 0.035, 24, 36)
    const ringLockOuter = new THREE.Mesh(ringLockOuterGeo, goldHardwareMat)
    ringLockOuter.position.set(0, -0.05, 0.42)
    ringLockOuter.castShadow = true
    bagGroup.add(ringLockOuter)

    const ringLockStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.14, 16)
    const ringLockStem = new THREE.Mesh(ringLockStemGeo, goldHardwareMat)
    ringLockStem.position.set(0, -0.12, 0.42)
    bagGroup.add(ringLockStem)

    const ringLockBasePlateGeo = new THREE.BoxGeometry(0.18, 0.22, 0.03)
    const ringLockBasePlate = new THREE.Mesh(ringLockBasePlateGeo, goldHardwareMat)
    ringLockBasePlate.position.set(0, -0.08, 0.395)
    bagGroup.add(ringLockBasePlate)

    // Top Rolled Leather Handle
    const handleCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.45, 0.68, 0),
      new THREE.Vector3(0, 1.45, 0),
      new THREE.Vector3(0.45, 0.68, 0)
    )
    const handleGeo = new THREE.TubeGeometry(handleCurve, 24, 0.05, 12, false)
    const handleMesh = new THREE.Mesh(handleGeo, accentLeatherMat)
    handleMesh.castShadow = true
    bagGroup.add(handleMesh)

    // Handle Metal Rings / D-Rings
    const dRingGeo = new THREE.TorusGeometry(0.075, 0.02, 16, 24)
    const leftRing = new THREE.Mesh(dRingGeo, goldHardwareMat)
    leftRing.position.set(-0.45, 0.68, 0)
    bagGroup.add(leftRing)

    const rightRing = new THREE.Mesh(dRingGeo, goldHardwareMat)
    rightRing.position.set(0.45, 0.68, 0)
    bagGroup.add(rightRing)

    // Draped Woven Gold Shoulder Chain Links
    const chainCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.8, 0.5, 0),
      new THREE.Vector3(-1.2, -0.4, 0.4),
      new THREE.Vector3(1.2, -0.4, 0.4),
      new THREE.Vector3(0.8, 0.5, 0)
    )
    const chainGeo = new THREE.TubeGeometry(chainCurve, 40, 0.025, 8, false)
    const chainMesh = new THREE.Mesh(chainGeo, goldHardwareMat)
    chainMesh.castShadow = true
    bagGroup.add(chainMesh)

    // Leather Shoulder Rest on Chain
    const strapRestCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.35, -0.4, 0.4),
      new THREE.Vector3(0, -0.44, 0.42),
      new THREE.Vector3(0.35, -0.4, 0.4)
    )
    const strapRestGeo = new THREE.TubeGeometry(strapRestCurve, 16, 0.045, 12, false)
    const strapRestMesh = new THREE.Mesh(strapRestGeo, leatherMat)
    bagGroup.add(strapRestMesh)

    // Bottom Protective Metal Studs / Feet
    const footGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.03, 12)
    const footPositions = [
      [-0.6, -0.63, 0.24],
      [0.6, -0.63, 0.24],
      [-0.6, -0.63, -0.24],
      [0.6, -0.63, -0.24]
    ]
    footPositions.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(footGeo, goldHardwareMat)
      foot.position.set(x, y, z)
      bagGroup.add(foot)
    })

    // Gentle floating pedestal shadow
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.02, 48)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x221e1d,
      roughness: 0.9,
      transparent: true,
      opacity: 0.12
    })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.set(0, -0.66, 0)
    pedestal.receiveShadow = true
    scene.add(pedestal)

    scene.add(bagGroup)
    setIsLoaded(true)

    // Interactive Orbit & Animation Loop
    let animationFrameId: number

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop)

      if (bagGroupRef.current) {
        if (!isDraggingRef.current && isRotating) {
          // Smoothly glide toward baseline orbit speed (0.003) so flick inertia decays naturally
          rotationVelocityRef.current.y = rotationVelocityRef.current.y * 0.94 + 0.003 * 0.06
          bagGroupRef.current.rotation.y += rotationVelocityRef.current.y
        } else if (!isDraggingRef.current) {
          // Smooth inertia decay when rotation is paused
          bagGroupRef.current.rotation.y += rotationVelocityRef.current.y
          rotationVelocityRef.current.y *= 0.92
        }

        // Floating gentle breathing motion
        const time = Date.now() * 0.0015
        bagGroupRef.current.position.y = Math.sin(time) * 0.035
      }

      // Smooth camera lerp to target preset
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.06)
        cameraRef.current.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }

    renderLoop()

    // Mouse & Touch Drag Controls
    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return
      isDraggingRef.current = true
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !bagGroupRef.current) return
      const deltaX = e.clientX - previousMousePositionRef.current.x
      const deltaY = e.clientY - previousMousePositionRef.current.y

      bagGroupRef.current.rotation.y += deltaX * 0.008
      bagGroupRef.current.rotation.x = Math.max(
        -0.4,
        Math.min(0.4, bagGroupRef.current.rotation.x + deltaY * 0.005)
      )

      // Store inertia velocity
      rotationVelocityRef.current.y = deltaX * 0.002
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return
      isDraggingRef.current = true
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !bagGroupRef.current || e.touches.length === 0) return
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y

      bagGroupRef.current.rotation.y += deltaX * 0.009
      bagGroupRef.current.rotation.x = Math.max(
        -0.4,
        Math.min(0.4, bagGroupRef.current.rotation.x + deltaY * 0.006)
      )

      rotationVelocityRef.current.y = deltaX * 0.002
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const onTouchEnd = () => {
      isDraggingRef.current = false
    }

    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(w, h)
      }
    }

    window.addEventListener("resize", onResize)
    const dom = renderer.domElement
    dom.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    dom.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", onResize)
      dom.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      dom.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      renderer.dispose()
      renderer.forceContextLoss?.()
    }
  }, [interactive])

  // Dynamic Color Update (without rebuilding scene)
  useEffect(() => {
    leatherMaterialsRef.current.forEach((mat, idx) => {
      const col = new THREE.Color(activeColor)
      if (idx === 1) {
        mat.color.copy(col.offsetHSL(0.02, 0.05, 0.08))
      } else {
        mat.color.copy(col)
      }
      mat.needsUpdate = true
    })
  }, [activeColor])

  // Dynamic Hardware Update (without rebuilding scene)
  useEffect(() => {
    const col = hardwareFinish === "gold" ? new THREE.Color(0xd4af37) : new THREE.Color(0xdcdcdc)
    hardwareMaterialsRef.current.forEach((mat) => {
      mat.color.copy(col)
      mat.needsUpdate = true
    })
  }, [hardwareFinish])

  // Camera Preset Navigation
  const setCameraPreset = (angle: CameraAngle) => {
    setActiveAngle(angle)
    const preset = CAMERA_PRESETS[angle]
    targetCameraPosRef.current.set(...preset.position)
  }

  // Sync external camera angle prop if provided
  useEffect(() => {
    if (cameraAngle && CAMERA_PRESETS[cameraAngle]) {
      setCameraPreset(cameraAngle)
    }
  }, [cameraAngle])

  // Zoom controls
  const handleZoom = (inOut: "in" | "out") => {
    const current = targetCameraPosRef.current.length()
    const factor = inOut === "in" ? 0.8 : 1.25
    const newLen = Math.max(2.6, Math.min(5.8, current * factor))
    targetCameraPosRef.current.normalize().multiplyScalar(newLen)
  }

  const handleReset = () => {
    if (bagGroupRef.current) {
      bagGroupRef.current.rotation.set(0, 0, 0)
    }
    setCameraPreset("threeQuarter")
    rotationVelocityRef.current = { x: 0, y: 0.003 }
    setIsRotating(true)
  }

  // Graceful 2D Fallback if WebGL is unavailable
  if (hasWebGLError) {
    return (
      <div className={`relative flex flex-col items-center justify-between p-6 rounded-2xl bg-[#FAF6F1] border border-[#E5DCD2] select-none overflow-hidden ${className}`}>
        <div className="w-full flex items-center justify-between pb-3 border-b border-[#E5DCD2]">
          <div className="flex items-center gap-2 text-[#23170F] text-sm font-semibold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#462F1D]" />
            <span>Maison Anora Lookbook</span>
          </div>
          <span className="text-xs sm:text-sm text-[#462F1D] font-medium">
            100% Cash On Delivery
          </span>
        </div>

        {/* Fallback Image */}
        <div className="relative w-full max-w-sm aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-stone-300 my-4 bg-white">
          <Image
            src="/images/products/bordeaux-crossbody-hero.jpeg"
            alt="The Anora Bordeaux Flap Crossbody Bag"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-stone-900/10 pointer-events-none" />
        </div>

        {/* Fallback color choices */}
        <div className="w-full bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200 space-y-2 text-center">
          <p className="text-xs sm:text-sm text-[#3D291B] font-normal">
            3D WebGL accelerated hardware not detected on this browser. Showing high-definition atelier photography.
          </p>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            {COLOR_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectColor(p.hex)}
                title={p.name}
                className={`w-6 h-6 rounded-full border-2 ${activeColor === p.hex ? "border-[#23170F] scale-110 shadow-xs" : "border-white"}`}
                style={{ backgroundColor: p.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#23170F]/5 via-[#FAF6F1]/50 to-[#ECE2D8]/40 select-none ${className}`}>
      {/* 3D WebGL Canvas Mount with touch gesture isolation */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAF6F1]/85 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#E5DCD2] border-t-[#462F1D] animate-spin" />
            <span className="text-xs font-semibold font-sans uppercase tracking-[0.18em] text-[#462F1D]">
              Initializing 3D Atelier...
            </span>
          </div>
        </div>
      )}

      {/* Subtle Atelier Stamp (Top Left) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5DCD2] text-xs font-sans tracking-[0.14em] uppercase text-[#462F1D] font-semibold shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#462F1D]" />
        <span>Atelier 3D • 360° Studio</span>
      </div>

      {/* Drag hint overlay (Top Right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-[#462F1D] font-medium px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5DCD2] shadow-2xs">
        <span>Drag To Orbit</span>
      </div>

      {/* Mobile Camera Angle Presets */}
      <div className="absolute top-14 sm:hidden inset-x-2 flex flex-wrap items-center justify-center gap-1.5 z-10 text-xs uppercase font-sans tracking-wider pointer-events-auto">
        {(["threeQuarter", "front", "side", "top"] as CameraAngle[]).map((ang) => (
          <button
            key={ang}
            onClick={() => setCameraPreset(ang)}
            className={`px-3 py-1 rounded-full transition-all duration-200 border shadow-2xs text-xs font-medium ${
              activeAngle === ang
                ? "bg-[#462F1D] text-[#FAF6F1] font-semibold border-[#462F1D]"
                : "bg-white/95 text-[#3D291B] border-[#E5DCD2] hover:bg-white"
            }`}
          >
            {ang === "threeQuarter" ? "3/4 View" : ang === "front" ? "Front" : ang === "side" ? "Gusset" : "Top"}
          </button>
        ))}
      </div>

      {/* Desktop Camera Angle Presets (Right side floating pill) */}
      <div className="absolute top-16 right-4 hidden sm:flex flex-col gap-1.5 p-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#E5DCD2] shadow-xs z-10 text-xs uppercase font-sans tracking-wider">
        {(["threeQuarter", "front", "side", "top"] as CameraAngle[]).map((ang) => (
          <button
            key={ang}
            onClick={() => setCameraPreset(ang)}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-left font-medium ${
              activeAngle === ang
                ? "bg-[#462F1D] text-[#FAF6F1] font-semibold"
                : "text-[#3D291B] hover:bg-[#ECE2D8]/50"
            }`}
          >
            {ang === "threeQuarter" ? "3/4 View" : ang === "front" ? "Front" : ang === "side" ? "Gusset" : "Top"}
          </button>
        ))}
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-2 inset-x-2 xs:bottom-4 xs:inset-x-4 flex flex-wrap items-center justify-between gap-2.5 p-2.5 xs:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5DCD2] shadow-md">
          {/* Color Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans tracking-[0.12em] font-semibold text-[#462F1D] uppercase hidden xs:inline">
              Leather:
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_PRESETS.map((p) => {
                const isSelected = activeColor.toLowerCase() === p.hex.toLowerCase()
                return (
                  <button
                    key={p.name}
                    onClick={() => handleSelectColor(p.hex)}
                    title={p.name}
                    className={`w-5 h-5 xs:w-6 xs:h-6 rounded-full transition-all duration-200 border ${
                      isSelected
                        ? "scale-115 border-[#23170F] ring-2 ring-[#23170F]/40 shadow-xs"
                        : "border-white/90 hover:scale-110"
                    }`}
                    style={{ backgroundColor: p.hex }}
                  />
                )
              })}
            </div>
          </div>

          {/* Hardware & Rotation Actions */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setHardwareFinish(hardwareFinish === "gold" ? "silver" : "gold")}
              className="text-xs font-sans tracking-wide uppercase px-3 py-1.5 rounded-lg bg-[#ECE2D8]/60 hover:bg-[#ECE2D8] text-[#462F1D] font-semibold transition whitespace-nowrap"
              title="Toggle Hardware Finish"
            >
              <span className="hidden sm:inline">Hardware: </span>{hardwareFinish === "gold" ? "18k Gold" : "Palladium"}
            </button>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 xs:p-2 rounded-lg transition ${
                isRotating ? "bg-[#462F1D] text-[#FAF6F1]" : "bg-[#ECE2D8]/60 text-[#462F1D] hover:bg-[#ECE2D8]"
              }`}
              title={isRotating ? "Pause Orbit" : "Start Orbit"}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleZoom("in")}
              className="p-1.5 xs:p-2 rounded-lg bg-[#ECE2D8]/60 hover:bg-[#ECE2D8] text-[#462F1D] transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleZoom("out")}
              className="p-1.5 xs:p-2 rounded-lg bg-[#ECE2D8]/60 hover:bg-[#ECE2D8] text-[#462F1D] transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="text-xs font-sans tracking-wider uppercase px-2.5 xs:px-3 py-1.5 rounded-lg bg-[#ECE2D8]/60 hover:bg-[#ECE2D8] text-[#462F1D] font-semibold transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

