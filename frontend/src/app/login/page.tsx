"use client";

import Link from "next/link";
import { Lock, User, Eye, ShieldCheck, Fingerprint, LockKeyhole, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLoginForm } from "@/models/auth/useLoginForm";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm();

  return (
    <div className="max-w-7xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-100">
      {/* Left Side - Green Banner */}
      <div className="md:w-6/12 bg-ajobi-green p-10 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
        {/* Background shield/logo watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 max-w-lg mx-auto w-full">
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
            Digital Trust for the Informal Economy.
          </h1>
          <p className="text-ajobi-light/80 text-sm leading-relaxed mb-10">
            Access your secure savings circle and manage your financial growth with professional-grade security.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-white/10">
              <LockKeyhole className="w-5 h-5 text-ajobi-light" />
              <span className="text-sm font-medium">Bank-grade 256-bit encryption</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-white/10">
              <ShieldCheck className="w-5 h-5 text-ajobi-light" />
              <span className="text-sm font-medium">Regulated & Secure Infrastructure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-6/12 p-8 lg:p-8 flex flex-col justify-center">
        <div className="w-full mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E0F2EB] text-[#00BA75] text-[10px] font-bold tracking-wider uppercase mb-4">
              <ShieldCheck className="w-3 h-3" /> Secure Access
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Secure Login</h2>
            <p className="text-sm text-gray-500">
              Welcome back! Please enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.root && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {errors.root.message}
              </div>
            )}
            
            {/* Email / Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`h-4 w-4 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  {...register("email")}
                  className={`block w-full pl-10 pr-4 py-3 bg-[#EEF2EF] border ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                  placeholder="e.g. squadco@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-600 font-medium pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-ajobi-green hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-4 w-4 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`block w-full pl-10 pr-11 py-3 bg-[#EEF2EF] border ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-ajobi-green'} rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-opacity-50 transition-colors`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-600 font-medium pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-ajobi-green focus:ring-ajobi-green border-gray-300 rounded transition-colors cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-xs text-gray-600 cursor-pointer">
                Remember this device
              </label>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#00BA75] hover:bg-ajobi-green transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Authenticaticating...
                  </>
                ) : (
                  <>
                    Login <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Fingerprint className="w-5 h-5 text-gray-600" />
                Sign in with Biometrics
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/onboarding" className="font-bold text-ajobi-green hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
