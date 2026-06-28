import Link from "next/link";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import hero from "../../../public/images/ajobi_hero.png";

export function Hero() {
  return (
    <section className="px-8 py-12 md:py-20 max-w-[85%] mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="max-w space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
          Your hustle is your <br />
          <span className="text-ajobi-green">credit history</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          AjoBI is Nigeria's first digital cooperative society, turning your
          daily trade contributions into a verifiable digital asset. Secure
          your future with the power of the community.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
          <Link
            href="/onboarding"
            className="bg-ajobi-green hover:bg-ajobi-green-dark text-white px-12 py-3 rounded-md text-base font-medium transition-all shadow-md flex items-center gap-2"
          >
            Build My AjoScore
          </Link>
          <Link
            href="/login"
            className="text-ajobi-green font-medium flex items-center gap-1 hover:underline text-sm px-4 py-3"
          >
            Login to your account <MoveRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="relative w-full flex items-center justify-end">
        <div className="rounded-[2.5rem] border-[20px] border-[#DDE4DD] overflow-hidden shadow-2xl relative w-[70%] aspect-[4/5] md:aspect-square bg-red-5">
          <Image
            src={hero}
            alt="AjoBI Hero"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover  object-top opacity-90"
            priority
          />
          {/* Credit Score Overlay */}
          <div className="absolute w-[70%] bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                YOUR LIVE AJOSCORE
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <Image
                  src={"/images/hero-mark-icon.png"}
                  alt="mark icon"
                  width={4}
                  height={4}
                  className="w-4 h-4 text-indigo-600"
                />
              </div>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-extrabold text-ajobi-green leading-none">
                842
              </span>
              <span className="text-sm font-medium text-black mb-1">
                / 900
              </span>
              <span className="ml-auto bg-ajobi-green text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Excellent Tier
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full w-[90%]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
