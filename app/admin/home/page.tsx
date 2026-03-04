"use client";

export default function AdminHomePage() {
    return (
        <div className="space-y-12">
            <header className="border-l-4 border-white pl-8">
                <h1 className="text-6xl font-black uppercase tracking-tighter">HOME CONTENT</h1>
                <p className="mt-4 text-neutral-500 font-mono text-sm uppercase tracking-widest">
                    MANAGE LANDING PAGE TEXTS AND HERO IMAGES.
                </p>
            </header>

            <div className="border border-white p-12 bg-neutral-900/50">
                <p className="font-mono text-xl text-center italic opacity-50 uppercase tracking-widest animate-pulse">
                    CRUD INTERFACE COMING SOON...
                    <br />
                    (NEON DATABASE INTEGRATION PENDING)
                </p>
            </div>
        </div>
    );
}
