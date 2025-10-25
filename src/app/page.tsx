"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Activity, FileText, Play, Pause } from "lucide-react"

export default function ShowcasePage() {
  const [threeLoaded, setThreeLoaded] = useState(false)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const brainCanvasRef = useRef<HTMLCanvasElement>(null)
  const teamCanvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [formingV, setFormingV] = useState(false)
  const scenesRef = useRef<any[]>([])
  const particleSystemRef = useRef<any>(null)

  // Initialize Three.js scenes
  useEffect(() => {
    if (!threeLoaded || typeof window === 'undefined') return

    const THREE = (window as any).THREE
    if (!THREE) return

    const cleanup = () => {
      scenesRef.current.forEach(scene => {
        if (scene.dispose) scene.dispose()
      })
      scenesRef.current = []
    }

    cleanup()

    // Hero Neural Network Scene
    if (heroCanvasRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ 
        canvas: heroCanvasRef.current, 
        alpha: true, 
        antialias: true 
      })
      renderer.setSize(window.innerWidth, 600)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      camera.position.z = 50

      const particleCount = 200
      const particles = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)
      const originalPositions = new Float32Array(particleCount * 3)
      const targetPositions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 100
        const y = (Math.random() - 0.5) * 100
        const z = (Math.random() - 0.5) * 100
        
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        
        originalPositions[i * 3] = x
        originalPositions[i * 3 + 1] = y
        originalPositions[i * 3 + 2] = z

        // V shape target positions
        const t = i / particleCount
        if (t < 0.5) {
          targetPositions[i * 3] = -30 + t * 60
          targetPositions[i * 3 + 1] = 30 - t * 60
        } else {
          targetPositions[i * 3] = (t - 0.5) * 60
          targetPositions[i * 3 + 1] = -30 + (t - 0.5) * 60
        }
        targetPositions[i * 3 + 2] = 0

        const colorMix = Math.random()
        colors[i * 3] = 0.48 + colorMix * 0.2
        colors[i * 3 + 1] = 0.23 + colorMix * 0.4
        colors[i * 3 + 2] = 0.93
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      })

      const particleSystem = new THREE.Points(particles, particleMaterial)
      scene.add(particleSystem)
      particleSystemRef.current = { particleSystem, positions, originalPositions, targetPositions }

      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x7C3AED, 
        transparent: true, 
        opacity: 0.15 
      })
      const lineGeometry = new THREE.BufferGeometry()
      const linePositions: number[] = []

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3]
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (distance < 15) {
            linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial)
      scene.add(lineSystem)

      let animationId: number
      let formingVProgress = 0
      
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        if (formingV && formingVProgress < 1) {
          formingVProgress += 0.02
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = originalPositions[i * 3] + (targetPositions[i * 3] - originalPositions[i * 3]) * formingVProgress
            positions[i * 3 + 1] = originalPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - originalPositions[i * 3 + 1]) * formingVProgress
            positions[i * 3 + 2] = originalPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - originalPositions[i * 3 + 2]) * formingVProgress
          }
          particles.attributes.position.needsUpdate = true
        } else if (!formingV && formingVProgress > 0) {
          formingVProgress -= 0.02
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = originalPositions[i * 3] + (targetPositions[i * 3] - originalPositions[i * 3]) * formingVProgress
            positions[i * 3 + 1] = originalPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - originalPositions[i * 3 + 1]) * formingVProgress
            positions[i * 3 + 2] = originalPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - originalPositions[i * 3 + 2]) * formingVProgress
          }
          particles.attributes.position.needsUpdate = true
        }
        
        if (!formingV || formingVProgress >= 1) {
          particleSystem.rotation.x += 0.0005
          particleSystem.rotation.y += 0.001
          lineSystem.rotation.x += 0.0005
          lineSystem.rotation.y += 0.001
        }
        
        renderer.render(scene, camera)
      }
      animate()

      scenesRef.current.push({
        dispose: () => {
          cancelAnimationFrame(animationId)
          renderer.dispose()
          scene.clear()
        }
      })
    }

    // AI Brain Scene
    if (brainCanvasRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ 
        canvas: brainCanvasRef.current, 
        alpha: true, 
        antialias: true 
      })
      renderer.setSize(300, 300)
      camera.position.z = 15

      const brainGroup = new THREE.Group()
      
      for (let i = 0; i < 30; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 8)
        const material = new THREE.MeshBasicMaterial({ 
          color: Math.random() > 0.5 ? 0x7C3AED : 0x00A3FF,
          transparent: true,
          opacity: 0.8
        })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        )
        brainGroup.add(sphere)
      }

      scene.add(brainGroup)

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        brainGroup.rotation.x += 0.01
        brainGroup.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()

      scenesRef.current.push({
        dispose: () => {
          cancelAnimationFrame(animationId)
          renderer.dispose()
          scene.clear()
        }
      })
    }

    // Team Hub Scene
    if (teamCanvasRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ 
        canvas: teamCanvasRef.current, 
        alpha: true, 
        antialias: true 
      })
      renderer.setSize(600, 400)
      camera.position.z = 20

      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32)
      const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x7C3AED, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      scene.add(sphere)

      const avatars: THREE.Mesh[] = []
      for (let i = 0; i < 5; i++) {
        const avatarGeometry = new THREE.SphereGeometry(0.8, 16, 16)
        const avatarMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00A3FF,
          transparent: true,
          opacity: 0.9
        })
        const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial)
        const angle = (i / 5) * Math.PI * 2
        avatar.position.set(
          Math.cos(angle) * 8,
          Math.sin(angle) * 8,
          0
        )
        avatars.push(avatar)
        scene.add(avatar)
      }

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        sphere.rotation.x += 0.005
        sphere.rotation.y += 0.01
        
        avatars.forEach((avatar, i) => {
          const angle = Date.now() * 0.0005 + (i / 5) * Math.PI * 2
          avatar.position.x = Math.cos(angle) * 8
          avatar.position.y = Math.sin(angle) * 8
        })
        
        renderer.render(scene, camera)
      }
      animate()

      scenesRef.current.push({
        dispose: () => {
          cancelAnimationFrame(animationId)
          renderer.dispose()
          scene.clear()
        }
      })
    }

    return cleanup
  }, [threeLoaded, formingV])

  const handleHeadlineClick = () => {
    setFormingV(true)
    setTimeout(() => setFormingV(false), 3000)
  }

  const handleImageUpload = () => {
    setSelectedFile("image")
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 2000)
  }

  const handleAudioPlay = () => {
    setAudioPlaying(!audioPlaying)
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"
        onLoad={() => setThreeLoaded(true)}
      />
      
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-[#0A0E17] text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          <canvas
            ref={heroCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: threeLoaded ? 1 : 0, transition: 'opacity 1s' }}
          />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 cursor-pointer hover:text-[#00A3FF] transition-colors"
              onClick={handleHeadlineClick}
            >
              DeepGuardian
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
              An open-source showcase of AI content verification technology
            </p>
            
            <div className="mt-12 opacity-20 hover:opacity-30 transition-opacity">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#7C3AED]/30 max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="text-sm text-gray-400">Verification Complete</div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gradient-to-r from-[#7C3AED] to-[#00A3FF] rounded w-3/4"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Technology Showcase</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Image Verification */}
              <Card className="bg-[#1A1F2E] border-[#7C3AED]/30 p-6 hover:border-[#7C3AED] transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-xl font-bold mb-2 text-white">Image Verification</h3>
                <p className="text-gray-400 text-sm mb-4">Upload images to see AI analysis points in 3D</p>
                
                <div className="mt-4">
                  <Button 
                    onClick={handleImageUpload}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                
                {selectedFile === "image" && (
                  <div className="mt-4 p-3 bg-[#0A0E17] rounded border border-[#00A3FF]/30">
                    <div className="text-xs text-[#00A3FF] mb-2">
                      {analyzing ? "Analyzing..." : "✓ Analysis Complete"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Authenticity: 94.2%
                    </div>
                  </div>
                )}
              </Card>

              {/* Audio Verification */}
              <Card className="bg-[#1A1F2E] border-[#7C3AED]/30 p-6 hover:border-[#00A3FF] transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="text-xl font-bold mb-2 text-white">Audio Verification</h3>
                <p className="text-gray-400 text-sm mb-4">Visualize soundwaves with frequency particles</p>
                
                <div className="mt-4">
                  <Button 
                    onClick={handleAudioPlay}
                    className="w-full bg-[#00A3FF] hover:bg-[#0090E0] text-white"
                    size="sm"
                  >
                    {audioPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {audioPlaying ? "Pause" : "Play Demo"}
                  </Button>
                </div>
                
                {audioPlaying && (
                  <div className="mt-4 h-16 bg-[#0A0E17] rounded border border-[#00A3FF]/30 flex items-center justify-center">
                    <div className="flex gap-1 items-end">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#00A3FF] rounded-t animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 10}px`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: `${Math.random() * 0.5 + 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Deepfake Detection */}
              <Card className="bg-[#1A1F2E] border-[#7C3AED]/30 p-6 hover:border-red-500 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2 text-white">Deepfake Detection</h3>
                <p className="text-gray-400 text-sm mb-4">3D face mesh with heat map overlay</p>
                
                <div className="mt-4">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Analyze Video
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-[#0A0E17] rounded border border-red-500/30">
                  <div className="text-xs text-gray-400 mb-1">Manipulation Score</div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 w-3/4"></div>
                  </div>
                  <div className="text-xs text-red-400 mt-1">High Risk: 73%</div>
                </div>
              </Card>

              {/* Misinformation Detector */}
              <Card className="bg-[#1A1F2E] border-[#7C3AED]/30 p-6 hover:border-yellow-500 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2 text-white">Misinformation</h3>
                <p className="text-gray-400 text-sm mb-4">Network graph of fact-check sources</p>
                
                <div className="mt-4">
                  <Button 
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Check Claim
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-[#0A0E17] rounded border border-yellow-500/30">
                  <div className="text-xs text-yellow-400 mb-2">⚠ Unverified Sources</div>
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-[#0D1117]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Verification Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#00A3FF] to-[#7C3AED] opacity-30 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <Card className="bg-[#1A1F2E] border-[#7C3AED]/30 p-6 text-center">
                  <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <Upload className="w-12 h-12 mx-auto text-[#7C3AED] mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">Upload</h3>
                  <p className="text-gray-400 text-sm">Drag and drop any file type for instant analysis</p>
                  
                  <div className="mt-4 p-4 bg-[#0A0E17] rounded border-2 border-dashed border-[#7C3AED]/50 hover:border-[#7C3AED] transition-colors cursor-pointer">
                    <div className="text-xs text-gray-400">Drop files here</div>
                  </div>
                </Card>
              </div>

              <div className="relative z-10">
                <Card className="bg-[#1A1F2E] border-[#00A3FF]/30 p-6 text-center">
                  <div className="w-16 h-16 bg-[#00A3FF] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <canvas ref={brainCanvasRef} className="mx-auto mb-4" width="300" height="300" style={{ maxWidth: '100%', height: 'auto' }} />
                  <h3 className="text-xl font-bold mb-2 text-white">Analyze</h3>
                  <p className="text-gray-400 text-sm">AI processes data through neural networks</p>
                </Card>
              </div>

              <div className="relative z-10">
                <Card className="bg-[#1A1F2E] border-green-500/30 p-6 text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <FileText className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">Report</h3>
                  <p className="text-gray-400 text-sm">View confidence scores and key metrics</p>
                  
                  <div className="mt-4 p-3 bg-[#0A0E17] rounded border border-green-500/30 text-left">
                    <div className="text-xs text-green-400 mb-2">✓ Verification Complete</div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Authenticity: 96.8%</div>
                      <div>Processing Time: 1.2s</div>
                      <div>Confidence: High</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Management Demo */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Collaboration Showcase</h2>
            <p className="text-center text-gray-400 mb-16">3D team hub with real-time activity simulation</p>
            
            <div className="relative">
              <canvas 
                ref={teamCanvasRef} 
                className="mx-auto rounded-lg border border-[#7C3AED]/30"
                width="600" 
                height="400"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Admin", role: "Full Access", color: "text-purple-400" },
                  { name: "Analyst 1", role: "Verify Only", color: "text-blue-400" },
                  { name: "Analyst 2", role: "Verify Only", color: "text-blue-400" },
                ].map((user, i) => (
                  <Card key={i} className="bg-[#1A1F2E] border-[#7C3AED]/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#00A3FF]"></div>
                      <div className="flex-1">
                        <div className={`font-bold ${user.color}`}>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm mb-4">
              ⚠️ This is a non-commercial technology demonstration. No real data is processed.
            </p>
            <p className="text-gray-600 text-xs">
              DeepGuardian Showcase © 2025 • Built with Three.js • Open Source Demo
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}