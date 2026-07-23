import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  MessageCircle,
  Github,
  Instagram,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg shadow-sm">
              <Image
                src="/logo/zkr.jpg"
                alt="ZKR Estate"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span className="text-lg font-bold text-white">ZKR Estate</span>
          </div>
          <p className="text-sm text-slate-400">
            Your trusted partner in finding the perfect property. Buy, rent, and
            invest with confidence.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/properties" className="hover:text-white">
                Properties
              </Link>
            </li>
            <li>
              <Link
                href="/properties?status=FOR_SALE"
                className="hover:text-white"
              >
                Buy
              </Link>
            </li>
            <li>
              <Link
                href="/properties?status=FOR_RENT"
                className="hover:text-white"
              >
                Rent
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                About us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white">
                Agents
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-500" />
              123 Real Estate Blvd
            </li>

            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-500" />
              +212 657-516301
            </li>

            <li>
              <a
                href="mailto:zr7791474@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria,%0A%0AI%20would%20like%20to%20contact%20you%20regarding..."
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-brand-500" />
                zr7791474@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <h5 className="mb-3 text-sm font-semibold text-white">
              Follow Us
            </h5>

            <div className="flex gap-3">
              <a
                href="https://x.com/zkr_ad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-all duration-200 hover:bg-brand-600 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>

              <a
                href="https://instagram.com/zkr_ad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-all duration-200 hover:bg-pink-600 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://wa.me/212657516301"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-all duration-200 hover:bg-green-600 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/zr7791474-blip"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} ZKR Estate. All rights reserved.</p>
          <p>Built with Next.js, Prisma & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}