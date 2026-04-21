import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const loop = () => {
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      dot.style.left = `${mx}px`
      dot.style.top = `${my}px`
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`
      raf = requestAnimationFrame(loop)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest?.('a,button,[data-hover]')) document.body.classList.add('cur-hover')
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest?.('a,button,[data-hover]')) document.body.classList.remove('cur-hover')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cur-dot" aria-hidden />
      <div ref={ringRef} className="cur-ring" aria-hidden />
    </>
  )
}
