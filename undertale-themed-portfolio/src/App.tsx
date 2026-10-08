import './App.css'

import avatar from './assets/me-pixel-avatar.png'
import DialogueBox from './components/DialogueBox'
import SiteNav from './components/SiteNav'
import BattleMenu from './components/BattleMenu'

/** The page's sections, in document order. */
const SECTIONS = [
  { id: 'aboutme', title: 'About Me'},
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'achievements', title: 'Achievements' },
  { id: 'content', title: 'Content' },
]

/** Nav adds a link back to the hero, which already carries id="home". */
const NAV = [{ id: 'home', title: 'Home' }, ...SECTIONS]

/**
 * The battle menu. Not navigation — these are inert for now, waiting on
 * whatever they're going to do. Give an item an `onClick` to wire it up.
 */


function App() {
  return (
    <>
      <SiteNav items={NAV} />

      <section id="home" className="section section--hero">
        <h1>Karl Belleza</h1>
        <h2>Looking to specialise in Software Engineering</h2>

        <div>
          <div className="hero">
            <img src={avatar} className="base" alt="" />
          </div>
          <DialogueBox
            character="sans"
            mode="wink"
            text="Welcome to my portfolio website. you might know me from my videos
              or my linkedin but it's cool to see you here. What I have is just my
              projects, my experience, and most notably what I've done at my time
              at uni, call it a Uni/Job Portfolio if you will. happy hunting"
          />
        </div>
      
      <BattleMenu />

      </section>

      {SECTIONS.map(({ id, title }) => (
        <section key={id} id={id} className="section">
          <h2>{title}</h2>
          {/* Content goes here. */}
        </section>
      ))}

      <div id="spacer" />
    </>
  )
}

export default App