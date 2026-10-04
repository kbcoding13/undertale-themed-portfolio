import { useEffect, useMemo, useRef, useState } from 'react'
import './DialogueBox.css'
import boxBg from '../assets/characters/background.png'

// Vite resolves every sprite at build time into a { path: url } map, so adding a
// new character is a matter of dropping the .png in — no import to write here.
const sprites = import.meta.glob('../assets/characters/*/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const spriteUrl = (character: string, mode: string) =>
  sprites[`../assets/characters/${character}/${mode}.png`]

/** Matches the per-character fonts the original API registers server-side. */
const familyFor = (character: string) =>
  character === 'sans'
    ? "'Comic Sans UT'"
    : character === 'papyrus'
      ? "'Papyrus UT'"
      : "'Determination Mono'"

// Source-pixel values from the game's box: text column is 370px wide, set at
// 32px, three lines to a page.
const TEXT_WIDTH = 370
const FONT_SIZE = 32
const LINES_PER_PAGE = 3

let measurer: CanvasRenderingContext2D | null | undefined

/** A canvas context used only to measure text, created once and reused. */
function getMeasurer() {
  if (measurer === undefined) {
    measurer =
      typeof document === 'undefined'
        ? null
        : document.createElement('canvas').getContext('2d')
  }
  return measurer
}

/**
 * Greedy word wrap at TEXT_WIDTH, then grouped into pages of LINES_PER_PAGE —
 * the same algorithm the API runs server-side, so line breaks land in the same
 * places. Returns pages of lines.
 */
function paginate(text: string, fontFamily: string): string[][] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const ctx = getMeasurer()
  // Without a canvas there is nothing to measure against, so fall back to one
  // page and let CSS wrapping handle it.
  if (!ctx) return [[words.join(' ')]]

  ctx.font = `${FONT_SIZE}px ${fontFamily}`

  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && ctx.measureText(candidate).width > TEXT_WIDTH) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)

  const pages: string[][] = []
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE))
  }
  return pages
}

type DialogueBoxProps = {
  /** Folder name under assets/characters, e.g. 'sans' or 'toriel'. */
  character: string
  /** Sprite file name without .png, e.g. 'wink'. */
  mode?: string
  /** Any length — it is split into pages of three lines automatically. */
  text: string
  /** Milliseconds per character. The game runs at roughly 30. */
  speed?: number
  /** Skip the typewriter and show each page in full immediately. */
  instant?: boolean
  /** Called once the final page has finished typing. */
  onComplete?: () => void
}

function DialogueBox({
  character,
  mode = 'default',
  text,
  speed = 30,
  instant = false,
  onComplete,
}: DialogueBoxProps) {
  // Tagged with the line it belongs to, so new text starts at page 0 without an
  // effect having to reset it.
  const [paging, setPaging] = useState({ line: text, index: 0 })
  const pageIndex = paging.line === text ? paging.index : 0
  // Progress is tagged with the page it belongs to, so moving to a new page
  // reads as zero characters typed without an effect having to reset it.
  const [progress, setProgress] = useState({ key: '', count: 0 })
  const [skipped, setSkipped] = useState<string | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const family = familyFor(character)
  const font = `${family}, monospace`

  // Measuring before the webfont arrives would wrap against the fallback font
  // and put the breaks in the wrong places. document.fonts.load() *requests*
  // the font and resolves once it is usable — document.fonts.ready would not,
  // since it can resolve before anything has asked for this family yet.
  const [loadedFamily, setLoadedFamily] = useState<string | null>(null)

  useEffect(() => {
    if (loadedFamily === family) return
    let active = true
    const settle = () => {
      // setState from a promise callback, never synchronously in the effect.
      if (active) setLoadedFamily(family)
    }
    const fonts = typeof document === 'undefined' ? undefined : document.fonts
    if (fonts?.load) {
      // Measure against the real font once it loads; on failure fall through and
      // measure against the fallback rather than never rendering.
      fonts.load(`${FONT_SIZE}px ${family}`).then(settle, settle)
    } else {
      settle()
    }
    return () => {
      active = false
    }
  }, [family, loadedFamily])

  // The measurements change once the real font is available, so this recomputes
  // when it lands.
  const pages = useMemo(
    () => (loadedFamily === family ? paginate(text, font) : []),
    [text, font, family, loadedFamily],
  )

  const page = pages[pageIndex] ?? []
  const pageText = page.join('\n')
  // Identifies this exact page of this exact text, so stale progress is ignored.
  const pageKey = `${text}\u0000${pageIndex}`

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const showAll = instant || skipped === pageKey || reduceMotion || speed <= 0
  const shown = showAll
    ? pageText.length
    : progress.key === pageKey
      ? Math.min(progress.count, pageText.length)
      : 0

  const pageDone = shown >= pageText.length
  const isLastPage = pageIndex >= pages.length - 1
  const hasMore = pageDone && !isLastPage

  useEffect(() => {
    if (showAll || !pageText) return

    let count = 0
    const id = setInterval(() => {
      count += 1
      // setState from the interval callback, never synchronously in the effect.
      setProgress({ key: pageKey, count })
      if (count >= pageText.length) clearInterval(id)
    }, speed)

    return () => clearInterval(id)
  }, [pageKey, pageText, speed, showAll])

  // Fires after the render that completed the last page, never during it.
  const finished = pageDone && isLastPage && pages.length > 0
  useEffect(() => {
    if (finished) onCompleteRef.current?.()
  }, [finished])

  /** One click or keypress: finish the current page, or move to the next. */
  const advance = () => {
    if (!pageDone) {
      setSkipped(pageKey)
    } else if (!isLastPage) {
      setPaging({ line: text, index: pageIndex + 1 })
    }
  }

  const face = spriteUrl(character, mode) ?? spriteUrl(character, 'default')
  if (!face) {
    console.warn(`DialogueBox: no sprite for "${character}/${mode}"`)
    return null
  }

  return (
    <div
      className="dialogue-box"
      style={{ backgroundImage: `url(${boxBg})` }}
      onClick={advance}
      onKeyDown={event => {
        if (['Enter', ' ', 'z', 'Z'].includes(event.key)) {
          event.preventDefault()
          advance()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={
        pages.length > 1
          ? `Dialogue, page ${pageIndex + 1} of ${pages.length}. ${text}`
          : text
      }
    >
      <img className="dialogue-face" src={face} alt="" />
      <span className="dialogue-asterisk" style={{ fontFamily: font }}>
        *
      </span>
      {/* The full text is on the container's aria-label, so the partially
          typed copy is hidden from assistive tech. */}
      <p
        className="dialogue-text"
        style={{ fontFamily: font }}
        aria-hidden="true"
      >
        {pageText.slice(0, shown)}
      </p>
      {hasMore && <span className="dialogue-more" aria-hidden="true" />}
    </div>
  )
}

export default DialogueBox
