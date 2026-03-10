"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SideBar } from "@/components/layout/side-bar";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col relative z-50">
        <div className="bg-[#1a1c29] text-white text-sm py-2 flex justify-center items-center gap-2">
          You're viewing a read-only demo{" "}
          <span className="bg-[#18e89d] text-black px-3 py-1 rounded-full text-xs font-semibold">
            Sign up
          </span>
        </div>
        <nav className="bg-[#18e89d] text-black h-16 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 -ml-1 hover:bg-black/10 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 cursor-pointer" />
              ) : (
                <Menu className="h-6 w-6 cursor-pointer" />
              )}
            </button>
            <Menu className="h-6 w-6 cursor-pointer hidden md:block" />
            <Link href="/" className="font-extrabold text-2xl tracking-tight">
              superstat
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/upload"
              className="px-4 py-1.5 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-sm transition-colors"
            >
              Upload Video
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden flex"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-64 bg-white h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-26">
              {" "}
              {/* Offset for the double top bar */}
              <SideBar isMobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
