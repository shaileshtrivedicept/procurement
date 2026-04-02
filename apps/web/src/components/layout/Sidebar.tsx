'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Vendors', href: '/dashboard/vendors' },
    { name: 'Purchase Requisitions', href: '/dashboard/purchase-requisitions' },
    { name: 'Approval Inbox', href: '/dashboard/approvals' },
    { name: 'Audit Logs', href: '/dashboard/audit-logs' },
    { name: 'Rules Engine', href: '/dashboard/rules-engine' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8">Procurement ERP</div>
      <nav className="flex-1">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`block py-2 px-4 rounded mb-2 hover:bg-gray-700 transition-colors ${
              pathname === link.href ? 'bg-gray-700' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <Link href="/auth/login" className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
