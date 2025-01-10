import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Package,
  PackageSearch,
  Tag,
} from "lucide-react";

export const AdminSidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-blue-600 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">eProduct</h2>
      </div>
      
      <nav className="space-y-2 flex-1">
        <SidebarLink icon={<LayoutDashboard />} href="/admin" label="Dashboard" />
        <SidebarLink icon={<ShoppingCart />} href="/admin/orders" label="Order" />
        <SidebarLink icon={<BarChart3 />} href="/admin/statistics" label="Statistic" />
        <SidebarLink icon={<Package />} href="/admin/products" label="Product" />
        <SidebarLink icon={<PackageSearch />} href="/admin/stock" label="Stock" />
        <SidebarLink icon={<Tag />} href="/admin/offers" label="Offer" />
      </nav>

      <div className="pt-4 border-t border-white/20 mt-auto">
        <div className="flex gap-4">
          <Link to="#" className="text-white/60 hover:text-white">Facebook</Link>
          <Link to="#" className="text-white/60 hover:text-white">Twitter</Link>
          <Link to="#" className="text-white/60 hover:text-white">Google</Link>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) => {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 text-white/80 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};