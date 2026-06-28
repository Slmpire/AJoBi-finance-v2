"use client";

import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAppDispatch } from "@/store";
import { registerUser } from "@/store/slices/authSlice";


export const registrationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[789][01]\d{8}$/, "Must be a valid Nigerian phone number"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .notRequired(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export interface RegistrationFormValues {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export const useRegistrationForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: yupResolver(registrationSchema) as any,
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    try {
      const response = await dispatch(registerUser(data)).unwrap();
      console.log("Registration successful:", response);
      
      setIsSuccess(true);
      
      if (response.data.onboarding_complete === "false" || response.data.onboarding_complete === false) {
        router.push("/setup");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration process aborted", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (isAxiosError(error) && error.response?.data?.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message || errorMessage;
        
        if (apiError.code === "PHONE_EXISTS") {
          setError("phoneNumber", {
            type: "server",
            message: errorMessage,
          });
          return;
        } else if (apiError.code === "VALIDATION_ERROR") {
          // If the message specifically mentions phone number
          if (errorMessage.toLowerCase().includes("phone")) {
             setError("phoneNumber", {
               type: "server",
               message: errorMessage,
             });
             return;
          }
        }
      }

      // Set a form-level error to be displayed in the UI
      setError("root", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isSuccess,
  };
};
