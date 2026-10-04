import './App.css'

import avatar from './assets/me-pixel-avatar.png'
import DialogueBox from './components/DialogueBox'
import TopNav from './components/TopNav'

/**
 * Nav and page sections come from one list, so adding a section gives it a
 * button automatically. `art` is the file stem in assets/buttons; a name with
 * no art falls back to a text button until the sprite exists.
 */
const SECTIONS = [
  { id: 'education', title: 'Education', art: 'edu' },
  { id: 'skills', title: 'Skills', art: 'fight' },
  { id: 'projects', title: 'Projects', art: 'act' },
  { id: 'achievements', title: 'Achievements', art: 'item' },
  { id: 'content', title: 'Content', art: 'mercy' },
]

function App() {
  return (
    <>
      <TopNav items={SECTIONS} />

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
