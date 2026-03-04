"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

export function UploadTest() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 p-12 bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-none">
            <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">RAW UPLOAD</h3>
                <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                    Test the ingestion pipeline. No technical shapes allowed.
                </p>
            </div>

            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("UPLOAD SUCCESSFUL - RAW CONTENT INGESTED");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`UPLOAD FAILED: ${error.message}`);
                }}
                appearance={{
                    container: "border-neutral-800 bg-black w-full max-w-md h-64 hover:border-white transition-colors cursor-crosshair",
                    label: "text-white font-mono uppercase tracking-widest text-sm",
                    allowedContent: "text-neutral-500 font-mono text-[10px] uppercase",
                    button: "bg-white text-black font-black uppercase tracking-tighter px-8 py-2 rounded-none hover:bg-neutral-200 transition-colors after:content-none",
                }}
            />

            <div className="flex flex-col items-center gap-4">
                <span className="font-mono text-[10px] text-neutral-600 uppercase">Or use the quick button</span>
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                    }}
                    onUploadError={(error: Error) => {
                        alert(`UPLOAD FAILED: ${error.message}`);
                    }}
                    appearance={{
                        button: "bg-white text-black font-black uppercase tracking-tighter px-8 py-2 rounded-none hover:bg-neutral-200 transition-colors after:content-none",
                        allowedContent: "hidden",
                        container: "w-auto",
                    }}
                />
            </div>
        </div>
    );
}
