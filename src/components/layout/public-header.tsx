"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";

export function PublicHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center shadow-md">
      <Link href="/" className="flex items-center justify-center">
        <Logo />
        <span className="sr-only">HustleHub</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
        >
            About
        </Link>
        {/* Removed Features and Contact links */}
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/signup">Sign up</Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
