"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Service {
    title: string;
    desc: string;
}

const SERVICES: Service[] = [
    { title: 'Live Coverage', desc: 'Moshpits, stages, backstage chaos.' },
    { title: 'Band Portraits', desc: 'No posing. Just attitude.' },
    { title: 'Album Art', desc: 'Gritty textures and raw visuals.' },
    { title: 'Tour Documentary', desc: 'Life on the road, unfiltered.' },
];

export function SectionExpertise() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1 }
        });

        // Animacja tytułu
        tl.fromTo(titleRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0 }
        );

        // Animacja elementów listy (stagger)
        const items = listRef.current?.querySelectorAll('.service-item');
        if (items) {
            tl.fromTo(items,
                { opacity: 0, x: 30 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.1, // kaskadowe wchodzenie co 0.1s
                    duration: 0.8
                },
                "-=0.6" // zacznij zanim tytuł skończy się animować
            );
        }
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col p-6 xl:p-12 bg-black text-white overflow-hidden"
        >
            <div className="max-w-6xl mx-auto w-full h-full overflow-hidden no-scrollbar">
                <div className="py-8 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-8 xl:mb-16">
                        <h2
                            ref={titleRef}
                            className="text-5xl sm:text-6xl xl:text-8xl font-black uppercase tracking-tighter"
                        >
                            LET'S COLLAB
                        </h2>
                    </div>

                    <div ref={listRef} className="space-y-0 max-w-4xl">
                        {SERVICES.map((service, index) => (
                            <div
                                key={index}
                                className="service-item flex flex-col xl:flex-row justify-between items-start xl:items-end border-b border-white py-4 xl:py-5 group hover:bg-neutral-900 transition-colors px-4 cursor-crosshair"
                            >
                                <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold uppercase tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="font-mono text-xs sm:text-xs xl:text-sm mt-2 xl:mt-0 uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors xl:w-56 xl:shrink-0 xl:text-left">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}