import React from 'react';
import { cn } from "../../lib/utils"

export const BentoGrid = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mx-auto",
        className
      )}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href
}) => {
  const ContentWrapper = ({ children }) => 
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-zinc-100 border border-transparent flex flex-col",
        className
      )}>
      <ContentWrapper>
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-hidden">
            {header}
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {icon && <div className="mr-2">{icon}</div>}
              <div className="font-[HeavyFont]  text-neutral-600 dark:text-neutral-200">
                {title}
              </div>
            </div>
            <div className="font-[ExtraLightFont] font-black text-neutral-500 text-xs dark:text-neutral-300 mt-2">
              {description}
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};