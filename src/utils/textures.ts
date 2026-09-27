import * as THREE from 'three'

const textureCache = new Map<string, THREE.CanvasTexture>()

// 1. Stylized Low-Poly Timber Planks (Outer Wilds Style, Zero Moiré)
export function getWoodTexture(): THREE.CanvasTexture {
  if (textureCache.has('wood')) return textureCache.get('wood')!

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 4 broad stylized wooden planks with subtle organic tones
    const plankColors = ['#aa865f', '#a17d57', '#987550', '#b18d65']
    const plankHeight = 128

    plankColors.forEach((color, i) => {
      ctx.fillStyle = color
      ctx.fillRect(0, i * plankHeight, 512, plankHeight)

      // Soft broad organic wood grain variation
      const grad = ctx.createLinearGradient(0, i * plankHeight, 512, (i + 1) * plankHeight)
      grad.addColorStop(0, 'rgba(230, 200, 160, 0.08)')
      grad.addColorStop(0.5, 'rgba(60, 40, 20, 0.06)')
      grad.addColorStop(1, 'rgba(230, 200, 160, 0.04)')
      ctx.fillStyle = grad
      ctx.fillRect(0, i * plankHeight, 512, plankHeight)

      // Stylized subtle knot/grain oval
      ctx.fillStyle = 'rgba(70, 45, 25, 0.06)'
      ctx.beginPath()
      ctx.ellipse(120 + i * 90, i * plankHeight + 64, 80, 24, i * 0.2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Clean, soft plank separator seams
    ctx.strokeStyle = 'rgba(40, 25, 12, 0.35)'
    ctx.lineWidth = 4
    for (let i = 1; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * plankHeight)
      ctx.lineTo(512, i * plankHeight)
      ctx.stroke()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 1)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  textureCache.set('wood', tex)
  return tex
}

// 2. Clean Vintage Slate Work Mat (Anti-aliased, Zero Grid Moiré)
export function getEsdMatTexture(): THREE.CanvasTexture {
  if (textureCache.has('esd')) return textureCache.get('esd')!

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Deep slate petroleum base
    ctx.fillStyle = '#213242'
    ctx.fillRect(0, 0, 512, 256)

    // Soft border frame
    ctx.strokeStyle = '#2d4357'
    ctx.lineWidth = 6
    ctx.strokeRect(6, 6, 500, 244)

    // Wide spaced clean quadrant grid (Only 4 major sections to prevent shimmering)
    ctx.strokeStyle = '#283c4e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(128, 6)
    ctx.lineTo(128, 250)
    ctx.moveTo(256, 6)
    ctx.lineTo(256, 250)
    ctx.moveTo(384, 6)
    ctx.lineTo(384, 250)
    ctx.moveTo(6, 128)
    ctx.lineTo(506, 128)
    ctx.stroke()

    // Clean subtle corner badges
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('molasz.dev', 430, 236)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  textureCache.set('esd', tex)
  return tex
}

// 3. Handcrafted PCB Circuit Traces (Clean Anti-aliased)
export function getPcbTexture(): THREE.CanvasTexture {
  if (textureCache.has('pcb')) return textureCache.get('pcb')!

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Deep forest moss green
    ctx.fillStyle = '#1b3325'
    ctx.fillRect(0, 0, 256, 256)

    // Brass/gold circuit traces
    ctx.strokeStyle = '#b5935b'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    ctx.moveTo(25, 35)
    ctx.lineTo(85, 35)
    ctx.lineTo(115, 65)
    ctx.lineTo(185, 65)

    ctx.moveTo(35, 85)
    ctx.lineTo(95, 85)
    ctx.lineTo(125, 115)
    ctx.lineTo(205, 115)

    ctx.moveTo(55, 155)
    ctx.lineTo(115, 155)
    ctx.lineTo(145, 185)
    ctx.lineTo(215, 185)
    ctx.stroke()

    // Solder pads
    ctx.fillStyle = '#c2a166'
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.arc(45 + i * 26, 220, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 8
  textureCache.set('pcb', tex)
  return tex
}

// 4. Studio Floor Texture
export function getFloorTexture(): THREE.CanvasTexture {
  if (textureCache.has('floor')) return textureCache.get('floor')!

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#0f141d'
    ctx.fillRect(0, 0, 256, 256)

    ctx.strokeStyle = '#18202c'
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, 256, 256)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 6)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  textureCache.set('floor', tex)
  return tex
}
