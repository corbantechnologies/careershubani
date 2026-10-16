import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-black text-white text-xs font-semibold tracking-wider">
            H
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-black leading-none">
              HUBANI
            </span>
            <span className="text-xs font-normal text-neutral-500 tracking-wide uppercase">
              Careers
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 hover:text-black transition-colors"
          >
            Open Roles
          </Link>
          <a
            href="https://hubani.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-neutral-500 hover:text-black transition-colors flex items-center gap-1"
          >
            hubani.org
            <span className="text-xs" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
