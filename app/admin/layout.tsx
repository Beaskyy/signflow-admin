import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: "SignFlow Admin Dashboard",
  description: "Admin dashboard for managing the SignFlow sign language translation platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}
