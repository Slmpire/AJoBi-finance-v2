import { Users, Shield, TrendingUp } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-20 px-8 bg-[#F7FBF9]">
      <div className="max-w-[85%] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 inline-block relative">
            Why join the AjoBI Community?
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-ajobi-green rounded-full"></div>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-ajobi-light flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-ajobi-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Group Savings (Ajo)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Digitize your traditional rotatory savings with automatic
              record keeping and secure fund disbursement.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-ajobi-light flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-ajobi-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Work Safely
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Protect your income with community-backed insurance and secure
              transaction verification for every hustle.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-ajobi-light flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-ajobi-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Access Credit
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Use your transaction history to unlock low-interest
              micro-loans specifically designed for informal entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
