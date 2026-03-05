"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useEmblaCarousel from 'embla-carousel-react';
import { PhotoModal, type WorkItem } from './PhotoModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}



export function SectionWork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
    const [works, setWorks] = useState<WorkItem[]>([]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 30,
        skipSnaps: false,
        align: 'center',
    });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await fetch("/api/works", { cache: 'no-store' });
                if (!res.ok) throw new Error("Failed to fetch works");
                const json = await res.json() as { data: WorkItem[] };
                if (Array.isArray(json.data) && json.data.length > 0) {
                    setWorks(json.data);
                }
            } catch (error) {
                console.error("Failed to load works for SectionWork:", error);
            }
        };

        fetchWorks();
    }, []);

    const nextSlide = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const prevSlide = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    // Modal Handlers
    const handleOpenModal = (index: number) => setActiveModalIndex(index);
    const handleCloseModal = () => setActiveModalIndex(null);
    const handlePrevModal = () => setActiveModalIndex(prev =>
        prev !== null && works.length > 0
            ? (prev - 1 + works.length) % works.length
            : null
    );
    const handleNextModal = () => setActiveModalIndex(prev =>
        prev !== null && works.length > 0
            ? (prev + 1) % works.length
            : null
    );


    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1 }
        });

        tl.fromTo([titleRef.current, ".nav-controls"],
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, stagger: 0.1 }
        )
            .fromTo(".work-card",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.1
                },
                "-=0.6"
            );
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
                            className="text-5xl sm:text-6xl xl:text-8xl font-black uppercase tracking-tight"
                        >
                            Selected Works
                        </h2>

                        <div className="nav-controls hidden xl:flex gap-4 mb-2 xl:mb-4">
                            <button
                                onClick={prevSlide}
                                className="p-3 border cursor-pointer border-white hover:bg-white hover:text-black transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 border cursor-pointer border-white hover:bg-white hover:text-black transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Embla Viewport */}
                    <div className="embla relative flex-1 min-h-0 overflow-hidden" ref={emblaRef}>
                        <div className="embla__container flex h-full -mx-4 xl:-mx-8">
                            {works.map((work, index) => {
                                const isActive = currentIndex === index;
                                return (
                                    <div
                                        key={work.id}
                                        className="embla__slide relative min-w-full h-full px-4 xl:px-9"
                                    >
                                        <div
                                            className={cn(
                                                "work-card group relative w-full h-full bg-neutral-900 border-2 border-white px-px overflow-hidden cursor-pointer will-change-transform",
                                                isActive && "ring-2 ring-inset ring-white"
                                            )}
                                            onClick={() => {
                                                if (isActive) {
                                                    handleOpenModal(index);
                                                } else {
                                                    emblaApi?.scrollTo(index);
                                                }
                                            }}
                                        >
                                            <Image
                                                src={work.src}
                                                alt={work.title}
                                                fill
                                                priority={index === 0}
                                                className="object-cover grayscale contrast-125"
                                            />

                                            <div className={cn(
                                                "absolute inset-0 bg-black/60 transition-opacity duration-500 flex flex-col justify-center items-center p-4 text-center",
                                                isActive ? "opacity-100" : "opacity-0"
                                            )}>
                                                <div className="overflow-hidden">
                                                    <span className={cn(
                                                        "block text-4xl sm:text-6xl xl:text-8xl font-black uppercase tracking-tighter transform transition-transform duration-500 delay-100",
                                                        isActive ? "translate-y-0" : "translate-y-full"
                                                    )}>
                                                        {work.title}
                                                    </span>
                                                </div>
                                                <span className={cn(
                                                    "text-xs xl:text-base font-mono mt-4 uppercase tracking-[0.3em] transition-opacity duration-700 delay-300",
                                                    isActive ? "opacity-100" : "opacity-0"
                                                )}>
                                                    {work.type}
                                                </span>
                                                <ArrowUpRight className={cn(
                                                    "mt-8 w-8 h-8 xl:w-12 xl:h-12 transition-opacity duration-700 delay-500",
                                                    isActive ? "opacity-100" : "opacity-0"
                                                )} />
                                            </div>

                                            <div className="absolute bottom-8 right-8 font-mono text-xl xl:text-2xl font-bold">
                                                {index + 1} / {works.length}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <PhotoModal
                items={works}
                activeIndex={activeModalIndex}
                onClose={handleCloseModal}
                onPrev={handlePrevModal}
                onNext={handleNextModal}
            />
        </div>
    );
}
