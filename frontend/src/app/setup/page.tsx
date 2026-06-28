"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import ProgressBar from "./parts/ProgressBar";
import ProfileStep from "./parts/ProfileStep";
import WorkStep from "./parts/WorkStep";
import SavingsStep from "./parts/SavingsStep";
import CreditStep from "./parts/CreditStep";
import FinalStep from "./parts/FinalStep";
import ScoreRevealStep from "./parts/ScoreRevealStep";
import { useSetupWizard } from "./model/useSetupWizard";

export default function SetupWizard() {
  const {
    currentStep,
    formData,
    isSubmitting,
    error,
    updateForm,
    toggleArrayItem,
    nextStep,
    prevStep,
    submitStep,
    isLoadingProgress,
    scoreData,
  } = useSetupWizard();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProfileStep formData={formData} updateForm={updateForm} submitStep={submitStep} isSubmitting={isSubmitting} error={error} />;
      case 2:
        return <WorkStep formData={formData} updateForm={updateForm} submitStep={submitStep} prevStep={prevStep} isSubmitting={isSubmitting} error={error} />;
      case 3:
        return <SavingsStep formData={formData} updateForm={updateForm} toggleArrayItem={toggleArrayItem} submitStep={submitStep} prevStep={prevStep} isSubmitting={isSubmitting} error={error} />;
      case 4:
        return <CreditStep formData={formData} updateForm={updateForm} submitStep={submitStep} prevStep={prevStep} isSubmitting={isSubmitting} error={error} />;
      case 5:
        return <FinalStep formData={formData} updateForm={updateForm} submitStep={submitStep} prevStep={prevStep} isSubmitting={isSubmitting} error={error} />;
      case 6:
        return <ScoreRevealStep scoreData={scoreData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBF4] flex flex-col relative overflow-hidden">
      {/* Background Money Overlay matching design */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-left opacity-[0.04] mix-blend-multiply z-0 pointer-events-none" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 w-full mx-auto relative z-20">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-ajobi-green tracking-tight">
            AjoBI
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-500">
          <span className="cursor-pointer hover:text-gray-900 transition-colors">How it Works</span>
          <span className="cursor-pointer hover:text-gray-900 transition-colors">Benefits</span>
          <span className="cursor-pointer hover:text-gray-900 transition-colors">Security</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-ajobi-green hover:underline transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/onboarding" className="bg-ajobi-green hover:bg-ajobi-green-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
            Join Now
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col items-center justify-center p-4 relative z-10 py-12 ${currentStep === 6 ? 'max-w-5xl mx-auto w-full' : ''}`}>
        {isLoadingProgress ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 text-ajobi-green animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500">Loading your progress...</p>
          </div>
        ) : (
          <>
            {currentStep <= 5 && <ProgressBar currentStep={currentStep} />}

            {currentStep <= 5 ? (
              <div className="max-w-[32rem] w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-gray-100">
                {renderStepContent()}
              </div>
            ) : (
              <div className="w-full">
                {renderStepContent()}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm py-8 px-8 mt-auto relative z-10 border-t border-[#E8EFE8]">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl">
          <div className="flex items-center gap-4">
            <span className="font-bold text-ajobi-green text-xl">AjoBI</span>
            <p className="text-[11px] text-gray-500 mt-1">
              © 2026 . Empowering Nigeria's Informal Economy.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-[11px] font-medium text-gray-500">
            <Link href="#" className="hover:text-ajobi-green transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Help Center</Link>
            <Link href="#" className="hover:text-ajobi-green transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
