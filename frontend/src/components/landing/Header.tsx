import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center max-w-[85%] justify-between px-8 py-6 w-full mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-ajobi-green tracking-tight">
          AjoBI
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link
          href="#about"
          className="text-ajobi-green border-b-2 border-ajobi-green pb-1"
        >
          About
        </Link>
        <Link
          href="#features"
          className="hover:text-ajobi-green transition-colors"
        >
          Features
        </Link>

      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-600 hover:text-ajobi-green transition-colors hidden sm:block"
        >
          Login
        </Link>
        <Link
          href="/onboarding"
          className="bg-ajobi-green hover:bg-ajobi-green-dark text-white px-8 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
