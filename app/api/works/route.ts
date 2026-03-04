import { NextResponse } from "next/server";
import { getWorks } from "@/lib/actions";

export async function GET() {
    try {
        const works = await getWorks();
        return NextResponse.json({ data: works });
    } catch (error) {
        console.error("Failed to fetch works via API:", error);
        return NextResponse.json(
            { error: "Failed to fetch works" },
            { status: 500 }
        );
    }
}

