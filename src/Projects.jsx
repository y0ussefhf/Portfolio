import { BentoGrid, BentoGridItem } from "./components/ui/bento-grid";


export default function Projects({sectionChosen, setSelected}){
    return (
        <div className="flex flex-col h-full z-20">
            <button onClick={()=>setSelected("Home")} className="bg-black text-white font-bold p-2 rounded-lg my-2 mx-8 lg:mx-20 hover:bg-[#1a1a1a] duration-500 ease-in-out">Back</button>
            <BentoGrid className="w-full px-8 lg:px-20 md:auto-rows-[20rem]">
                {sectionChosen.map((project, index) => (
                    
                        <BentoGridItem 
                        key={index}
                        title={project.name}
                        description={project.description}
                        header={
                            <div className={`grid h-full ${project.multipleImages ? " grid-rows-3 grid-cols-4 gap-2" : ""}`}>
                                <img className={`h-full w-full object-center rounded-lg object-cover ${project.multipleImages ? "col-span-3 row-span-2" : ""}`} src={project.image}/>
                                {project.multipleImages &&
                                    <img className="h-full w-full object-cover rounded-lg" src={project.secondImage}/>
                                }
                                {project.multipleImages && 
                                    <img className="h-full w-full object-cover rounded-lg" src={project.thirdImage}/>
                                }
                                {project.multipleImages &&
                                    <img className="h-full w-full object-cover rounded-lg col-span-4" src={project.fourthImage}/>
                                }
                            </div>
                        }
                        className={`${project.className}`}
                        href={project.link}
                        />
                ))}
            </BentoGrid>
        </div>
    )
}