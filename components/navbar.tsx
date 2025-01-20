  "use client";

  import React, { useState, useEffect } from "react";
  import {
    FaHome,
    FaInfoCircle,
    FaCog,
    FaSignInAlt,
    FaSun,
    FaMoon,
  } from "react-icons/fa";
  import { Button } from "@heroui/button";
  import Link from "next/link";
  import { useTheme } from "next-themes";
  import {
    Navbar,
    NavbarContent,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
  } from "@heroui/navbar";

  // Theme Toggle Component
  const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
      <Button
        isIconOnly
        variant="light"
        onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? (
          <FaSun className="w-5 h-5" />
        ) : (
          <FaMoon className="w-5 h-5" />
        )}
      </Button>
    );
  };

  export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItemsDesktop = [
      { name: "About", href: "/about" },
      { name: "Settings", href: "/settings" },
    ];

    const menuItemsMobile = [
      { name: "Home", href: "/", icon: <FaHome /> },
      { name: "About", href: "/about", icon: <FaInfoCircle /> },
      { name: "Settings", href: "/settings", icon: <FaCog /> },
      { name: "Login", href: "/login", icon: <FaSignInAlt />, color: "primary" },
    ];

    return (
      <Navbar
        className="bg-transparent"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          {/* Mobile Menu Toggle */}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          {/* Brand Logo */}
          <NavbarBrand>
            <Link href="/">
              <p className="font-bold">WaTask</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Menu */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItemsDesktop.map((item) => (
            <NavbarItem key={item.name}>
              <Link href={item.href}>{item.name}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Login Button and Theme Toggle (Desktop) */}
        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeToggle />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-transparent">
          {menuItemsMobile.map((item) => (
            <NavbarMenuItem key={item.name}>
              <Link
                className="w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-gray-700 transition"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );
  }
