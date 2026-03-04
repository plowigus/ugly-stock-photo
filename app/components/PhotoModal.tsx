import { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import useEmblaCarousel from 'embla-carousel-react';

// Rejestracja pluginu (opcjonalnie, jeśli używasz dodatków)
gsap.registerPlugin(useGSAP);

export interface WorkItem {
    id: number;
    title: string;
    type: string;
    year: string;
    about: string;
    src: string;
    srcAlt?: string;
    images?: string[]; // Array for the gallery carousel
    imagesAlt?: string[]; // Alt SEO per image, parallel to images
}

interface PhotoModalProps {
    items: WorkItem[];
    activeIndex: number | null;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export function PhotoModal({ items, activeIndex, onClose, onPrev, onNext }: PhotoModalProps) {
    const isOpen = activeIndex !== null;
    const item = activeIndex !== null ? items[activeIndex] : null;

    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [displayItem, setDisplayItem] = useState<WorkItem | null>(null);

    // Embla setup for the internal gallery
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        containScroll: 'trimSnaps'
    });

    // Reset embla scroll when item changes
    useEffect(() => {
        if (emblaApi) emblaApi.scrollTo(0);
    }, [activeIndex, emblaApi]);

    // Obsługa klawiatury
    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') {
            // If gallery is focused or we want standard prev? 
            // For now, let's stick to project navigation, OR check if we have multiple images
            onPrev();
        }
        if (e.key === 'ArrowRight') onNext();
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden'; // Blokada scrolla
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKey]);

    // Synchronizacja displayItem dla efektu "fade out -> change -> fade in"
    useEffect(() => {
        if (item) setDisplayItem(item);
    }, [item]);

    // Animacja wejścia całego modala
    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [isOpen]);

    // Animacja zmiany treści (slajdów)
    useGSAP(() => {
        if (activeIndex !== null && contentRef.current) {
            const tl = gsap.timeline();
            tl.fromTo(".animate-slide",
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out' }
            );
        }
    }, [activeIndex]);

    if (!isOpen || !displayItem) return null;

    const galleryImages = displayItem.images || [displayItem.src, displayItem.srcAlt].filter(Boolean) as string[];

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-black flex flex-col focus:outline-none"
        >
            {/* ── TOP BAR ── */}
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-neutral-800">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest hidden sm:block">
                    UGLYSTOCK — GALLERY VIEW
                </span>

                <div className="flex items-center gap-6 mx-auto sm:mx-0 sm:hidden">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-px transition-colors duration-300 ${i === activeIndex ? 'bg-white' : 'bg-neutral-700'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="p-2 border border-neutral-800 hover:bg-white hover:text-black transition-colors ml-auto sm:ml-0 cursor-pointer"
                >
                    <X size={13} strokeWidth={2} />
                </button>
            </div>

            {/* ── BODY ── */}
            <div ref={contentRef} className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">

                {/* LEFT PANEL */}
                <div className="shrink-0 w-full sm:w-80 md:w-[400px] border-b sm:border-b-0 sm:border-r border-neutral-800 flex flex-col justify-between p-8 sm:p-12 bg-[#050505]">
                    <div className="animate-slide flex flex-col gap-0">
                        <h2 className="font-black uppercase tracking-tighter text-2xl sm:text-3xl leading-tight mb-2 italic">
                            {displayItem.title}
                        </h2>
                        <p className="font-mono text-xs text-neutral-400 mb-8 sm:mb-6">
                            [{displayItem.type}]
                        </p>

                        <div className="mb-6">
                            <p className="font-black text-xs uppercase tracking-widest mb-1 opacity-40">Year</p>
                            <p className="font-mono text-sm text-neutral-300">{displayItem.year}</p>
                        </div>

                        <div>
                            <p className="font-black text-xs uppercase tracking-widest mb-1 opacity-40">About</p>
                            <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed text-justify">
                                {displayItem.about}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-10">
                        <p className="font-mono text-[10px] text-neutral-700 hidden sm:block uppercase tracking-widest">
                            ← → Project Nav &nbsp;·&nbsp; ESC Close
                        </p>
                    </div>
                </div>

                {/* RIGHT — INTERNAL GALLERY CAROUSEL (Film Strip Mode) */}
                <div className="flex-1 relative overflow-hidden min-h-0 bg-black group/gallery">
                    <div className="embla h-full" ref={emblaRef}>
                        <div className="embla__container h-full flex items-start">
                            {galleryImages.map((imgSrc, idx) => {
                                const alt =
                                    displayItem.imagesAlt?.[idx] ||
                                    `${displayItem.title} - frame ${idx + 1}`;
                                return (
                                    <div key={idx} className="embla__slide relative flex-[0_0_auto] h-full mx-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imgSrc}
                                            alt={alt}
                                            className="h-full w-auto block grayscale"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* OVERLAY GALLERY CONTROLS */}
                    {galleryImages.length > 1 && (
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
                                className="p-4 bg-black/80 border border-neutral-800 text-white hover:bg-white hover:text-black transition-all cursor-pointer pointer-events-auto active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
                                className="p-4 bg-black/80 border border-neutral-800 text-white hover:bg-white hover:text-black transition-all cursor-pointer pointer-events-auto active:scale-95"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="shrink-0 flex items-center justify-between border-t border-neutral-800 bg-black">
                <button
                    onClick={onPrev}
                    className="flex-1 flex items-center gap-3 px-6 sm:px-8 py-5 hover:bg-neutral-900 transition-colors group border-r border-neutral-800 cursor-pointer"
                >
                    <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors uppercase tracking-widest">
                        ← PREV
                    </span>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-neutral-600 group-hover:text-white transition-colors truncate hidden sm:block">
                        {items[(activeIndex! - 1 + items.length) % items.length]?.title}
                    </span>
                </button>

                <div className="px-6 shrink-0 hidden sm:flex items-center">
                    <span className="font-mono text-xs text-neutral-600 tabular-nums">
                        {String(activeIndex! + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(items.length).padStart(2, '0')}
                    </span>
                </div>

                <button
                    onClick={onNext}
                    className="flex-1 flex items-center justify-end gap-3 px-6 sm:px-8 py-5 hover:bg-neutral-900 transition-colors group border-l border-neutral-800 cursor-pointer"
                >
                    <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-neutral-600 group-hover:text-white transition-colors truncate hidden sm:block">
                        {items[(activeIndex! + 1) % items.length]?.title}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors uppercase tracking-widest">
                        NEXT →
                    </span>
                </button>
            </div>
        </div>
    );
}
