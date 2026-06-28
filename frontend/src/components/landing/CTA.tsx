import Link from "next/link";

export function CTA() {
  return (
    <section className="px-4 mb-20 max-w-[90%] mx-auto">
      <div className="bg-gradient-to-br from-[#1E2923] to-[#0D1510] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-ajobi-green rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-ajobi-green-dark rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Ready to make your hustle count?
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            Join over 50,000 entrepreneurs building their digital future
            with AjoBI. Your journey to financial freedom starts today.
          </p>
          <div className="pt-6">
            <Link
              href="/onboarding"
              className="inline-block bg-ajobi-green-dark hover:bg-ajobi-green text-black font-bold px-16 py-4 rounded-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Join AjoBI Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
