import Link from "next/link";
import { Globe, MessageSquareText, Share, ThumbsUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white pt-16 pb-8 px-8">
      <div className="max-w-[90%] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 space-y-4">
            <span className="text-2xl font-bold text-ajobi-green tracking-tight">
              AjoBI
            </span>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Providing digital trust for the informal economy across Africa.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-xs tracking-wider uppercase text-gray-900 mb-4">
              Company
            </h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs tracking-wider uppercase text-gray-900 mb-4">
              Product
            </h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Group Savings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs tracking-wider uppercase text-gray-900 mb-4">
              Legal
            </h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-ajobi-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
          <p className="text-xs text-black">
            © 2026 AjoBI Technologies. Digital Trust for the Informal Economy.
          </p>
          <div className="flex items-center gap-4 text-black">
            <Globe className="w-4 h-4 hover:text-gray-600 cursor-pointer transition-colors" />
            <ThumbsUp className="w-4 h-4 hover:text-gray-600 cursor-pointer transition-colors" />
            <MessageSquareText className="w-4 h-4 hover:text-gray-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
