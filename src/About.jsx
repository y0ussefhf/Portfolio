import React from "react";
import { useState, useEffect } from 'react'

export default function About() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      setIsVisible(true);
    }, []);
    return (
        <div className={`transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col justify-center lg:flex-row`}>
            <div className="pl-8 pt-6 pr-8 lg:pr-0 lg:pl-20 lg:pt-12 lg:w-3/4">
                <div>
                    <h1 className="border-b-2 border-black text-2xl font-[NexaHeavy] pb-2">EXPERIENCE</h1>
                    <div className="flex justify-between pt-2 flex-col lg:flex-row">
                        <div className="font-bold text-lg">
                            Nasr Consultant | Intern
                        </div>
                        <div className="text-zinc-700 lg:self-center font-semibold">
                            August 2022 - October 2022
                        </div>
                    </div>
                    <ul className="pl-8 font-bold list-disc">
                        <li className="pl-4">Initial exterior design concepts for Banque du Caire – Aswan Branch </li>
                        <li className="pl-4">Initial floor plan for Banque du Caire – Aswan Branch </li>
                        <li className="pl-4">BOQ Revision </li>
                    </ul>
                </div>
                <div>
                    <h1 className="border-b-2 border-black font-[NexaHeavy] text-2xl py-2">EDUCATION</h1>
                    <div className="flex flex-col lg:flex-row justify-between pt-2">
                        <div className="text-lg font-bold">
                            Arab Academy for Science and Technology
                        </div>
                        <div className="text-zinc-700 lg:self-center font-semibold">
                            2018 - 2023
                        </div>
                    </div>
                    <div className="pb-4 font-bold">
                        B.Sc. of Architecture
                    </div>
                </div>
                <div>
                    <h1 className="border-b-2 border-black font-[NexaHeavy] text-2xl pb-2">SKILLS</h1>
                    <ul className="pl-12 list-disc pt-2 font-bold">
                        <li className="pl-4">3D Modelling</li>
                        <li className="pl-4">3D Texturing</li>
                        <li className="pl-4">Digital Sculpting</li>
                        <li className="pl-4">Architectural Design</li>
                        <li className="pl-4">Interior Design</li>
                        <li className="pl-4">Digital Painting</li>
                        <li className="pl-4">Compositing</li>
                        <li className="pl-4">Matte Painting</li>
                    </ul>
                </div>
                <div>
                    <h1 className="border-b-2 border-black font-[NexaHeavy] text-2xl pb-2">PROJECTS</h1>
                    <ul className="pl-12 list-disc pt-2 font-bold">
                        <li className="pl-4">Culture Center - Sayeda Eisha, Cairo, Egypt.</li>
                        <li className="pl-4">Transport Hub – Marsa Matrouh, Egypt</li>
                        <li className="pl-4">Life – Qarun Lake Shore, Faiyum, Egypt</li>
                        <li className="pl-4">Coworking hub – Heliopolis, Cairo, Egypt</li>
                        <li className="pl-4">Housing – Sherouk, Cairo, Egypt</li>
                        <li className="pl-4">Park – Sheraton, Cairo, Egypt</li>
                        <li className="pl-4">Scandinavian Bedroom</li>
                        <li className="pl-4">Art Deco Bedroom</li>
                        <li className="pl-4">Wood Cabin</li>
                    </ul>
                </div>
            </div>
            <div className="hidden lg:flex justify-end w-2/5 h-2/5 self-end"><img className="lg:w-full" src="src/assets/AboutPicture.png" /></div>
        </div>
    )
}
