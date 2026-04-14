"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Hand } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#06060a]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-[260px] lg:shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#06060a]/80 px-4 backdrop-blur-md lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:bg-white/[0.05] hover:text-white"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[260px] border-r-white/[0.06] bg-[#0a0a0f] p-0"
            >
              <AdminSidebar onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
              <Hand className="h-4 w-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              SignFlow
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
