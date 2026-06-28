import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { groupsService } from "@/services/groupsService";
import { RootState, useAppSelector } from "@/store";

export interface CreateGroupFormData {
  name: string;
  amount: string;
  frequency: "Weekly" | "Monthly";
  maxMembers: number;
  minScore: number;
  rotationOrder: "Random Draw" | "Fixed Order";
  gracePeriod: "24 Hours" | "48 Hours";
  description: string;
}

export const useCreateGroup = () => {
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userId = user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    amount: "50000",
    frequency: "Weekly",
    maxMembers: 12,
    minScore: 650,
    rotationOrder: "Random Draw",
    gracePeriod: "48 Hours",
    description: ""
  });

  const updateField = <K extends keyof CreateGroupFormData>(
    field: K,
    value: CreateGroupFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const targetPayout = useMemo(() => {
    const rawAmount = parseFloat(formData.amount.replace(/,/g, "")) || 0;
    return rawAmount * formData.maxMembers;
  }, [formData.amount, formData.maxMembers]);

  const cycleDuration = useMemo(() => {
    return `${formData.maxMembers} ${formData.frequency === "Weekly" ? "Weeks" : "Months"}`;
  }, [formData.maxMembers, formData.frequency]);

  const formattedContribution = useMemo(() => {
    const rawAmount = parseFloat(formData.amount.replace(/,/g, "")) || 0;
    return `₦${rawAmount.toLocaleString()}/${formData.frequency === "Weekly" ? "wk" : "mo"}`;
  }, [formData.amount, formData.frequency]);

   const handleSubmit = async () => {
     setIsSubmitting(true);
     setError(null);
     try {
       // Mapped variables to match STAGE 4 backend payload guidelines
       const payload = {
         user_id: userId,
         name: formData.name,
         contribution_amount: parseFloat(formData.amount.replace(/,/g, "")),
         frequency: formData.frequency.toLowerCase() as 'weekly' | 'monthly',
         max_members: formData.maxMembers,
         // Mapped from 400-1000 UI range down to the requested backend 40-100 format
         min_ajo_score: Math.round(formData.minScore / 10),
         rotation_type: formData.rotationOrder === 'Random Draw' ? 'random' : 'manual' as 'random' | 'manual',
         grace_period_hours: formData.gracePeriod === '24 Hours' ? 24 : 48 as 24 | 48,
         description: formData.description
       };
 
       const response = await groupsService.createGroup(payload);
       console.log("group creation response", response);
       
       if (response.success && response.data?.group_id) {
         // Automatically generate group virtual account immediately after creation
         try {
           await groupsService.createGroupVirtualAccount(response.data.group_id);
           console.log("Group virtual account generated successfully");
         } catch (vaError) {
           console.error("Failed to generate group virtual account", vaError);
         }
         
         router.push(`/dashboard/groups/${response.data.group_id}`);
       } else {
         setError(response.message || "Failed to create group. Please check your inputs.");
       }
 
     } catch (err: any) {
       console.error("Group creation error:", err);
       setError(err.message || "An unexpected error occurred while creating the group.");
     } finally {
       setIsSubmitting(false);
     }
   };

  return {
    formData,
    updateField,
    targetPayout,
    cycleDuration,
    formattedContribution,
    isSubmitting,
    error,
    handleSubmit
  };
};
