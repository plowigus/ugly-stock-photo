"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Work {
    id: number;
    title: string;
    type: string;
}

const WORKS: Work[] = [
    { id: 1, title: 'MOSHPIT 01', type: 'CONCERT' },
    { id: 2, title: 'DECAY 04', type: 'URBAN' },
    { id: 3, title: 'NOISE 09', type: 'PORTRAIT' },
    { id: 4, title: 'STATIC 02', type: 'ABSTRACT' },
    { id: 5, title: 'RIOT 11', type: 'STREET' },
    { id: 6, title: 'VOID 07', type: 'TEXTURE' },
];

export function SectionWork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        if (currentIndex < WORKS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // Loop back
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(WORKS.length - 1); // Loop to end
        }
    };

    // 1. Entry Animation - runs once
    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1 }
        });

        tl.fromTo([titleRef.current, ".nav-controls"],
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, stagger: 0.1 }
        )
            .fromTo(".work-card",
                { opacity: 0, scale: 0.9, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.8
                },
                "-=0.6"
            );
    }, { scope: containerRef });

    // 2. Slider Animation - depends on currentIndex
    useGSAP(() => {
        gsap.to(sliderRef.current, {
            x: `-${currentIndex * 100}%`,
            duration: 1.2,
            ease: "expo.out",
            overwrite: "auto"
        });
    }, { scope: containerRef, dependencies: [currentIndex] });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col p-6 md:p-12 bg-black text-white overflow-hidden"
        >
            <div
                className="max-w-6xl mx-auto w-full h-full overflow-hidden no-scrollbar"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="py-8 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-8 md:mb-16">
                        <h2
                            ref={titleRef}
                            className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter"
                        >
                            Selected Works
                        </h2>

                        <div className="nav-controls flex gap-4 mb-2 md:mb-4">
                            <button
                                onClick={prevSlide}
                                className="p-3 border border-white hover:bg-white hover:text-black transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 border border-white hover:bg-white hover:text-black transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0">
                        <div
                            ref={sliderRef}
                            className="flex h-full transition-none" // Traktujemy to jako surowy kontener dla GSAP
                        >
                            {WORKS.map((work, index) => (
                                <div
                                    key={work.id}
                                    className="work-card group relative min-w-full h-full bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    {/* Image */}
                                    <Image
                                        src={
                                            index % 3 === 0 ? "https://images.unsplash.com/photo-1730508378933-b9f0607cebfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkY29yZSUyMHB1bmslMjBjb25jZXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGhpZ2glMjBjb250cmFzdHxlbnwxfHx8fDE3NzI1NTU3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" :
                                                index % 3 === 1 ? "https://images.unsplash.com/photo-1616797147704-7df2e256d397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmVzc2VkJTIwcG9ydHJhaXQlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwZWRneXxlbnwxfHx8fDE3NzI1NTU3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" :
                                                    "https://images.unsplash.com/photo-1715759406117-76aeee4281a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncml0dHklMjB1cmJhbiUyMHRleHR1cmUlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDF8fHx8MTc3MjU1NTczNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                        }
                                        alt={work.title}
                                        fill
                                        className="object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Info Overlay - Visible always on mobile, hover on desktop */}
                                    <div className="absolute inset-0 bg-black/60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                                        <div className="overflow-hidden">
                                            <span className="block text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                {work.title}
                                            </span>
                                        </div>
                                        <span className="text-xs md:text-base font-mono mt-4 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                                            {work.type}
                                        </span>
                                        <ArrowUpRight className="mt-8 w-8 h-8 md:w-12 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-500" />
                                    </div>

                                    {/* Pagination Counter */}
                                    <div className="absolute bottom-8 right-8 font-mono text-xl md:text-2xl font-bold">
                                        {index + 1} / {WORKS.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}