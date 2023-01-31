import type { RefObject } from 'react'
import { useState, useEffect } from 'react'

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false)
  const [observer, setObserver] = useState<any>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    setObserver(obs)
  }, [])

  useEffect(() => {
    if (!ref.current || !observer) {
      return
    }

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [observer, ref])

  return isIntersecting
}
