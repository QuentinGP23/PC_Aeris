import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function initReveal() {
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          obs.unobserve(e.target)
        }
      })
    },
    { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
  )

  const watch = () => {
    document.querySelectorAll<HTMLElement>('.rv:not([data-obs])').forEach(el => {
      el.setAttribute('data-obs', '1')
      obs.observe(el)
    })
  }

  watch()
  const mo = new MutationObserver(watch)
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    mo.disconnect()
    obs.disconnect()
  }
}

export function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.rv.in').forEach(el => {
        el.classList.remove('in')
        el.removeAttribute('data-obs')
      })
      initReveal()
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])
}
