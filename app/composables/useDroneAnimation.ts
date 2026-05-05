import gsap from 'gsap'

export const useDroneAnimation = () => {
  
  const flyBetween = (element: HTMLElement, fromId: string, toId: string, onComplete?: () => void) => {
    const fromEl = document.getElementById(fromId)
    const toEl = document.getElementById(toId)
    
    if (!fromEl || !toEl || !element) return

    // Menghitung titik tengah kordinat node di dalam kertas Isometric
    const fromX = fromEl.offsetLeft + (fromEl.offsetWidth / 2)
    const fromY = fromEl.offsetTop + (fromEl.offsetHeight / 2)
    const toX = toEl.offsetLeft + (toEl.offsetWidth / 2)
    const toY = toEl.offsetTop + (toEl.offsetHeight / 2)

    // Set posisi awal dan tampilkan
    gsap.set(element, { x: fromX, y: fromY, opacity: 1 })

    // Melesatkan cahaya ke tujuan
    gsap.to(element, {
      x: toX,
      y: toY,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        if (onComplete) onComplete()
      }
    })
  }

  const hidePacket = (element: HTMLElement) => {
    gsap.to(element, { opacity: 0, duration: 0.5, scale: 0 })
  }

  return { flyBetween, hidePacket }
}