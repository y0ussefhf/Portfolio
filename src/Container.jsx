import React from 'react'
import { useState } from 'react'


export default function Container({ Category , onClick}) {

    return(
        <div onClick={onClick} className="duration-500 flex-1 hover:flex-[5_1_0%] ease-in-out w-full lg:h-[32rem] rounded-[1rem] relative overflow-hidden">
          <div className={`absolute z-20 inset-0 bg-cover bg-center bg-black-500 ${Category.image} blur-sm hover:cursor-pointer duration-500 ease-in-out hover:blur-0`}></div>
          <div className="h-full flex pointer-events-none gap-2 lg:flex-col justify-center items-center relative lg:gap-0 z-20 p-4 text-white text-center">
            <h2 className="inline text-with-shadow-strong font-[NexaExtraLight] font-bold z-30 text-lg text-zinc-200">{Category.smallname}</h2>
            <h1 className="font-[NexaExtraLight] text-with-shadow-strong z-30 font-bold text-lg lg:text-2xl text-zinc-200">{Category.name}</h1>
          </div>
        </div>
    )
    
}
