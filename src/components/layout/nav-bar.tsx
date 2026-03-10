import Link from "next/link";

export function NavBar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="font-semibold text-lg">
          Superstat
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          Library
        </Link>
        <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">
          Upload
        </Link>
        <Link href="/players" className="text-sm text-gray-600 hover:text-gray-900">
          Players
        </Link>
      </div>
    </nav>
  );
}
