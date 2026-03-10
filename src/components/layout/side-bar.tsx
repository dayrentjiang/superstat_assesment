"use client";
import Link from "next/link";
import { Video, Users, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

export function SideBar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex-col shrink-0 ${
        isMobile ? "flex h-full" : "hidden md:flex"
      }`}
    >
      <div className="p-4 border-b border-gray-100 mb-2 mt-4 md:mt-0">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">Superstat</div>
            <div className="text-xs text-gray-500">Team</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2 pb-4">
        <div className="mb-6">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${
              pathname === "/" ||
              pathname?.startsWith("/videos") ||
              pathname === "/upload"
                ? "bg-[#ccfbf1] text-teal-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Video className="w-5 h-5" />
            Matches
          </Link>
          <Link
            href="/players"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors mt-1 ${
              pathname?.startsWith("/players")
                ? "bg-[#ccfbf1] text-teal-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            Players
          </Link>
        </div>
      </nav>
    </aside>
  );
}
