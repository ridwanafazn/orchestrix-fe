import gsap from 'gsap'

export const useDroneAnimation = () => {
  const getCenterCoords = (el: HTMLElement) => {
    return {
      x: el.offsetLeft - 6, 
      y: el.offsetTop - 6
    }
  }

  const animateInitialRoute = (packetId: string) => {
    const packet = document.getElementById(packetId)
    const client = document.getElementById('node-client')
    const api = document.getElementById('node-api')
    const queue = document.getElementById('node-queue')
    
    if (!packet || !client || !api || !queue) return
    gsap.killTweensOf(packet)

    const start = getCenterCoords(client)
    const mid = getCenterCoords(api)
    const end = getCenterCoords(queue)

    gsap.set(packet, { 
      x: start.x, y: start.y, opacity: 1, scale: 1,
      backgroundColor: '#38bdf8', boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.8)' 
    })

    const tl = gsap.timeline()
    tl.to(packet, { x: mid.x, y: mid.y, duration: 0.4, ease: "power1.inOut" })
      .call(() => pulseNode('node-api'))
      .to(packet, { x: end.x, y: end.y, duration: 0.4, ease: "power1.inOut" }, "+=0.1")
      .call(() => pulseNode('node-queue'))
  }

  const shootPacket = (packetId: string, fromId: string, toId: string, duration = 0.8) => {
    const packet = document.getElementById(packetId)
    const fromEl = document.getElementById(fromId)
    const toEl = document.getElementById(toId)
    
    if (!packet || !fromEl || !toEl) return
    gsap.killTweensOf(packet)

    const start = getCenterCoords(fromEl)
    const end = getCenterCoords(toEl)

    gsap.set(packet, { 
      x: start.x, y: start.y, opacity: 1, scale: 1,
      backgroundColor: '#38bdf8', boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.8)' 
    })

    const tl = gsap.timeline()
    if (Math.abs(start.x - end.x) > 10 && Math.abs(start.y - end.y) > 10) {
      tl.to(packet, { y: end.y, duration: duration / 2, ease: "none" })
        .to(packet, { x: end.x, duration: duration / 2, ease: "none" })
    } else {
      tl.to(packet, { x: end.x, y: end.y, duration: duration, ease: "power1.inOut" })
    }
  }

  const forkPacket = (packetId: string, fromId: string, toId1: string, toId2: string, duration = 0.8) => {
    const packet = document.getElementById(packetId)
    const fromEl = document.getElementById(fromId)
    const toEl1 = document.getElementById(toId1)
    const toEl2 = document.getElementById(toId2)

    if (!packet || !fromEl || !toEl1 || !toEl2) return
    gsap.killTweensOf(packet)

    const start = getCenterCoords(fromEl)
    const end1 = getCenterCoords(toEl1)
    const end2 = getCenterCoords(toEl2)

    gsap.set(packet, { 
      x: start.x, y: start.y, opacity: 1, scale: 1,
      backgroundColor: '#38bdf8', boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.8)' 
    })

    const clone = packet.cloneNode(true) as HTMLElement
    clone.id = `${packetId}-clone`
    packet.parentNode?.appendChild(clone)
    gsap.set(clone, { 
      x: start.x, y: start.y, opacity: 1, scale: 1,
      backgroundColor: '#38bdf8', boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.8)' 
    })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to([packet, clone], { opacity: 0, duration: 0.3, scale: 0, onComplete: () => clone.remove() })
      }
    })

    if (Math.abs(start.x - end1.x) > 10 && Math.abs(start.y - end1.y) > 10) {
      tl.to(packet, { y: end1.y, duration: duration / 2, ease: "none" }, 0)
        .to(packet, { x: end1.x, duration: duration / 2, ease: "none" }, duration / 2)
    } else {
      tl.to(packet, { x: end1.x, y: end1.y, duration: duration, ease: "power1.inOut" }, 0)
    }

    if (Math.abs(start.x - end2.x) > 10 && Math.abs(start.y - end2.y) > 10) {
      tl.to(clone, { y: end2.y, duration: duration / 2, ease: "none" }, 0)
        .to(clone, { x: end2.x, duration: duration / 2, ease: "none" }, duration / 2)
    } else {
      tl.to(clone, { x: end2.x, y: end2.y, duration: duration, ease: "power1.inOut" }, 0)
    }
  }

  const forkChaos = (packetId: string, currentId: string = 'node-worker', dlqId: string = 'node-dlq', dbId: string = 'node-db') => {
    const packet = document.getElementById(packetId)
    const workerEl = document.getElementById(currentId)
    const dlqEl = document.getElementById(dlqId)
    const dbEl = document.getElementById(dbId)

    if (!packet || !workerEl || !dlqEl || !dbEl) return
    gsap.killTweensOf(packet)

    const start = getCenterCoords(workerEl)
    const endDLQ = getCenterCoords(dlqEl)
    const endDB = getCenterCoords(dbEl)

    gsap.set(packet, { x: start.x, y: start.y, opacity: 1, scale: 1 })

    const clone = packet.cloneNode(true) as HTMLElement
    clone.id = `${packetId}-chaos-clone`
    packet.parentNode?.appendChild(clone)
    gsap.set(clone, { x: start.x, y: start.y, opacity: 1, scale: 1 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to([packet, clone], { opacity: 0, duration: 0.3, scale: 0, onComplete: () => clone.remove() })
      }
    })

    tl.to([packet, clone], { 
        backgroundColor: '#ef4444', 
        boxShadow: '0 0 15px 5px rgba(239, 68, 68, 0.9)', 
        duration: 0.1 
      }, 0)
      .to([packet, clone], { x: "+=8", y: "-=8", yoyo: true, repeat: 5, duration: 0.05 }, "+=0")

    const moveDuration = 0.6;
    
    tl.to(packet, { y: endDLQ.y, duration: moveDuration / 2, ease: "none" }, "move")
      .to(packet, { x: endDLQ.x, duration: moveDuration / 2, ease: "power2.inOut" }, `move+=${moveDuration/2}`)

    tl.to(clone, { y: endDB.y, duration: moveDuration / 2, ease: "none" }, "move")
      .to(clone, { x: endDB.x, duration: moveDuration / 2, ease: "power2.inOut" }, `move+=${moveDuration/2}`)
  }

  const pulseNode = (nodeId: string) => {
    const node = document.getElementById(nodeId)
    if (!node) return
    const box = node.querySelector('.node-box')
    if (box) gsap.fromTo(box, { scale: 1.15, filter: 'brightness(1.2)' }, { scale: 1, filter: 'brightness(1)', duration: 0.4, ease: 'back.out(1.5)' })
  }

  const startProcessingNode = (nodeId: string) => {
    const node = document.getElementById(nodeId)
    if (!node) return
    const box = node.querySelector('.node-box')
    if (box) {
      gsap.to(box, { y: -3, yoyo: true, repeat: -1, duration: 0.08, ease: "none", id: `vibrate-${nodeId}` })
      gsap.to(box, { boxShadow: '4px 4px 0 #3b82f6, 0 0 15px 2px rgba(59, 130, 246, 0.5)', yoyo: true, repeat: -1, duration: 0.5, id: `glow-${nodeId}` })
    }
  }

  const stopProcessingNode = (nodeId: string) => {
    gsap.killTweensOf(`vibrate-${nodeId}`)
    gsap.killTweensOf(`glow-${nodeId}`)
    const node = document.getElementById(nodeId)
    const box = node?.querySelector('.node-box')
    if (box) gsap.to(box, { y: 0, boxShadow: '4px 4px 0 #1e293b', duration: 0.2 })
  }

  const hidePacket = (packetId: string) => {
    const packet = document.getElementById(packetId)
    if (packet) {
      gsap.killTweensOf(packet)
      gsap.to(packet, { opacity: 0, duration: 0.3, scale: 0 })
    }
  }

  return { shootPacket, forkPacket, forkChaos, pulseNode, startProcessingNode, stopProcessingNode, hidePacket, animateInitialRoute }
}