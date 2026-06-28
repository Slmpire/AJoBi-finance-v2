import { useState, useEffect } from "react";
import { setupService, SetupFinalResponse } from "@/services/setupService";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

export interface SetupFormData {
  profileType: string;
  workDuration: string;
  state: string;
  lga: string;
  incomeRange: string;
  inAjoGroup: string;
  saveMethods: string[];
  saveFrequency?: string; // For backward compatibility if used, otherwise remove
  contributionConsistency: string;
  borrowedMoney: string;
  paidBackFully: string;
  paidOnTime: string;
  language: string;
}

export const useSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [scoreData, setScoreData] = useState<SetupFinalResponse['data'] | null>(null);
  const authUser = useAppSelector((state) => state.auth.user);
  let user = authUser;

  if (!user && typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }

  const userId = user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  const email = user?.email;
  console.log("email", email)
  console.log("user", user)

  const [formData, setFormData] = useState<SetupFormData>({
    profileType: "",
    workDuration: "",
    state: "",
    lga: "",
    incomeRange: "",
    inAjoGroup: "",
    saveMethods: [],
    contributionConsistency: "Always on time",
    borrowedMoney: "",
    paidBackFully: "",
    paidOnTime: "",
    language: "",
  });

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key as keyof SetupFormData]: value }));
  };

  const toggleArrayItem = (key: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[key as keyof SetupFormData] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((i) => i !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await setupService.getProgress(email);
        console.log("res", res)
        if (res.data.onboarding_complete) {
          // setCurrentStep(6);
          router.push("/dashboard");
        } else if (res.data.current_step) {
          setCurrentStep(res.data.current_step);
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setIsLoadingProgress(false);
      }
    };
    loadProgress();
  }, []);

  const mapIncome = (range: string) => {
    if (range === "Below ₦5k") return "below 5000";
    if (range === "₦5k-₦20k") return "5000-20000";
    if (range === "₦20k-₦50k") return "20000-50000";
    if (range === "₦50k-₦100k") return "50000-100000";
    return "above 100000";
  };

  const mapDuration = (duration: string) => {
    if (duration === "Less than 1 year") return "less than 1 year";
    if (duration === "More than 5 years") return "5+ years";
    return duration;
  };

  const mapSavingsMethod = (method: string) => {
    if (method === "Cash in a box at home") return "Cash at home";
    if (method === "Traditional bank account") return "Bank";
    if (method === "Community group (Ajo)") return "Ajo/Esusu group";
    if (method === "Mobile Money (Opay/PalmPay)") return "Mobile money";
    return method;
  };

  const submitStep = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (currentStep === 1) {
        await setupService.submitStep1({ occupation: formData.profileType, email: email });
        nextStep();
      } else if (currentStep === 2) {
        await setupService.submitStep2({
          trade_duration: mapDuration(formData.workDuration),
          state: formData.state,
          lga: formData.lga,
          income_range: mapIncome(formData.incomeRange),
          email: email
        });
        nextStep();
      } else if (currentStep === 3) {
        await setupService.submitStep3({
          saves_money: formData.saveMethods.length > 0,
          savings_methods: formData.saveMethods.map(mapSavingsMethod),
          in_ajo_group: formData.inAjoGroup === "Yes",
          contribution_consistency: formData.contributionConsistency,
          email: email
        });
        nextStep();
      } else if (currentStep === 4) {
        await setupService.submitStep4({
          has_borrowed: formData.borrowedMoney === "Yes",
          repaid_fully: formData.paidBackFully === "Yes",
          repaid_on_time: formData.paidOnTime === "Yes",
          email: email
        });
        nextStep();
      } else if (currentStep === 5) {
        const res = await setupService.submitStep5({
          language: formData.language,
          profile_photo: null,
          email: email
        });
        setScoreData(res.data);
        nextStep();
      }
    } catch (err: any) {
      console.error(`Failed to save step ${currentStep}:`, err);
      let errorMessage = "An error occurred during submission. Please try again.";
      
      if (err.name === 'ApiError') {
        if (err.data?.error?.message) {
          errorMessage = err.data.error.message;
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    isLoadingProgress,
    scoreData,
    error,
    updateForm,
    toggleArrayItem,
    nextStep,
    prevStep,
    submitStep,
  };
};
