import { useEffect, useState } from 'react'
import About from './About';
import Contact from './Contact';
import "./index.css"
import HomePage from './HomePage';

function App() {
  const [Selected, setSelected] = useState("Home");
  const [isLoading, setisLoading] = useState(true);
  const [isFading,setisFading] = useState(false);

  function handleClick(selector) {
    setSelected(selector);
  }

  useEffect(()=>{
    setTimeout(() => {
     setisFading(true);
    },1000);

    setTimeout(() => {
      setisLoading(false);
    },3000);
  },[]);

    return (
      <div className="relative h-screen flex flex-col overflow-hidden">
        {isLoading &&
          <div className={`absolute z-50 top-0 left-0 h-full w-full bg-gray-200 flex justify-center items-center ${isFading ? "fade-out" : ""}`}>
            <div className="flex justify-center items-center">
              <img src="/assets/favicon.ico" className="drop-shadow-lg"/>
            </div>
          </div>
        }
        <div className="relative h-screen flex flex-col overflow-hidden">
          <div className="background"/>
          <div className="grainOverlay"/>
          <div className="pt-8 md:pt-16 lg:pt-16 px-2 mx-8 lg:mx-20 pb-4 text-lg lg:text-2xl border-b-2 border-black flex justify-between">
            <h1 onClick={() => handleClick("Home")} className={`${Selected == "Home" ? "font-bold font-[HeavyFont]" : "font-bold font-[ExtraLightFont]"} hover:cursor-pointer`}>HOME</h1>
            <h1 onClick={() => handleClick("About")} className={`${Selected == "About" ? "font-bold font-[HeavyFont]" : "font-bold font-[ExtraLightFont]"} hover:cursor-pointer`}>ABOUT ME</h1>
            <h1 onClick={() => handleClick("Contact")} className={`${Selected == "Contact" ? "font-bold font-[HeavyFont]" : "font-bold font-[ExtraLightFont]"} hover:cursor-pointer`}>CONTACT</h1>
          </div>
          <div className="flex-grow scrollbar-hide overflow-y-auto">
            {(Selected == "Home" || Selected == "projectsSection") && <HomePage Selected={Selected} setSelected={setSelected} />}
            {Selected == "About" && <About />}
            {Selected == "Contact" && <Contact />}
          </div>
        </div>
      </div>
    )
}

export default App