"use client";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo or Brand */}
        <div className="text-xl font-bold">
          <Link href="/">DCS Leave Management System</Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/user" className="text-gray-700 hover:text-blue-600">
            User
          </Link>
          <Link href="/apply" className="text-gray-700 hover:text-blue-600">
            Apply
          </Link>
          <Link href="/table" className="text-gray-700 hover:text-blue-600">
            Status
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden text-gray-700 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/user"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              User
            </Link>
            <Link
              href="/apply"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Apply
            </Link>
            <Link
              href="/status"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Status
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
