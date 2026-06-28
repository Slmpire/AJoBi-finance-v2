"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { savingsService } from "@/services/savingsService";
import { ArrowLeft, Target, AlertCircle, Calendar, RefreshCw, CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SavingsGoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGoal();
    }
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const response = await savingsService.getGoalDetail(id);
      if (response.success || response.status) {
        setGoal(response.data);
      } else {
        setError(response.message || "Failed to fetch goal");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupDebit = async () => {
    try {
      setActionLoading(true);
      const response = await savingsService.setupDebit(id);
      if (response.success || response.status) {
        // Might return authorization URL for Paystack
        if (response.data?.authorization_url) {
          window.location.href = response.data.authorization_url;
        } else {
          fetchGoal(); // Refresh to update status
        }
      } else {
        alert(response.message || "Failed to setup debit");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakGoal = async () => {
    if (!window.confirm("Are you sure you want to break this goal? This will incur an AjoScore penalty of -3 points.")) return;
    
    try {
      setActionLoading(true);
      const response = await savingsService.breakGoal(id);
      if (response.success || response.status) {
        alert("Goal broken successfully. Funds have been released.");
        router.push("/dashboard/savings");
      } else {
        alert(response.message || "Failed to break goal");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ajobi-green"></div></div>;
  }

  if (error || !goal) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-600 rounded-xl flex flex-col items-center gap-4">
        <AlertCircle className="w-8 h-8" />
        <p className="font-medium">{error || "Goal not found"}</p>
        <Link href="/dashboard/savings" className="underline font-bold">Go Back</Link>
      </div>
    );
  }

  const progress = goal.target_amount > 0 ? (goal.locked_balance / goal.target_amount) * 100 : 0;
  const isPendingDebit = goal.status === "pending_debit_setup";
  const isBroken = goal.status === "broken";
  const isCompleted = goal.status === "completed";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/savings" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{goal.name}</h1>
            <p className="text-sm text-gray-500 capitalize">Status: <span className="font-bold">{goal.status.replace(/_/g, ' ')}</span></p>
          </div>
        </div>
        
        {goal.status === 'active' && (
          <button 
            onClick={handleBreakGoal}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
          >
            Break Goal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-ajobi-light text-ajobi-green flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Saved So Far</p>
                  <h2 className="text-3xl font-bold text-gray-900">₦{goal.locked_balance?.toLocaleString() || '0'}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Target</p>
                <h2 className="text-xl font-bold text-gray-400">₦{goal.target_amount?.toLocaleString() || '0'}</h2>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-ajobi-green">{progress.toFixed(1)}% Achieved</span>
                <span className="text-gray-500">₦{(goal.target_amount - (goal.locked_balance || 0)).toLocaleString()} left</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-ajobi-green rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Instalment</p>
                <p className="font-bold text-gray-900">₦{goal.instalment_amount?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Frequency</p>
                <p className="font-bold text-gray-900 capitalize">{goal.frequency}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Next Debit</p>
                <p className="font-bold text-gray-900">{goal.next_debit_date ? new Date(goal.next_debit_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Target Date</p>
                <p className="font-bold text-gray-900">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {isPendingDebit && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="mt-1 bg-orange-100 text-orange-600 p-2 rounded-full">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 mb-1">Direct Debit Required</h3>
                <p className="text-sm text-orange-700 mb-4">
                  To activate this goal, please setup an automated direct debit mandate. This allows us to deduct the instalment on schedule securely.
                </p>
                <button
                  onClick={handleSetupDebit}
                  disabled={actionLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {actionLoading ? "Processing..." : "Setup Mandate Now"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Goal Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-ajobi-green text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                  <span className="font-bold text-gray-900 block mb-1">Created</span>
                  <span className="text-gray-500 text-xs">{goal.created_at ? new Date(goal.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${!isPendingDebit ? 'bg-ajobi-green text-white' : 'bg-gray-200'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10`}>
                  { !isPendingDebit && <CheckCircle2 className="w-3 h-3" /> }
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                  <span className={`font-bold ${!isPendingDebit ? 'text-gray-900' : 'text-gray-400'} block mb-1`}>Debit Setup</span>
                  <span className="text-gray-500 text-xs">Paystack Mandate</span>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${isCompleted ? 'bg-ajobi-green text-white' : 'bg-gray-200'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10`}>
                  { isCompleted && <CheckCircle2 className="w-3 h-3" /> }
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                  <span className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'} block mb-1`}>Completed</span>
                  <span className="text-gray-500 text-xs">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
