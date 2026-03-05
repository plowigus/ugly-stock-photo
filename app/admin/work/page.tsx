"use client";

import { useState, useEffect } from "react";
import { Briefcase, Plus, Trash2, Edit3, X, ImageIcon, ArrowUpRight } from "lucide-react";
import { getWorks, addWork, updateWork, deleteWork, seedWorks, type WorkItem, type NewWorkItem } from "@/lib/actions";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

export default function WorkManagementPage() {
    const [works, setWorks] = useState<WorkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedMessage, setSeedMessage] = useState<string | null>(null);
    const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
    const [newWork, setNewWork] = useState<Partial<NewWorkItem>>({
        title: "",
        type: "EXPERIMENTAL",
        year: new Date().getFullYear().toString(),
        src: "",
        venue: "",
        city: "",
        organizer: "",
        images: [],
        imagesAlt: [],
    });
    const [editWork, setEditWork] = useState<Partial<NewWorkItem>>({
        title: "",
        type: "",
        year: "",
        src: "",
        venue: "",
        city: "",
        organizer: "",
        images: [],
        imagesAlt: [],
    });
    const [isUploadingNewGallery, setIsUploadingNewGallery] = useState(false);
    const [isUploadingNewCover, setIsUploadingNewCover] = useState(false);
    const [isUploadingEditGallery, setIsUploadingEditGallery] = useState(false);
    const [isUploadingEditCover, setIsUploadingEditCover] = useState(false);

    useEffect(() => {
        fetchWorks();
    }, []);

    async function fetchWorks() {
        setLoading(true);
        const data = await getWorks();
        setWorks(data as WorkItem[]);
        setLoading(false);
    }

    async function handleAddWork() {
        if (!newWork.title || !newWork.src) return;
        const result = await addWork(newWork as NewWorkItem);
        if (result.success) {
            setIsAdding(false);
            setNewWork({
                title: "",
                type: "EXPERIMENTAL",
                year: new Date().getFullYear().toString(),
                src: "",
                srcAlt: "",
                venue: "",
                city: "",
                organizer: "",
                images: [],
                imagesAlt: [],
                orderIndex: (works.length > 0 ? Math.max(...works.map(w => w.orderIndex)) + 1 : 0)
            });
            fetchWorks();
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure? This action is RAW and irreversible.")) return;
        const result = await deleteWork(id);
        if (result.success) fetchWorks();
    }

    function startEditing(work: WorkItem) {
        setEditingWork(work);
        setEditWork({
            title: work.title,
            type: work.type,
            year: work.year,
            src: work.src,
            srcAlt: work.srcAlt ?? "",
            venue: work.venue ?? "",
            city: work.city ?? "",
            organizer: work.organizer ?? "",
            images: work.images ?? [],
            imagesAlt: (work as any).imagesAlt ?? [],
            orderIndex: work.orderIndex,
        });
    }

    function cancelEditing() {
        setEditingWork(null);
        setEditWork({
            title: "",
            type: "",
            year: "",
            src: "",
            venue: "",
            city: "",
            organizer: "",
            images: [],
            imagesAlt: [],
            orderIndex: 0,
        });
    }

    async function handleUpdateWork() {
        if (!editingWork) return;
        if (!editWork.title || !editWork.src) return;
        const result = await updateWork(editingWork.id, editWork);
        if (result.success) {
            cancelEditing();
            fetchWorks();
        }
    }

    async function handleSeed() {
        try {
            setIsSeeding(true);
            setSeedMessage(null);
            const result = await seedWorks();
            if (result.success && result.inserted) {
                setSeedMessage(`SEEDED_${result.inserted}_PROJECTS`);
            } else if (result.success && result.skipped) {
                setSeedMessage("DATABASE_ALREADY_CONTAINS_WORKS");
            } else {
                setSeedMessage("SEED_FAILED");
            }
            await fetchWorks();
        } finally {
            setIsSeeding(false);
        }
    }


    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8 animate-in fade-in duration-1000">


            <section className="max-w-7xl mx-auto space-y-12 pb-24">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">ACTIVE_COLLECTION</h2>
                        <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em] mt-1">STREAMING_DATABASE_STATE // {works.length} NODES_FOUND</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="group flex items-center gap-3 bg-white text-black px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all cursor-pointer shadow-[8px_8px_0px_rgba(255,255,255,0.05)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        INGEST_NEW
                    </button>
                </div>

                {isAdding && (
                    <div className="fixed inset-0 z-100 h-full flex flex-col bg-neutral-950 animate-in fade-in duration-300">
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tighter italic">
                                    INGEST_NEW_PROJECT
                                </h3>
                                <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-[0.2em] mt-0.5">
                                    CLUSTER_ENTRY_NODE // INITIALIZING...
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
                                DISCARD
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-10">
                            {/* BASIC DATA SECTION */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">01 // PROJECT_IDENTITY</label>
                                    <input
                                        type="text"
                                        placeholder="ENTER PROJECT TITLE..."
                                        className="w-full bg-transparent border-b border-white/10 py-3 font-black text-xl md:text-2xl outline-none focus:border-white transition-all uppercase placeholder:opacity-5"
                                        value={newWork.title}
                                        onChange={e => setNewWork({ ...newWork, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">02 // CLASSIFICATION</label>
                                        <input
                                            type="text"
                                            placeholder="EXPERIMENTAL"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={newWork.type}
                                            onChange={e => setNewWork({ ...newWork, type: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">03 // CHRONO_YEAR</label>
                                        <input
                                            type="text"
                                            placeholder="2026"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase text-center"
                                            value={newWork.year}
                                            onChange={e => setNewWork({ ...newWork, year: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">04 // ARRANGEMENT_INDEX</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase text-center"
                                            value={newWork.orderIndex}
                                            onChange={e => setNewWork({ ...newWork, orderIndex: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">05 // VENUE_LOCATION</label>
                                        <input
                                            type="text"
                                            placeholder="KLUB ZAŚCIANEK"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={newWork.venue || ""}
                                            onChange={e => setNewWork({ ...newWork, venue: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">06 // CITY_ORIGIN</label>
                                        <input
                                            type="text"
                                            placeholder="KRAKÓW"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={newWork.city || ""}
                                            onChange={e => setNewWork({ ...newWork, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">07 // ORGANIZER_SOURCE</label>
                                        <input
                                            type="text"
                                            placeholder="DANICING SHOES GIGS"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={newWork.organizer || ""}
                                            onChange={e => setNewWork({ ...newWork, organizer: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PRIMARY NODE SECTION - NOW AS A ROW */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h4 className="text-sm font-black uppercase tracking-tighter italic">08 // PRIMARY_ENTRY_NODE</h4>
                                    {!newWork.src && (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            content={{
                                                button: ({ ready }) => (
                                                    <div className="flex items-center gap-2">
                                                        <Plus size={14} />
                                                        {ready ? "LOAD_PHOTO" : "LOADING..."}
                                                    </div>
                                                )
                                            }}
                                            appearance={{
                                                button: "ut-ready:bg-white ut-ready:text-black ut-ready:font-black ut-ready:rounded-none ut-ready:text-[9px] ut-ready:uppercase ut-ready:tracking-widest ut-ready:px-4 ut-ready:h-8 ut-ready:hover:bg-neutral-200 ut-ready:shadow-none transition-all",
                                                allowedContent: "hidden",
                                                container: "[&>label]:after:hidden [&_input]:hidden"
                                            }}
                                            onBeforeUploadBegin={(files) => { setIsUploadingNewCover(true); return files; }}
                                            onClientUploadComplete={(res) => {
                                                setNewWork(prev => ({ ...prev, src: res[0]?.url }));
                                                setIsUploadingNewCover(false);
                                            }}
                                            onUploadError={(error) => { setIsUploadingNewCover(false); alert(`ERR: ${error.message}`); }}
                                        />
                                    )}
                                </div>

                                {newWork.src ? (
                                    <div className="group flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10">
                                        <div className="w-full md:w-32 h-24 shrink-0 relative overflow-hidden bg-black/40 border border-white/10">
                                            <img src={newWork.src} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                                            <button
                                                onClick={() => setNewWork({ ...newWork, src: "" })}
                                                className="absolute top-1 right-1 p-1 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-red-500/20"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center gap-2">
                                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 italic">COVER_SEO_ALT</label>
                                            <input
                                                type="text"
                                                placeholder="PRIMARY NODE ALT..."
                                                className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/5 transition-all uppercase"
                                                value={newWork.srcAlt || ""}
                                                onChange={e => setNewWork({ ...newWork, srcAlt: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-white/5 py-10 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon size={24} className="text-white/5 animate-pulse" />
                                        <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">NO_PRIMARY_DATA_SET</p>
                                    </div>
                                )}
                            </div>

                            {/* GALLERY SECTION */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h4 className="text-sm font-black uppercase tracking-tighter italic flex items-center gap-2">
                                        09 // GALERIA ZDJĘĆ
                                        <span className="text-[9px] font-mono text-neutral-600 not-italic tracking-widest bg-white/5 px-2 py-0.5 border border-white/5">
                                            {newWork.images?.length || 0}
                                        </span>
                                    </h4>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        content={{
                                            button: ({ ready }) => (
                                                <div className="flex items-center gap-2">
                                                    <Plus size={14} />
                                                    {ready ? "LOAD_PHOTOS" : "LOADING..."}
                                                </div>
                                            )
                                        }}
                                        appearance={{
                                            button: "ut-ready:bg-white ut-ready:text-black ut-ready:font-black ut-ready:rounded-none ut-ready:text-[9px] ut-ready:uppercase ut-ready:tracking-widest ut-ready:px-4 ut-ready:h-8 ut-ready:hover:bg-neutral-200 ut-ready:shadow-none transition-all",
                                            allowedContent: "hidden",
                                            container: "[&>label]:after:hidden [&_input]:hidden"
                                        }}
                                        onBeforeUploadBegin={(files) => { setIsUploadingNewGallery(true); return files; }}
                                        onClientUploadComplete={(res) => {
                                            const urls = res.map((file) => file.url);
                                            setNewWork(prev => ({
                                                ...prev,
                                                images: [...(prev.images ?? []), ...urls],
                                                imagesAlt: [...(prev.imagesAlt ?? []), ...urls.map(() => (prev.title as string) || "IMG")]
                                            }));
                                            setIsUploadingNewGallery(false);
                                        }}
                                        onUploadError={(error) => { setIsUploadingNewGallery(false); alert(`ERR: ${error.message}`); }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {newWork.images?.map((url, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10">
                                            <div className="w-full md:w-32 h-24 shrink-0 relative overflow-hidden bg-black/40 border border-white/10">
                                                <img src={url} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                                                <button
                                                    onClick={() => {
                                                        const imgs = [...(newWork.images || [])];
                                                        const alts = [...(newWork.imagesAlt || [])];
                                                        imgs.splice(idx, 1);
                                                        alts.splice(idx, 1);
                                                        setNewWork({ ...newWork, images: imgs, imagesAlt: alts });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-red-500/20"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-2">
                                                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 italic">SEO_ALT</label>
                                                <input
                                                    type="text"
                                                    placeholder="SEO META DATA..."
                                                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/5 transition-all uppercase"
                                                    value={newWork.imagesAlt?.[idx] || ""}
                                                    onChange={e => {
                                                        const alts = [...(newWork.imagesAlt || [])];
                                                        alts[idx] = e.target.value;
                                                        setNewWork({ ...newWork, imagesAlt: alts });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FINAL FOOTER ACTIONS */}
                        <div className="px-8 py-4 border-t border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-end sticky bottom-0 z-20">
                            <button
                                onClick={handleAddWork}
                                className="bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-white/20"
                            >
                                COMMIT_TO_CLUSTER <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {editingWork && (
                    <div className="fixed inset-0 h-full z-100 flex flex-col bg-neutral-950 animate-in fade-in duration-300">
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tighter italic">
                                    MODIFY_PROJECT_STATE
                                </h3>
                                <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-[0.2em] mt-0.5">
                                    UPDATING_NODE_STREAM // ACTIVE_INSTANCE: {editingWork?.id}
                                </p>
                            </div>
                            <button
                                onClick={cancelEditing}
                                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
                                ABORT
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-10">
                            {/* BASIC DATA SECTION */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">01 // PROJECT_IDENTITY</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/10 py-3 font-black text-xl md:text-2xl outline-none focus:border-white transition-all uppercase placeholder:opacity-5"
                                        value={editWork.title ?? ""}
                                        onChange={e => setEditWork({ ...editWork, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">02 // CLASSIFICATION</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={editWork.type ?? ""}
                                            onChange={e => setEditWork({ ...editWork, type: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">03 // CHRONO_YEAR</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase text-center"
                                            value={editWork.year ?? ""}
                                            onChange={e => setEditWork({ ...editWork, year: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">04 // ARRANGEMENT_INDEX</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase text-center"
                                            value={editWork.orderIndex}
                                            onChange={e => setEditWork({ ...editWork, orderIndex: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">05 // VENUE_LOCATION</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={editWork.venue ?? ""}
                                            onChange={e => setEditWork({ ...editWork, venue: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">06 // CITY_ORIGIN</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={editWork.city ?? ""}
                                            onChange={e => setEditWork({ ...editWork, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">07 // ORGANIZER_SOURCE</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/10 transition-all uppercase"
                                            value={editWork.organizer ?? ""}
                                            onChange={e => setEditWork({ ...editWork, organizer: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PRIMARY NODE SECTION - NOW AS A ROW */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h4 className="text-sm font-black uppercase tracking-tighter italic">08 // PRIMARY_ENTRY_NODE</h4>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        content={{
                                            button: ({ ready }) => (
                                                <div className="flex items-center gap-2">
                                                    <Plus size={14} />
                                                    {ready ? "REPLACE_PHOTO" : "LOADING..."}
                                                </div>
                                            )
                                        }}
                                        appearance={{
                                            button: "ut-ready:bg-white ut-ready:text-black ut-ready:font-black ut-ready:rounded-none ut-ready:text-[9px] ut-ready:uppercase ut-ready:tracking-widest ut-ready:px-4 ut-ready:h-8 ut-ready:hover:bg-neutral-200 ut-ready:shadow-none transition-all",
                                            allowedContent: "hidden",
                                            container: "[&>label]:after:hidden [&_input]:hidden"
                                        }}
                                        onBeforeUploadBegin={(files) => { setIsUploadingEditCover(true); return files; }}
                                        onClientUploadComplete={async (res) => {
                                            const url = res[0]?.url;
                                            if (url && editingWork) {
                                                setEditWork(prev => ({ ...prev, src: url }));
                                                await updateWork(editingWork.id, { src: url as string });
                                                await fetchWorks();
                                            }
                                            setIsUploadingEditCover(false);
                                        }}
                                        onUploadError={(error) => { setIsUploadingEditCover(false); alert(`ERR: ${error.message}`); }}
                                    />
                                </div>

                                <div className="group flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 relative">
                                    <div className="w-full md:w-32 h-24 shrink-0 relative overflow-hidden bg-black/40 border border-white/10">
                                        <img src={editWork.src ?? ""} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-2">
                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 italic">COVER_SEO_ALT</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/5 transition-all uppercase"
                                            value={editWork.srcAlt || ""}
                                            onChange={e => setEditWork({ ...editWork, srcAlt: e.target.value })}
                                        />
                                    </div>
                                    {isUploadingEditCover && (
                                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30 backdrop-blur-sm">
                                            <div className="text-center space-y-2">
                                                <div className="w-8 h-px bg-white animate-pulse mx-auto" />
                                                <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white">PATCHING...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GALLERY SECTION */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h4 className="text-sm font-black uppercase tracking-tighter italic flex items-center gap-2">
                                        09 // GALERIA ZDJĘĆ
                                        <span className="text-[9px] font-mono text-neutral-500 not-italic tracking-widest bg-white/5 px-2 py-0.5 border border-white/5">
                                            {editWork.images?.length || 0}
                                        </span>
                                    </h4>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        content={{
                                            button: ({ ready }) => (
                                                <div className="flex items-center gap-2">
                                                    <Plus size={14} />
                                                    {ready ? "LOAD_PHOTOS" : "LOADING..."}
                                                </div>
                                            )
                                        }}
                                        appearance={{
                                            button: "ut-ready:bg-white ut-ready:text-black ut-ready:font-black ut-ready:rounded-none ut-ready:text-[9px] ut-ready:uppercase ut-ready:tracking-widest ut-ready:px-4 ut-ready:h-8 ut-ready:hover:bg-neutral-200 ut-ready:shadow-none transition-all",
                                            allowedContent: "hidden",
                                            container: "[&>label]:after:hidden [&_input]:hidden"
                                        }}
                                        onBeforeUploadBegin={(files) => { setIsUploadingEditGallery(true); return files; }}
                                        onClientUploadComplete={async (res) => {
                                            const urls = res.map((file) => file.url);
                                            let images: string[] = [];
                                            let imagesAlt: string[] = [];
                                            setEditWork(prev => {
                                                images = [...(prev.images ?? []), ...urls];
                                                imagesAlt = [...(prev.imagesAlt ?? []), ...urls.map(() => (prev.title as string) || editingWork.title || "IMG")];
                                                return { ...prev, images, imagesAlt };
                                            });
                                            if (editingWork) {
                                                await updateWork(editingWork.id, { images, imagesAlt });
                                                await fetchWorks();
                                            }
                                            setIsUploadingEditGallery(false);
                                        }}
                                        onUploadError={(error) => { setIsUploadingEditGallery(false); alert(`ERR: ${error.message}`); }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 relative">
                                    {editWork.images?.map((url, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10">
                                            <div className="w-full md:w-32 h-24 shrink-0 relative overflow-hidden bg-black/40 border border-white/10">
                                                <img src={url} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                                                <button
                                                    onClick={async () => {
                                                        const imgs = [...(editWork.images || [])];
                                                        const alts = [...(editWork.imagesAlt || [])];
                                                        imgs.splice(idx, 1);
                                                        alts.splice(idx, 1);
                                                        setEditWork({ ...editWork, images: imgs, imagesAlt: alts });
                                                        await updateWork(editingWork.id, { images: imgs, imagesAlt: alts });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-red-500/20"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-2">
                                                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 italic">SEO_ALT</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs outline-none focus:border-white focus:bg-white/5 transition-all uppercase"
                                                    value={editWork.imagesAlt?.[idx] || ""}
                                                    onChange={e => {
                                                        const alts = [...(editWork.imagesAlt || [])];
                                                        alts[idx] = e.target.value;
                                                        setEditWork({ ...editWork, imagesAlt: alts });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {isUploadingEditGallery && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 backdrop-blur-sm">
                                            <div className="text-center space-y-2">
                                                <div className="w-8 h-px bg-white animate-pulse mx-auto" />
                                                <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white">LOADING_ASSETS...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="px-8 py-4 border-t border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-end sticky bottom-0 z-20">
                            <button
                                onClick={handleUpdateWork}
                                className="bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-white/20"
                            >
                                PUSH_PATCH <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
                <div className="space-y-6">
                    {loading ? (
                        <div className="font-mono text-xs animate-pulse p-12 text-center border border-white/10 uppercase tracking-[0.5em]">CONNECTING_TO_FEED...</div>
                    ) : (
                        <>
                            {works.map((work) => (
                                <div key={work.id} className="border border-neutral-900 p-4 flex items-center justify-between hover:border-white/40 transition-all group bg-black/40">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-16 bg-neutral-900 border border-white/5 group-hover:border-white/20 transition-all shrink-0 overflow-hidden">
                                            <img src={work.src} alt={work.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="font-black text-xs uppercase tracking-widest">{work.title}</h3>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <span className="font-mono text-[9px] bg-white/10 text-white/60 px-2 py-0.5 font-bold uppercase tracking-widest">{work.type}</span>
                                                <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">{work.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEditing(work)}
                                            className="p-3 border border-neutral-900 hover:bg-white hover:text-black transition-all cursor-pointer group-hover:border-white/10"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(work.id)}
                                            className="p-3 border border-neutral-900 text-neutral-700 hover:bg-red-900 hover:text-white hover:border-red-900 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {works.length === 0 && (
                                <div className="border-4 border-dashed border-neutral-900 p-24 text-center">
                                    <p className="font-mono text-xs text-neutral-600 uppercase tracking-[0.5em] font-black">NO_WORKS_DETECTED_IN_CLUSTER</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
