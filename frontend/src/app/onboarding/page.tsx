"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Phone, Mail, Lock, KeyRound, ShieldCheck, Loader2 } from "lucide-react";
import { useRegistrationForm } from "@/models/auth/useRegistrationForm";

export default function OnboardingPage() {
  const { register, handleSubmit, errors, isSubmitting, isSuccess } = useRegistrationForm();

  if (isSuccess) {
    return (
      <div className="max-w-7xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-100">
        {/* Left Side - Image */}
        <div className="md:w-6/12 bg-[#0A111F] relative overflow-hidden flex flex-col justify-end p-10 text-white">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-t from-[#0A111F] via-[#0A111F]/50 to-[#0A111F]/20 absolute inset-0 z-10" />
            <Image
              src="/images/register_image.png"
              alt="Register background"
              fill
              className="object-cover opacity-40 mix-blend-luminosity"
              priority
            />
          </div>

          <div className="relative z-20 space-y-4">
            <p className="font-bold text-sm">
              Empowering the{" "}
              <span className="font-normal text-gray-300">Informal Economy</span>
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Join thousands of Nigerians building a secure financial future
              through community-driven savings and cooperative power.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="md:w-6/12 p-8 lg:p-12 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-[#E0F2EB] rounded-full flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-ajobi-green" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Check your mail
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
            We've sent a verification link to your email address. Please click the link to verify your account and continue onboarding.
          </p>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-ajobi-green hover:bg-ajobi-green-dark text-white px-10 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-100">
      {/* Left Side - Image */}
      <div className="md:w-6/12 bg-[#0A111F] relative overflow-hidden flex flex-col justify-end p-10 text-white">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-t from-[#0A111F] via-[#0A111F]/50 to-[#0A111F]/20 absolute inset-0 z-10" />
          <Image
            src="/images/register_image.png"
            alt="Register background"
            fill
            className="object-cover opacity-40 mix-blend-luminosity"
            priority
          />
        </div>

        <div className="relative z-20 space-y-4">
          <p className="font-bold text-sm">
            Empowering the{" "}
            <span className="font-normal text-gray-300">Informal Economy</span>
          </p>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Join thousands of Nigerians building a secure financial future
            through community-driven savings and cooperative power.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-6/12 p-8 lg:p-8 flex flex-col justify-center">
        <div className="w-full mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E0F2EB] text-[#00BA75] text-[10px] font-bold tracking-wider uppercase mb-4">
              <ShieldCheck className="w-3 h-3" /> Secure Registration
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h2>
            <p className="text-sm text-gray-500">
              Start your journey with AjoBI today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.root && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {errors.root.message}
              </div>
            )}
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`h-4 w-4 ${errors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  {...register("fullName")}
                  className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="text-[10px] text-red-600 font-medium pl-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className={`h-4 w-4 ${errors.phoneNumber ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.phoneNumber ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                    placeholder="+234..."
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[10px] text-red-600 font-medium pl-1">{errors.phoneNumber.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`h-4 w-4 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-600 font-medium pl-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-4 w-4 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-600 font-medium pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className={`h-4 w-4 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-600 font-medium pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#00BA75] hover:bg-ajobi-green transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating account...
                  </>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-ajobi-green hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
