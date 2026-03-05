import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    title: text("title"),
    description: text("description"),
    isApproved: boolean("is_approved").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const works = pgTable("works", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    year: text("year").notNull(),
    src: text("src").notNull(),
    srcAlt: text("src_alt"),
    venue: text("venue"),
    city: text("city"),
    organizer: text("organizer"),
    images: text("images").array().default([]), // Using text array for images
    imagesAlt: text("images_alt").array().default([]), // Alt SEO per image
    orderIndex: integer("order_index").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
