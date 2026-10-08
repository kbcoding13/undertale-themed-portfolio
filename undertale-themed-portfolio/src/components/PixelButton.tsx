import './PixelButton.css'
import redSoulCursor from '../assets/red-soul-cursor.png'

// Both states of every button, resolved at build time by Vite. Drawing a new
// pair into assets/buttons (e.g. spare.png + spare-s.png) is all it takes to
// add one — no import to write here.
const art = import.meta.glob('../assets/buttons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

type PixelButtonProps = {
  name: string
  label: string
  onClick?: () => void
  selected: boolean
  onHover?: () => void
}

function PixelButton({ name, label, onClick, selected, onHover}: PixelButtonProps) {
  const idle = art[`../assets/buttons/${name}.png`]
  const selection = art[`../assets/buttons/${name}-s.png`]
  const soul = redSoulCursor

  if (!idle || !selection) {
    console.warn(`PixelButton: missing art for "${name}"`)
    return null
  }

  return (
    <button
      type="button"
      className={`pixel-button${selected ? ' is-active' : ''}`}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <img className="pixel-button__idle" src={idle} alt="" />
      <img className="pixel-button__selected" src={selection} alt="" />
      {selected && <img className='pixel-button__soul' src={soul} alt="" />} 
    </button>
  )
}

export default PixelButton