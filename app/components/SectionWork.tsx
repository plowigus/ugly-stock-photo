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

const WORKS: WorkItem[] = [
    {
        id: 7,
        title: 'HIROSZYMA',
        type: 'EXPERIMENTAL',
        year: '2026',
        about: 'Neon-infused shadows of a future that never arrived. A cinematic exploration of memory and light in the post-industrial landscape.',
        src: '/1.jpg',
        images: ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg'],
    },
    {
        id: 1,
        title: 'MOSHPIT 01',
        type: 'CONCERT',
        year: '2024',
        about: 'Raw energy captured in the heat of a hardcore punk concert. High contrast, grit, and movement blur.',
        src: '/3.jpg',
        srcAlt: '/4.jpg',
    },
    {
        id: 2,
        title: 'DECAY 04',
        type: 'URBAN',
        year: '2023',
        about: 'The slow disintegration of architectural forms in forgotten industrial zones. A study of texture and time.',
        src: '/5.jpg',
    },
    {
        id: 3,
        title: 'NOISE 09',
        type: 'PORTRAIT',
        year: '2024',
        about: 'Identity lost in digital static. Distorted silhouettes exploring the boundary between signal and noise.',
        src: 'https://images.unsplash.com/photo-1715759406117-76aeee4281a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncml0dHklMjB1cmJhbiUyMHRleHR1cmUlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDF8fHx8MTc3MjU1NTczNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
        id: 4,
        title: 'STATIC 02',
        type: 'ABSTRACT',
        year: '2023',
        about: 'Visual representations of electromagnetic interference. Sharp edges meeting soft gradients in high-key monochrome.',
        src: 'https://images.unsplash.com/photo-1730508378933-b9f0607cebfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkY29yZSUyMHB1bmslMjBjb25jZXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGhpZ2glMjBjb250cmFzdHxlbnwxfHx8fDE3NzI1NTU3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        srcAlt: 'https://images.unsplash.com/photo-1616797147704-7df2e256d397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmVzc2VkJTIwcG9ydHJhaXQlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwZWRneXxlbnwxfHx8fDE3NzI1NTU3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
];

export function SectionWork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
    const [works, setWorks] = useState<WorkItem[]>(WORKS);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 30, // Smoother glide
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

    // Entry Animation
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
