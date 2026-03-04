"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    LogOut,
    Type,
    ListChecks,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

const sidebarLinks = [
    { name: "HOME", href: "/admin/home", icon: LayoutDashboard },
    { name: "ABOUT ME", href: "/admin/aboutme", icon: ImageIcon },
    { name: "WORK", href: "/admin/work", icon: Briefcase },
    { name: "COLLAB", href: "/admin/collab", icon: MessageSquare },
    { name: "CONTACT", href: "/admin/contact", icon: ListChecks },
];

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-black font-mono text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white bg-black lg:flex">
                <div className="flex h-24 items-center px-8 border-b border-white">
                    <Link href="/admin" className="text-xl font-black uppercase tracking-tighter">
                        UGLY ADMIN
                    </Link>
                </div>

                <nav className="flex-1 py-4">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-8 py-4 text-sm font-bold tracking-widest transition-all duration-200 uppercase",
                                    isActive
                                        ? "bg-white text-black"
                                        : "text-white hover:bg-neutral-900"
                                )}
                            >
                                <Icon size={16} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center justify-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-tighter border-2 border-white hover:bg-white hover:text-black transition-all"
                    >
                        <LogOut size={16} />
                        LOGOUT
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-100 bg-black lg:hidden">
                    <div className="flex h-16 items-center justify-between px-8 border-b border-white">
                        <span className="text-lg font-black uppercase tracking-tighter">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border border-white">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="py-8">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 px-8 py-6 text-xl font-black border-b border-white uppercase tracking-tighter",
                                        isActive ? "bg-white text-black" : "text-white"
                                    )}
                                >
                                    <Icon size={24} />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <div className="p-8">
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="flex w-full items-center justify-center gap-3 px-4 py-6 text-lg font-black uppercase border-2 border-white hover:bg-white hover:text-black transition-all"
                            >
                                <LogOut size={22} />
                                LOGOUT
                            </button>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative bg-black h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {/* Header Mobile */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white bg-black px-8 lg:hidden">
                    <span className="text-lg font-black uppercase tracking-tighter">UGLY</span>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 border border-white">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="p-8 lg:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
}
