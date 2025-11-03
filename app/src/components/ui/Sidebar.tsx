// src/components/ui/Sidebar.tsx
import Link from "next/link";

interface SidebarProps {
  items: { label: string; href: string }[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  return (
    <div className="w-64 bg-gray-50 h-screen p-4 border-r">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-100 font-medium"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
