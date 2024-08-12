import React from "react";
import Container from "./Container";
import { useEffect, useState } from "react";
import Projects from "./Projects";
import "./index.css";
import {data} from "./assets/data.js";


export default function HomePage({Selected,setSelected}) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function handleClick(index) {
    setSelected("projectsSection");
    setSelectedIndex(index);
  }
  useEffect(() => {
    setIsVisible(true); // Trigger the animation on component mount
  }, []);
  const Categories = data.categories;
  return(
    <div>
      {Selected == "Home" && 
        <div className={`overflow-hidden transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center lg:flex-row mx-10 lg:mx-20 gap-2 justify-center mt-8 mb-4">
              {Categories.map((Category,index) => (
                  <Container onClick={()=>handleClick(index)} key={index} Category={Category} />
              ))}
          </div>
          <div className="mx-10 lg:mx-20 mb-12 pb-4 flex flex-col justify-center lg:grid lg:grid-cols-[60%_18%] gap-8 lg:gap-[24.3rem]">
              <div className="lg:mr-40">
              <h1 className="font-[IntegralMediumRegular] font-bold mr-28 text-4xl border-b-2 pb-4 px-1 border-black lg:text-7xl">YOUSSEF HESHAM</h1>
              <p className="font-[NexaExtraLight] mt-2 font-bold text-xl">
                  An architect and 3D artist specialising in archviz and character art, combined with a decade of experience in 3D art. My journey through the world of 3D has taken me from animation to character art to automotive design all the way to archviz.
              </p>
              <p className="font-[NexaExtraLight] pt-2 text-xl">
                  Currently Based in Cairo, Egypt.
              </p>
              </div>
              <div className="flex flex-col justify-self-end">
              <div class="font-[IntegralMediumRegular] justify-end text-transparent ml-32 lg:ml-6 pb-4 border-b-2 mb-2 inline-block text-end text-4xl border-black font-bold lg:text-7xl text-stroke-black">
                  SKILLS
              </div>
              <div className="font-[NexaExtraLight] flex text-xl justify-end lg:justify-end flex-wrap font-bold">
                      <p>•Blender</p>
                      <p>•ZBrush</p>
                      <p>•Maya</p>
                      <p>•Marvelous Designer</p>
                      <p>•Substance Painter</p>
                      <p>•Rhinoceros</p>
                      <p>•Revit</p>
                      <p>•Photoshop</p>
                      <p>•AutoCAD</p>
              </div>
              </div>
          </div>
      </div>
      }
      {Selected !== "Home" && <Projects sectionChosen={data.sections[selectedIndex].projects} setSelected={setSelected}/>}
    </div>
  )
}