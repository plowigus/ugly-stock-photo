"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Briefcase, MessageSquare, ImageIcon, ListChecks } from "lucide-react";
import { getWorks, type WorkItem } from "@/lib/actions";

export default function AdminDashboard() {
    const [works, setWorks] = useState<WorkItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorks();
    }, []);

    async function fetchWorks() {
        setLoading(true);
        const data = await getWorks();
        setWorks(data as WorkItem[]);
        setLoading(false);
    }

    const stats = [
        { name: "HOME SECTIONS", value: "3", icon: LayoutDashboard },
        { name: "WORKS", value: works.length.toString(), icon: Briefcase },
        { name: "SERVICES", value: "4", icon: ListChecks },
        { name: "MESSAGES", value: "0", icon: MessageSquare },
    ];

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="border-l-4 border-white pl-8">
                <h1 className="text-6xl font-black uppercase tracking-tighter">DASHBOARD</h1>
                <p className="mt-4 text-neutral-500 font-mono text-sm uppercase tracking-widest leading-relaxed">
                    RAW FEED INGESTION. NO TECHNICAL SHAPES.
                    <br />
                    OVERVIEW OF THE GRID.
                </p>
            </header>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-12 border border-white/20 hover:bg-white hover:text-black transition-all group cursor-crosshair">
                        <div className="flex items-center justify-between mb-8">
                            <stat.icon size={24} className="group-hover:scale-125 transition-transform" />
                            <span className="text-[10px] font-black opacity-20 group-hover:opacity-100">0x{stat.name.length}</span>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">{stat.name}</h3>
                        <p className="text-5xl font-black mt-4 tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>





        </div>
    );
}
