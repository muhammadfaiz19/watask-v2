"use client";

import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";

import { useAuth } from "@/context/AuthContext";

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
      {resolvedTheme === "dark" ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
    </Button>
  );
};

export default function NavbarComponent() {
  const { isLoggedIn, username, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItemsDesktop = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <Navbar className="bg-transparent" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold">WaTask</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItemsDesktop.map((item) => (
          <NavbarItem key={item.name}>
            <Link href={item.href}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="items-center gap-2 md:gap-4" justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        {isLoggedIn && username ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button startContent={<FaUserCircle className="w-6 h-6" />} variant="ghost">
                  {username}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Menu">
                <DropdownItem key="profile" onPress={() => router.push("/profile")}>
                  My Profile
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden lg:flex">
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-transparent">
        {menuItemsDesktop.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-gray-700 transition"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {!isLoggedIn && (
          <NavbarMenuItem>
            <Link
              className="w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-gray-700 transition"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
