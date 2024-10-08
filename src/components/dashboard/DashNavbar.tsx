"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current path is '/' or starts with '/auth'
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return null; // Do not render the Sidebar
  }

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST", // Ensure that the method is POST
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const data = await response.json();
      console.log(data.message);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Appointments", href: "/dashboard/appointments" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "User", href: "/dashboard/user" },
    { name: "Service", href: "/dashboard/service" },
  ];

  return (
    <div>
      <div className="w-full h-20 bg-gray-900 text-white drop-shadow-md flex justify-between px-5 items-center">
        <div className="w-full flex justify-start px-5 items-center">
          <div className="p-4 ">
            {/* Logo */}
            Logo
          </div>
          <div className="p-4 hidden md:block">
            <ul className="flex ">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-4 ${pathname === item.href ? "font-bold text-yellow-600" : ""
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden md:block">
          <button onClick={logout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
