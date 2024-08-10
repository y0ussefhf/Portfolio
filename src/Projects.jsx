import { BentoGrid, BentoGridItem } from "./components/ui/bento-grid";


export default function Projects({sectionChosen, setSelected}){
    return (
        <div className="flex flex-col h-full z-20">
            <button onClick={()=>setSelected("Home")} className="bg-black text-white p-2 rounded-lg m-2">Back</button>
            <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                {sectionChosen.map((project, index) => (
                    
                        <BentoGridItem 
                        key={index}
                        title={project.name}
                        description={project.description}
                        header={<img className="h-full w-full object-center rounded-lg object-cover" src={project.image}/>}
                        className={`${project.className}`}
                        href={project.link}
                        />
                ))}
            </BentoGrid>
        </div>
    )
}