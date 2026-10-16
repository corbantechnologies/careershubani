import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-8 mt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-white text-[10px] font-semibold">
                H
              </span>
              <span className="text-sm font-semibold tracking-tight text-black">
                Hubani Limited
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Agile parent holding corporation operating across cinematic music
              publishing, advanced data telemetry systems, and global tournament
              administration (BOTYA league).
            </p>
            <p className="text-xs text-neutral-500">
              Operational Base: Mombasa, Kenya &amp; Global Remote Workspaces.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-700">
              <Link href="/" className="hover:text-black transition-colors">
                Open Positions
              </Link>
              <a
                href="mailto:careers@hubani.org"
                className="hover:text-black transition-colors"
              >
                careers@hubani.org
              </a>
              <a
                href="https://hubani.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                hubani.org
              </a>
            </div>
            <p className="text-xs text-neutral-500 pt-2">
              Equal Opportunity Employer. Potential and dedication above formal titles.
            </p>
            <p className="text-xs text-neutral-400">
              © 2026 Hubani Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
