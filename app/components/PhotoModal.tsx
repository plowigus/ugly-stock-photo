import { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';


gsap.registerPlugin(useGSAP);

export interface WorkItem {
    id: number;
    title: string;
    type: string;
    year: string;
    about: string;
    src: string;
    srcAlt?: string;
    venue?: string;
    city?: string;
    organizer?: string;
    images?: string[];
    imagesAlt?: string[];
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
    const [isDragging, setIsDragging] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        containScroll: 'trimSnaps'
    });

    const [emblaFullRef, emblaFullApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
    });


    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.scrollTo(0);

        const onPointerDown = () => setIsDragging(true);
        const onPointerUp = () => setIsDragging(false);

        emblaApi.on('pointerDown', onPointerDown);
        emblaApi.on('pointerUp', onPointerUp);

        // Sync main -> full
        const onSelect = () => {
            if (emblaFullApi && isFullscreenOpen) {
                const targetIndex = emblaApi.selectedScrollSnap();
                if (emblaFullApi.selectedScrollSnap() !== targetIndex) {
                    emblaFullApi.scrollTo(targetIndex, true);
                }
            }
        };
        emblaApi.on('select', onSelect);

        return () => {
            emblaApi.off('pointerDown', onPointerDown);
            emblaApi.off('pointerUp', onPointerUp);
            emblaApi.off('select', onSelect);
        };
    }, [activeIndex, emblaApi, emblaFullApi, isFullscreenOpen]);

    // Sync full -> main
    useEffect(() => {
        if (!emblaFullApi || !emblaApi) return;
        const onFullSelect = () => {
            const targetIndex = emblaFullApi.selectedScrollSnap();
            if (emblaApi.selectedScrollSnap() !== targetIndex) {
                emblaApi.scrollTo(targetIndex, true);
            }
        };
        emblaFullApi.on('select', onFullSelect);
        return () => {
            emblaFullApi.off('select', onFullSelect);
        };
    }, [emblaApi, emblaFullApi]);


    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') {
            onPrev();
        }
        if (e.key === 'ArrowRight') onNext();
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKey]);


    useEffect(() => {
        if (item) setDisplayItem(item);
    }, [item]);


    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [isOpen]);


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

            <div className="shrink-0 flex items-center justify-end px-5 sm:px-8 py-4 border-b border-neutral-800">
                {/* <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest hidden sm:block">
                    UGLYSTOCK — GALLERY VIEW
                </span> */}

                <div className="flex items-center gap-6 mx-auto lg:mx-0 lg:hidden">
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
                    className="p-2 border border-neutral-800 hover:bg-white hover:text-black transition-colors ml-auto lg:ml-0 cursor-pointer"
                >
                    <X size={13} strokeWidth={2} />
                </button>
            </div>


            <div ref={contentRef} className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">


                <div className="shrink-0 w-full lg:w-80 xl:w-[400px] border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between p-8 sm:p-12 bg-[#050505]">
                    <div className="animate-slide flex flex-col gap-0">
                        <h2 className="font-black uppercase tracking-tighter text-2xl sm:text-3xl leading-tight mb-2 italic">
                            {displayItem.title}
                        </h2>
                        <p className="font-mono text-xs uppercase text-neutral-400 mb-8 sm:mb-6">
                            [{displayItem.type}]
                        </p>

                        {(displayItem.venue || displayItem.city || displayItem.organizer) && (
                            <div className="mt-2  border-white/5 space-y-4">
                                {displayItem.venue && (
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest mb-1 opacity-40">Venue</p>
                                        <p className="font-mono uppercase text-xs sm:text-sm text-neutral-300">{displayItem.venue}</p>
                                    </div>
                                )}
                                {displayItem.city && (
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest mb-1 opacity-40">City</p>
                                        <p className="font-mono text-xs sm:text-sm text-neutral-300 uppercase">{displayItem.city}</p>
                                    </div>
                                )}
                                {displayItem.organizer && (
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest mb-1 opacity-40">Organizer</p>
                                        <p className="font-mono text-xs uppercase sm:text-sm text-neutral-300">{displayItem.organizer}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-10">
                        <p className="font-mono text-[10px] text-neutral-700 hidden lg:block uppercase tracking-widest">
                            ← → Project Nav &nbsp;·&nbsp; ESC Close
                        </p>
                    </div>
                </div>


                <div className={cn(
                    "flex-1 relative overflow-hidden min-h-0 bg-black group/gallery",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}>
                    <div className="embla h-full" ref={emblaRef}>
                        <div className="embla__container h-full flex items-start">
                            {galleryImages.map((imgSrc, idx) => {
                                const alt =
                                    displayItem.imagesAlt?.[idx] ||
                                    `${displayItem.title} - frame ${idx + 1}`;
                                return (
                                    <div
                                        key={idx}
                                        className="embla__slide relative flex-[0_0_auto] h-full mx-0 cursor-pointer lg:cursor-default"
                                        onClick={() => {
                                            if (window.innerWidth < 640) {
                                                setIsFullscreenOpen(true);
                                                setTimeout(() => {
                                                    emblaFullApi?.scrollTo(idx, true);
                                                }, 50);
                                            }
                                        }}
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={alt}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: 'auto', height: '100%' }}
                                            className="block grayscale transition-all duration-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {galleryImages.length > 1 && (
                        <div className="absolute inset-y-0 left-0 right-0 hidden lg:flex items-center justify-between px-6 pointer-events-none opacity-0 group-hover/gallery:opacity-100 transition-opacity">
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
            </div >


            < div className="shrink-0 flex items-center justify-between border-t border-neutral-800 bg-black" >
                <button
                    onClick={onPrev}
                    className="flex-1 flex items-center gap-3 px-6 sm:px-8 py-5 hover:bg-neutral-900 transition-colors group border-r border-neutral-800 cursor-pointer"
                >
                    <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors uppercase tracking-widest">
                        ← PREV
                    </span>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-neutral-600 group-hover:text-white transition-colors truncate hidden lg:block">
                        {items[(activeIndex! - 1 + items.length) % items.length]?.title}
                    </span>
                </button>

                <div className="px-6 shrink-0 hidden lg:flex items-center">
                    <span className="font-mono text-xs text-neutral-600 tabular-nums">
                        {String(activeIndex! + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(items.length).padStart(2, '0')}
                    </span>
                </div>

                <button
                    onClick={onNext}
                    className="flex-1 flex items-center justify-end gap-3 px-6 sm:px-8 py-5 hover:bg-neutral-900 transition-colors group border-l border-neutral-800 cursor-pointer"
                >
                    <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-neutral-600 group-hover:text-white transition-colors truncate hidden lg:block">
                        {items[(activeIndex! + 1) % items.length]?.title}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors uppercase tracking-widest">
                        NEXT →
                    </span>
                </button>
            </div >

            {/* FULLSCREEN OVERLAY (Mobile/Tablet Only) - Swipeable Carousel */}
            {isFullscreenOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300"
                >
                    <button
                        className="absolute top-8 right-8 p-3 border border-white/20 bg-black/50 text-white rounded-none z-100"
                        onClick={() => setIsFullscreenOpen(false)}
                    >
                        <X size={20} />
                    </button>

                    <div className="flex-1 min-h-0 relative">
                        <div className="embla h-full" ref={emblaFullRef}>
                            <div className="embla__container h-full flex">
                                {galleryImages.map((imgSrc, idx) => (
                                    <div key={idx} className="embla__slide relative flex-[0_0_100%] h-full">
                                        <Image
                                            src={imgSrc}
                                            alt={`${displayItem.title} - frame ${idx + 1}`}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                            priority={idx === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        className="h-20 shrink-0 flex items-center justify-center bg-black/80 border-t border-white/5"
                        onClick={() => setIsFullscreenOpen(false)}
                    >
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">Swipe to navigate · Tap to close</p>
                    </div>
                </div>
            )}

            {/* PRELOADER - Forces browser to cache all gallery images immediately on modal open */}
            <div className="hidden" aria-hidden="true">
                {galleryImages.map((src, idx) => (
                    <Image
                        key={`preload-${idx}`}
                        src={src}
                        alt="preload"
                        width={1}
                        height={1}
                        priority={idx < 5}
                    />
                ))}
            </div>
        </div >
    );
}
