import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect as nextRedirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

const ALLOWED_EMAILS = [
    "admin@uglystock.com", // Fallback for dev
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2
].filter((email): email is string => Boolean(email));

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email || !ALLOWED_EMAILS.includes(email)) {
        nextRedirect("/login");
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
