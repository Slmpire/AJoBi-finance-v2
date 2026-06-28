"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savingsService } from "@/services/savingsService";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function CreateSavingsGoalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    deadline: "",
    frequency: "monthly"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline,
        frequency: formData.frequency
      };
      
      const response = await savingsService.createGoal(payload);
      if (response.success || response.status) {
        router.push("/dashboard/savings");
      } else {
        setError(response.message || "Failed to create savings goal");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/savings" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Savings Goal</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Goal Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rent, Vacation, New Laptop"
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ajobi-green focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Target Amount (₦)</label>
            <input
              type="number"
              name="target_amount"
              required
              min="1000"
              value={formData.target_amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ajobi-green focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ajobi-green focus:border-transparent transition-all outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ajobi-green focus:border-transparent transition-all outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-ajobi-green hover:bg-ajobi-green-dark text-white rounded-xl font-bold transition-all shadow-[0_4px_16px_rgba(6,107,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : (
              <>
                <Plus className="w-5 h-5" />
                Create Goal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
