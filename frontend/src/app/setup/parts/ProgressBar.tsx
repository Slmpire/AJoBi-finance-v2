"use client";

import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Work" },
    { id: 3, name: "Savings" },
    { id: 4, name: "Credit" },
    { id: 5, name: "Final" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-10 relative z-10 px-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                  isActive || isCompleted 
                    ? 'bg-ajobi-green text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`absolute -bottom-6 text-[9px] sm:text-[10px] font-bold ${isActive || isCompleted ? 'text-ajobi-green' : 'text-gray-400'}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-10 sm:w-16 md:w-24 h-[2px] transition-colors ${isCompleted ? 'bg-ajobi-green' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
