import { useEffect, useState } from 'react'
import './TopNav.css'
import PixelButton from './PixelButton'

export type NavItem = {
  id: string
  title: string
  art: string
}

type TopNavProps = {
  items: NavItem[]
}

function TopNav({ items }: TopNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // A stable primitive to depend on, so the effect doesn't re-run just because
  // the caller passed a new array with the same contents.
  const ids = items.map(item => item.id).join(',')

  useEffect(() => {
    const order = ids.split(',')
    const elements = order
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Owned by this effect rather than a ref, so it resets cleanly on re-run.
    const onScreen = new Set<string>()

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id)
          else onScreen.delete(entry.target.id)
        }
        // Whichever qualifying section comes first in the page wins, so
        // scrolling down lights each button in turn.
        // setState from an observer callback, never synchronously in the effect.
        setActiveId(order.find(id => onScreen.has(id)) ?? null)
      },
      // Only the band just below the navbar counts as "current", otherwise a
      // tall section would stay lit while the next one fills the screen.
      { rootMargin: '-25% 0px -65% 0px' },
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return (
    <header className="topnav">
      <nav aria-label="Main">
        <ul className="topnav__list">
          {items.map(({ id, title, art }) => (
            <li key={id}>
              <PixelButton
                name={art}
                targetId={id}
                label={title}
                active={id === activeId}
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default TopNav
