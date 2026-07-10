import { Shield, Users, TrendingUp, Zap } from "lucide-react";

export function Testimonials() {
  const stats = [
    { value: "₦0", label: "Collector fees", sub: "No middleman taking a cut" },
    { value: "100%", label: "Transparent", sub: "Every member sees every payment" },
    { value: "200+", label: "Years of tradition", sub: "Ajo/Esusu — now digitized" },
    { value: "5 min", label: "To get started", sub: "From sign up to first group" },
  ];

  const reasons = [
    {
      icon: Shield,
      title: "Trust built into the system",
      body: "No human collector holds your money. Funds are held in escrow and released automatically when conditions are met.",
    },
    {
      icon: Users,
      title: "Save with anyone, anywhere",
      body: "Your group doesn't have to be on the same street. Lagos to London, the platform handles collection and payout automatically.",
    },
    {
      icon: TrendingUp,
      title: "Your behaviour builds your credit",
      body: "Every contribution, every completed goal, every on-time payment builds your AjoScore — a financial identity you actually own.",
    },
    {
      icon: Zap,
      title: "Powered by real payment infrastructure",
      body: "Built on Nomba's banking APIs. Real account numbers, real transfers, real escrow — not a mock-up.",
    },
  ];

  return (
    <section className="py-20 px-8 mx-4 lg:mx-auto mb-20">
      <div className="max-w-[90%] mx-auto space-y-20">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm text-center">
              <p className="text-4xl font-black text-[#066B44] mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-gray-900">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Why AjoBI */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 max-w-sm">
            Why people choose AjoBI
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm flex gap-5">
                  <div className="w-12 h-12 bg-[#F1F6F3] rounded-2xl flex items-center justify-center text-[#066B44] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{reason.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{reason.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="bg-[#066B44] rounded-3xl p-10 text-center text-white">
          <p className="text-2xl font-black mb-3">Built for the Nigerian hustle.</p>
          <p className="text-[#86EFAC] font-medium max-w-xl mx-auto">
            We didn't build AjoBI to win a hackathon. We built it because 40 million Nigerians save informally every day with zero protection — and that needs to change.
          </p>
        </div>

      </div>
    </section>
  );
}