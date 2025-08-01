'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary-brand text-white p-4 flex items-center justify-between">
      {/* Desktop Navigation */}
      <ul className="hidden sm:flex sm:flex-row justify-start space-x-4">
        <li>
          <Link href="/" className={`hover:underline ${pathname === "/" ? "font-bold" : ""}`}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/gallery" className="hover:underline">
            Gallery
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/events" className="hover:underline">
            Events
          </Link>
        </li>
      </ul>

      {/* Mobile Navigation */}
      <div className="sm:hidden ml-auto">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:text-[#043933]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-primary-brand text-white border-r border-gray-700">
            <nav className="flex flex-col space-y-4 pt-8">
              <Link
                href="/"
                className={`text-lg font-medium hover:underline ${pathname === "/" ? "font-bold" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/gallery"
                className="text-lg font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/events"
                className="text-lg font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
