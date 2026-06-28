import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AjoBI",
  description: "Securely access your AjoBI account.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4FBF4] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 w-full mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
            AjoBI
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-ajobi-green transition-colors">
            Login
          </Link>
          <Link href="/onboarding" className="bg-[#00BA75] hover:bg-ajobi-green text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
            Join Now
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8EFE8] bg-transparent py-8 px-8 mt-auto">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="font-bold text-gray-900">AjoBI</span>
            <p className="text-xs text-gray-500 mt-1">
              © 2026 AjoBI. Empowering Nigeria's Informal Economy.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-ajobi-green transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Help Center</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
