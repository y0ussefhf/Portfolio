import { BentoGrid, BentoGridItem } from "./components/ui/bento-grid";
import { useState, useEffect } from "react"
import Skeleton from "./components/ui/skeleton";

export default function Projects({ sectionChosen, setSelected }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);
    return (
        <div className={`flex flex-col h-full z-20 overflow-hidden transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={() => setSelected("Home")} className="bg-black text-white font-bold p-2 rounded-lg my-2 mx-8 lg:mx-20 hover:bg-[#1a1a1a] duration-500 ease-in-out">BACK</button>
            <BentoGrid className="w-full px-8 lg:px-20 md:auto-rows-[20rem]">
                {sectionChosen.map((project, index) => (

                    <BentoGridItem
                        key={index}
                        title={project.name}
                        description={project.description}
                        header={<BentoHeader project={project} />}
                        className={`${project.className}`}
                        href={project.link}
                    />
                ))}
            </BentoGrid >
        </div >
    )
}

const BentoHeader = ({ project }) => {
    return (
        <div className={`grid h-full ${project.multipleImages ? " grid-rows-3 grid-cols-4 gap-2" : ""}`}>
            <ImageComponent image={project.image} className={`h-full w-full object-center rounded-lg object-cover ${project.multipleImages ? "col-span-3 row-span-2" : ""}`} index={0}/>
            {project.multipleImages &&
                <ImageComponent className="h-full w-full object-cover rounded-lg" image={project.secondImage} index={1}/>
            }
            {project.multipleImages &&
                <ImageComponent className="h-full w-full object-cover rounded-lg" image={project.thirdImage} index={2}/>
            }
            {project.multipleImages &&
                <ImageComponent className="h-full w-full object-cover rounded-lg col-span-4" image={project.fourthImage} index={3}/>
            }
        </div>
    )
}


const ImageComponent = ({ image, className, index }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <Skeleton className={`w-full h-full rounded-lg ${index === 0 ? "col-span-3 row-span-2" : index === 3 ? "col-span-4" : ""}`} />
            )}
            <img
                onLoad={() => setIsLoading(false)}
                className={`${className} transition-opacity duration-1000 ease-in-out ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
                src={image}
                style={{ display: isLoading ? 'none' : 'block' }}
                alt=""
            />
        </>
    );
};
