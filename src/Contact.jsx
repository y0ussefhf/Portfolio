import React from "react";
import { useState, useEffect } from 'react'
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaSquareBehance } from "react-icons/fa6";
import { FaSquareEnvelope } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";

export default function About() {
    
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      setIsVisible(true);
    }, []);
    return(
        <div className={`overflow-y-hidden transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col lg:flex-row pb-52 h-full w-full justify-center items-center`}>
            <svg width="0" height="0">
                <linearGradient id="blue-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop stopColor="#7a6ded" offset="0%" />
                    <stop stopColor="#591885" offset="100%" />
                </linearGradient>
            </svg>
            <a href="https://api.whatsapp.com/send?phone=201113646159" target="_blank" rel="noopener noreferrer"><FaSquareWhatsapp style={{ fill: "url(#blue-gradient)" }} className="text-9xl lg:text-[10rem] hover:text-[12rem] duration-500 ease-in-out"/></a>            
            <a href="https://behance.com/youssefhf" target="_blank"><FaSquareBehance style={{ fill: "url(#blue-gradient)" }} className="text-9xl lg:text-[10rem] hover:text-[12rem] duration-500 ease-in-out"/></a>
            <a href="mailto:youssof.hesham@gmail.com" target="_blank" rel="noopener noreferrer"><FaSquareEnvelope style={{ fill: "url(#blue-gradient)" }} className="text-9xl lg:text-[10rem] hover:text-[12rem] duration-500 ease-in-out"/></a>
            <a href="https://linkedin.com/in/youssefhf/" target="_blank" rel="noopener noreferrer"><FaLinkedin style={{ fill: "url(#blue-gradient)" }} className="text-9xl lg:text-[10rem] hover:text-[12rem] duration-500 ease-in-out"/></a>
        </div>
)}
