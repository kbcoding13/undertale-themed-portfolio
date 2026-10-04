import './PixelButton.css'

// Both states of every button, resolved at build time by Vite. Drawing a new
// pair into assets/buttons (e.g. spare.png + spare-s.png) is all it takes to
// add one — no import to write here.
const art = import.meta.glob('../assets/buttons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

type PixelButtonProps = {
  /** File stem in assets/buttons, e.g. 'fight' for fight.png + fight-s.png. */
  name: string
  /** Spoken name for screen readers, since the label is baked into the image. */
  label: string
  /** Not wired to anything yet — pass a handler when the buttons gain behaviour. */
  onClick?: () => void
}

/**
 * One Undertale battle button. Idle and selected sprites both sit in the DOM
 * and swap with CSS on hover/focus — no JS state, and no flicker from fetching
 * the second image only once the pointer arrives.
 *
 * A real <button> even with no handler, so it stays keyboard-reachable and is
 * ready for behaviour to be dropped in later.
 */
function PixelButton({ name, label, onClick }: PixelButtonProps) {
  const idle = art[`../assets/buttons/${name}.png`]
  const selected = art[`../assets/buttons/${name}-s.png`]

  if (!idle || !selected) {
    console.warn(`PixelButton: missing art for "${name}"`)
    return null
  }

  return (
    <button
      type="button"
      className="pixel-button"
      aria-label={label}
      onClick={onClick}
    >
      <img className="pixel-button__idle" src={idle} alt="" />
      <img className="pixel-button__selected" src={selected} alt="" />
    </button>
  )
}

export default PixelButton
