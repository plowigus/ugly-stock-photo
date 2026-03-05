"use server";

import { db } from "./db";
import { works } from "./schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type WorkItem = typeof works.$inferSelect;
export type NewWorkItem = typeof works.$inferInsert;

export async function getWorks() {
    try {
        return await db.select().from(works).orderBy(asc(works.orderIndex), desc(works.createdAt));
    } catch (error) {
        console.error("Failed to fetch works:", error);
        return [];
    }
}

export async function addWork(data: NewWorkItem) {
    try {
        const result = await db.insert(works).values(data).returning();
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true, data: result[0] };
    } catch (error) {
        console.error("Failed to add work:", error);
        return { success: false, error: "Failed to add project" };
    }
}

export async function updateWork(id: number, data: Partial<NewWorkItem>) {
    try {
        const result = await db.update(works).set(data).where(eq(works.id, id)).returning();
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true, data: result[0] };
    } catch (error) {
        console.error("Failed to update work:", error);
        return { success: false, error: "Failed to update project" };
    }
}

export async function deleteWork(id: number) {
    try {
        await db.delete(works).where(eq(works.id, id));
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete work:", error);
        return { success: false, error: "Failed to delete project" };
    }
}


export async function seedWorks() {
    try {
        const existing = await db.select().from(works).limit(1);
        if (existing.length > 0) {
            return { success: true, skipped: true };
        }

        const seedData: NewWorkItem[] = [
            {
                title: "HIROSZYMA",
                type: "EXPERIMENTAL",
                year: "2026",
                src: "/1.jpg",
                images: ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg"],
                imagesAlt: [
                    "HIROSZYMA — COVER",
                    "HIROSZYMA — FRAME 02",
                    "HIROSZYMA — FRAME 03",
                    "HIROSZYMA — FRAME 04",
                    "HIROSZYMA — FRAME 05",
                ],
            },
            {
                title: "MOSHPIT 01",
                type: "CONCERT",
                year: "2024",
                src: "/3.jpg",
                srcAlt: "/4.jpg",
            },
            {
                title: "DECAY 04",
                type: "URBAN",
                year: "2023",
                src: "/5.jpg",
            },
            {
                title: "NOISE 09",
                type: "PORTRAIT",
                year: "2024",
                src: "https://images.unsplash.com/photo-1715759406117-76aeee4281a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncml0dHklMjB1cmJhbiUyMHRleHR1cmUlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDF8fHx8MTc3MjU1NTczNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            },
            {
                title: "STATIC 02",
                type: "ABSTRACT",
                year: "2023",
                src: "https://images.unsplash.com/photo-1730508378933-b9f0607cebfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkY29yZSUyMHB1bmslMjBjb25jZXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZSUyMGhpZ2glMjBjb250cmFzdHxlbnwxfHx8fDE3NzI1NTU3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                srcAlt: "https://images.unsplash.com/photo-1616797147704-7df2e256d397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmVzc2VkJTIwcG9ydHJhaXQlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwZWRneXxlbnwxfHx8fDE3NzI1NTU3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                venue: "KLUB ZAŚCIANEK",
                city: "KRAKÓW",
                organizer: "DANICING SHOES GIGS",
                orderIndex: 4,
            },
        ];

        await db.insert(works).values(seedData);
        revalidatePath("/admin/work");
        revalidatePath("/");

        return { success: true, inserted: seedData.length };
    } catch (error) {
        console.error("Failed to seed works:", error);
        return { success: false, error: "Failed to seed works" };
    }
}
