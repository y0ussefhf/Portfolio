import { useState } from 'react'
import About from './About';
import Contact from './Contact';
import "./index.css"
import HomePage from './HomePage';

function App() {
  const [Selected, setSelected] = useState("Home");

  function handleClick(selector) {
    setSelected(selector);
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <div className="background"></div>
      <div className="grainOverlay"></div>
      <div className="pt-8 md:pt-16 lg:pt-16 px-2 mx-8 lg:mx-20 pb-4 text-lg lg:text-2xl border-b-2 border-black flex justify-between">
        <h1 onClick={() => handleClick("Home")} className={`${Selected == "Home" ? "font-bold font-[NexaHeavy]" : "font-bold font-[NexaExtraLight]"} ease-in-out duration-500 hover:cursor-pointer`}>HOME</h1>
        <h1 onClick={() => handleClick("About")} className={`${Selected == "About" ? "font-bold font-[NexaHeavy]" : "font-bold font-[NexaExtraLight]"} hover:cursor-pointer`}>ABOUT ME</h1>
        <h1 onClick={() => handleClick("Contact")} className={`${Selected == "Contact" ? "font-bold font-[NexaHeavy]" : "font-bold font-[NexaExtraLight]"} hover:cursor-pointer`}>CONTACT</h1>
      </div>
      <div className="flex-grow scrollbar-hide overflow-y-auto">
        {(Selected == "Home" || Selected == "projectsSection") && <HomePage Selected={Selected} setSelected={setSelected} />}
        {Selected == "About" && <About />}
        {Selected == "Contact" && <Contact />}
      </div>
    </div>
  )
}

export default App