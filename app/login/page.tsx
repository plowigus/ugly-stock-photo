"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Compass, Key, User as UserIcon } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("AUTHENTICATION_FAILED: INVALID_KEY");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-mono selection:bg-white selection:text-black">
            {/* Main Stage */}
            <div className="w-full max-w-[440px] flex flex-col gap-12">

                {/* Header Section */}
                <header className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="bg-white text-black px-3 py-1 font-black text-xs tracking-tighter uppercase">
                            Secure Ingress
                        </div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
                            Status: Active
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none italic">
                            System Access
                        </h1>
                        <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                            Level 4 - Administrator Privileges
                        </p>
                    </div>
                </header>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                    <div className="space-y-8">
                        {/* Identifier Field */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                <UserIcon size={12} strokeWidth={3} />
                                Identifier
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border-2 border-neutral-800 p-5 outline-none focus:border-white transition-all uppercase text-sm font-bold tracking-widest placeholder:text-neutral-900"
                                placeholder="ENTER_ID"
                                required
                            />
                        </div>

                        {/* Security Key Field */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                <Key size={12} strokeWidth={3} />
                                Security Key
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border-2 border-neutral-800 p-5 outline-none focus:border-white transition-all text-lg tracking-[0.2em]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-600 text-white p-4 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-6 text-sm font-black uppercase tracking-[0.4em] hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Compass className="animate-spin" size={18} />
                                Verifying...
                            </>
                        ) : (
                            "Initialize"
                        )}
                    </button>
                </form>

                {/* Footer Meta */}
                <footer className="pt-8 border-t border-neutral-900 flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-neutral-600">
                    <div className="flex gap-4">
                        <span>Terminal_01</span>
                        <span>Node_PL_04</span>
                    </div>
                    <div className="flex items-center gap-2 italic">
                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                        OS V.4.0
                    </div>
                </footer>
            </div>

            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
}
