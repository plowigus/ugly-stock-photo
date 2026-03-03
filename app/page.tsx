"use client";

import "@fontsource/inter/400.css";
import "@fontsource/inter/900.css";
import "@fontsource/jetbrains-mono/400.css";
import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionHome } from './components/SectionHome';
import { SectionManifesto } from './components/SectionManifesto';
import { SectionWork } from './components/SectionWork';
import { SectionExpertise } from './components/SectionExpertise';
import { SectionContact } from './components/SectionContact';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Rejestracja pluginu
gsap.registerPlugin(useGSAP);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Section {
  id: number;
  label: string;
  title: string;
  component: React.ComponentType;
}

const SECTIONS: Section[] = [
  { id: 0, label: '01', title: 'Home', component: SectionHome },
  { id: 1, label: '02', title: 'About me', component: SectionManifesto },
  { id: 2, label: '03', title: 'Work', component: SectionWork },
  { id: 3, label: '04', title: 'Collab', component: SectionExpertise },
  { id: 4, label: '05', title: 'Contact', component: SectionContact },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animacja GSAP zastępująca motion.div layout
  useGSAP(() => {
    // GSAP obsłuży płynne przejście flex-grow
    gsap.to(".section-item", {
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, { dependencies: [activeSection], scope: containerRef });

  return (
    <main
      ref={containerRef}
      className="h-dvh w-screen bg-black text-white overflow-hidden flex flex-col xl:flex-row font-sans selection:bg-white selection:text-black"
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        const Component = section.component;

        return (
          <div
            key={section.id}
            onClick={() => !isActive && setActiveSection(section.id)}
            className={cn(
              "section-item group relative border-b border-neutral-800 xl:border-r transition-[flex-grow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden",
              "w-full xl:w-auto xl:h-full",
              isActive ? "grow-10 cursor-default" : "grow cursor-pointer"
            )}
          >
            {/* Hover Background Effect */}
            {!isActive && (
              <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-neutral-900/50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none" />
            )}

            {/* Expanded Content */}
            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-opacity duration-500",
                isActive ? "opacity-100 pointer-events-auto delay-300" : "opacity-0 pointer-events-none"
              )}
            >
              {/* Renderujemy komponent tylko gdy aktywny lub używamy CSS do ukrycia */}
              {isActive && <Component />}
            </div>

            {/* Collapsed / Label View */}
            <div className={cn(
              "absolute inset-0 w-full h-full flex xl:flex-col items-center justify-between p-4 xl:py-8 transition-opacity duration-300",
              isActive ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
              <span className="font-mono text-xs xl:text-sm font-bold text-white xl:mb-8 transition-transform duration-500 group-hover:-translate-y-1">
                {section.label}
              </span>

              <div className="flex-1 flex items-center justify-center">
                <span className="text-lg xl:text-2xl font-black uppercase tracking-widest whitespace-nowrap xl:[writing-mode:vertical-rl] xl:rotate-180 transition-transform duration-500 group-hover:scale-110">
                  {section.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}