import { ChevronRight } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 px-8 mx-4 lg:mx-auto mb-20">
      <div className="max-w-[90%] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 max-w-sm">
            Trusted by thousands of entrepreneurs
          </h2>

          <div className="hidden sm:flex gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-white hover:border-gray-400 transition-all">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-white hover:border-gray-400 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                AO
              </div>

              <div>
                <h4 className="font-bold text-gray-900">Amina Okafor</h4>
                <p className="text-xs font-bold tracking-wider text-ajobi-green uppercase">
                  Market Trader
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              "AjoBI changed how I save. I no longer carry cash everywhere,
              and my AjoScore helped me get a loan to expand my stall into a
              small shop."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                KE
              </div>

              <div>
                <h4 className="font-bold text-gray-900">Kehinde Eze</h4>
                <p className="text-xs font-bold tracking-wider text-ajobi-green uppercase">
                  Artisan
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              "Digital transparency is everything. My group now trusts every
              transaction because we see it live on AjoBI. No more missing
              funds."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                TO
              </div>

              <div>
                <h4 className="font-bold text-gray-900">Tolu Ogunleye</h4>
                <p className="text-xs font-bold tracking-wider text-ajobi-green uppercase">
                  Electrician
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              "The Escrow feature on AjoBI has connected me with more
              clients than I ever thought possible. It's truly a
              business-in-a-pocket."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}