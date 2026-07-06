"use client";
 
import { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Settings,
  Bell,
  User,
  LogOut,
  ArrowRightLeft,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  
const [showNotifications, setShowNotifications] = useState(false);
  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/savings", label: "Savings", icon: Wallet },  
    { href: "/dashboard/groups", label: "Ajo Groups", icon: Users },
    { href: "/dashboard/escrow", label: "My Escrows", icon: ArrowRightLeft },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Logic to compute page title in header
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    const match = navItems.find(item => pathname.startsWith(item.href) && item.href !== "/dashboard");
    return match ? match.label : "Dashboard";
  };
  return (
    <div className="min-h-screen bg-ajobi-bg flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[280px] bg-[#FAFCFB] z-[50] border-r border-[#E8EFE8] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-[#E8EFE8]/50">
          <Link href="/dashboard" className="text-2xl font-black text-[#066B44] tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-[#066B44] text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">A</span>
            AjoBI
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-[#066B44]">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-4 py-8 flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[15px] font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#066B44] text-white shadow-lg' 
                      : 'text-gray-500 hover:text-[#066B44] hover:bg-[#F1F6F3]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#E8EFE8] pt-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-5 py-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl text-[15px] font-bold transition-all"
            >
              <LogOut className="w-5 h-5" strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-[260px] border-r border-[#E8EFE8] hidden md:flex flex-col bg-[#FAFCFB] relative z-20">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-[#E8EFE8]/50">
          <Link href="/dashboard" className="text-2xl font-black text-[#066B44] tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 bg-[#066B44] text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">A</span>
            AjoBI
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="px-4 py-8 flex-1 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map((item) => {
              // Dashboard handles exact, sub pages handle includes
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#066B44] text-white shadow-[0_4px_16px_rgba(6,107,68,0.2)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.25)] -translate-y-0.5' 
                      : 'text-gray-500 hover:text-[#066B44] hover:bg-[#F1F6F3] hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#066B44]'}`} strokeWidth={2.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#E8EFE8] pt-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-5 py-3.5 text-gray-400 hover:text-red-600 hover:bg-red-50/50 rounded-2xl text-[14px] font-bold transition-all duration-200 group"
            >
              <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-[#E8EFE8] flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-[#F1F6F3] border border-[#E8EFE8] text-[#066B44]"
             >
               <Menu className="w-5 h-5" strokeWidth={2.5} />
             </button>
             <div className="md:hidden text-xl sm:text-2xl font-black text-[#066B44] tracking-tight flex items-center gap-1">
               <span className="w-7 h-7 bg-[#066B44] text-white rounded-lg flex items-center justify-center font-black text-sm">A</span>
               <span className="hidden sm:inline">AjoBI</span>
             </div>
             <h1 className="text-[16px] sm:text-[18px] font-bold text-gray-900 tracking-tight ml-1 sm:ml-0">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#F1F6F3] border border-[#E8EFE8] text-[#066B44] hover:scale-105 transition-all shadow-sm"
  >
    <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
  </button>

  {showNotifications && (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#E8EFE8] z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
        <button
          onClick={() => setShowNotifications(false)}
          className="text-gray-400 hover:text-gray-600 text-xs font-bold"
        >
          Close
        </button>
      </div>
      <div className="p-6 text-center space-y-2">
        <div className="w-12 h-12 bg-[#F1F6F3] rounded-full flex items-center justify-center mx-auto">
          <Bell className="w-5 h-5 text-[#066B44]" />
        </div>
        <p className="text-sm font-bold text-gray-700">You're all caught up!</p>
        <p className="text-xs text-gray-400 font-medium">
          Notifications for group payments, escrow updates, and score changes will appear here.
        </p>
      </div>
    </div>
  )}
</div>
            <Link href="/dashboard/settings" className="w-10 h-10 rounded-full border-2 border-[#066B44] p-[2px] hover:scale-105 transition-transform overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 relative">
                <User className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className=" mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
