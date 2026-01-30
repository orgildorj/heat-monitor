"use client";

import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md border-b border-gray-400">
            <div className=" mx-auto container px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Left: Logo */}
                    <div className="shrink-0">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            Heizungsüberwachung
                        </Link>
                    </div>

                    {/* Right: Settings / Menu */}
                    <div className="flex items-center space-x-4">
                        <Link href="/settings">
                            <button
                                onClick={() => console.log("Einstellungen clicked")}
                                className="flex items-center px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Cog6ToothIcon className="h-5 w-5 mr-1 text-gray-700" />
                                <span className="text-gray-700 text-sm font-medium">Einstellungen</span>
                            </button>
                        </Link>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden px-2 py-1 rounded hover:bg-gray-100"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg
                                className="h-6 w-6 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Optional mobile menu */}
                {menuOpen && (
                    <div className="md:hidden mt-2 space-y-2">
                        <Link href="/settings">
                            <button className="flex items-center px-3 py-2 w-full rounded hover:bg-gray-100">
                                <Cog6ToothIcon className="h-5 w-5 mr-1 text-gray-700" />
                                Einstellungen
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
