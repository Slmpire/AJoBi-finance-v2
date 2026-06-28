export function Steps() {
  return (
    <section className="py-24 px-8 bg-[#EEF6EE]">
      <div className="max-w-[85%] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            3 Simple Steps to Growth
          </h2>
        </div>

        <div className="relative">
          {/* Dotted Line */}
          <div className="hidden md:block absolute top-10 left-24 right-24 border-t-2 border-dashed border-gray-300 z-0"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-ajobi-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md ring-8 ring-[#F7FBF9]">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Register
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4">
                Download the app and verify your identity in less than 2
                minutes using just your phone number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-ajobi-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md ring-8 ring-[#F7FBF9]">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Build Your Score
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4">
                Contribute to your Ajo group daily. Every Naira contributed
                increases your digital creditworthiness.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-ajobi-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md ring-8 ring-[#F7FBF9]">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Unlock Services
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4">
                Get access to escrow tools, insurance, and business
                loans at the touch of a button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
