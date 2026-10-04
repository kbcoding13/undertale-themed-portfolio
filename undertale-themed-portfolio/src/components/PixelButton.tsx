import './PixelButton.css'

// Both states of every button, resolved at build time by Vite. Drawing a new
// pair into assets/buttons (e.g. edu.png + edu-s.png) is all it takes to add
// one — no import to write here.
const art = import.meta.glob('../assets/buttons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

type PixelButtonProps = {
  /** File stem in assets/buttons, e.g. 'fight' for fight.png + fight-s.png. */
  name: string
  /** id of the section to jump to. */
  targetId: string
  /** Spoken name for screen readers, since the label is baked into the image. */
  label: string
  /** Holds the selected sprite lit, e.g. for the section currently on screen. */
  active?: boolean
}

/**
 * One Undertale battle button. Idle and selected sprites both sit in the DOM
 * and swap with CSS on hover/focus — no JS state, and no flicker from fetching
 * the second image only once the pointer arrives.
 *
 * Falls back to a text link styled to match when the art doesn't exist yet.
 */
function PixelButton({ name, targetId, label, active = false }: PixelButtonProps) {
  const idle = art[`../assets/buttons/${name}.png`]
  const selected = art[`../assets/buttons/${name}-s.png`]
  const className = `pixel-button${active ? ' is-active' : ''}`
  // Tells assistive tech which section is showing, the same thing the lit
  // sprite conveys visually.
  const current = active ? ('location' as const) : undefined

  if (!idle || !selected) {
    return (
      <a
        className={`${className} pixel-button--text`}
        href={`#${targetId}`}
        aria-current={current}
      >
        {label}
      </a>
    )
  }

  return (
    <a
      className={className}
      href={`#${targetId}`}
      aria-label={label}
      aria-current={current}
    >
      <img className="pixel-button__idle" src={idle} alt="" />
      <img className="pixel-button__selected" src={selected} alt="" />
    </a>
  )
}

export default PixelButton
