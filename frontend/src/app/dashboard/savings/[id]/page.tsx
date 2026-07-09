"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { savingsService } from "@/services/savingsService";
import { ArrowLeft, Target, Calendar, CreditCard, CheckCircle2, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SavingsGoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [goal, setGoal] = useState<any>(null);
  const [instalments, setInstalments] = useState<any[]>([]);
  const [projectedCompletion, setProjectedCompletion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [breakConfirm, setBreakConfirm] = useState(false);

  useEffect(() => {
    if (id) fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const response = await savingsService.getGoalDetail(id);
      if (response.status && response.data) {
        setGoal(response.data.goal);
        setInstalments(response.data.instalments || []);
        setProjectedCompletion(response.data.projected_completion || '');
      } else {
        setError(response.message || 'Failed to fetch goal');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePayInstalment = async () => {
    try {
      setActionLoading(true);
      const response = await savingsService.setupDebit(id);
      if (response.status && response.data?.checkout_link) {
        window.open(response.data.checkout_link, '_blank');
      } else {
        alert(response.message || 'Failed to generate payment link');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakGoal = async () => {
    try {
      setActionLoading(true);
      const response = await savingsService.breakGoal(id);
      if (response.status) {
        alert('Goal broken. Your saved funds will be released.');
        router.push('/dashboard/savings');
      } else {
        alert(response.message || 'Failed to break goal');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
      setBreakConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin" />
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl font-bold border border-red-100 flex items-center gap-3 justify-center">
          <AlertCircle className="w-5 h-5" />
          {error || 'Goal not found'}
        </div>
        <Link href="/dashboard/savings" className="inline-flex items-center gap-2 text-[#066B44] font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Savings
        </Link>
      </div>
    );
  }

  const progress = goal.target_amount > 0
    ? Math.min(100, (parseFloat(goal.locked_balance) / parseFloat(goal.target_amount)) * 100)
    : 0;

  const isComplete = goal.status === 'completed';
  const isBroken = goal.status === 'broken';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/savings" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#066B44] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Savings
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-black text-gray-900 tracking-tight">{goal.name}</h1>
          <span className={`px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-widest ${
            isComplete ? 'bg-green-50 text-green-600' :
            isBroken ? 'bg-red-50 text-red-500' :
            'bg-amber-50 text-amber-600'
          }`}>
            {goal.status?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F1F6F3] rounded-2xl flex items-center justify-center text-[#066B44]">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Progress</p>
                <p className="text-2xl font-black text-gray-900">{progress.toFixed(1)}% Complete</p>
              </div>
            </div>

            <div className="w-full h-4 bg-[#F1F6F3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#066B44] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F9FBFA] rounded-2xl p-4 border border-[#F1F6F3]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved</p>
                <p className="text-lg font-black text-[#066B44] mt-1">
                  ₦{parseFloat(goal.locked_balance || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-[#F9FBFA] rounded-2xl p-4 border border-[#F1F6F3]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</p>
                <p className="text-lg font-black text-gray-900 mt-1">
                  ₦{parseFloat(goal.target_amount).toLocaleString()}
                </p>
              </div>
              <div className="bg-[#F9FBFA] rounded-2xl p-4 border border-[#F1F6F3]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</p>
                <p className="text-lg font-black text-gray-900 mt-1">
                  ₦{(parseFloat(goal.target_amount) - parseFloat(goal.locked_balance || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Instalment History */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Payment History</h3>
            {instalments.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                No payments made yet. Make your first instalment to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {instalments.map((inst: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      {inst.status === 'paid'
                        ? <CheckCircle2 className="w-5 h-5 text-[#066B44]" />
                        : <AlertCircle className="w-5 h-5 text-amber-500" />
                      }
                      <div>
                        <p className="text-sm font-bold text-gray-900">Instalment payment</p>
                        <p className="text-xs text-gray-400">
                          {inst.paid_at ? new Date(inst.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#066B44]">+₦{parseFloat(inst.amount).toLocaleString()}</p>
                      <p className={`text-xs font-bold ${inst.status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                        {inst.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-white rounded-[32px] p-6 border border-[#F1F6F3] shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Frequency</span>
                <span className="text-sm font-bold text-gray-900 capitalize">{goal.frequency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Instalment</span>
                <span className="text-sm font-bold text-gray-900">₦{parseFloat(goal.instalment_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Deadline</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {goal.next_debit_date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Next Payment</span>
                  <span className="text-sm font-bold text-[#066B44]">
                    {new Date(goal.next_debit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
              {projectedCompletion && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Projection</span>
                  <span className="text-sm font-bold text-gray-900">{projectedCompletion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isComplete && !isBroken && (
            <div className="space-y-3">
              <button
                onClick={handlePayInstalment}
                disabled={actionLoading}
                className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Pay Instalment
              </button>

              {!breakConfirm ? (
                <button
                  onClick={() => setBreakConfirm(true)}
                  className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 py-4 rounded-2xl font-bold text-[14px] transition-all"
                >
                  Break Goal
                </button>
              ) : (
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-3">
                  <p className="text-sm font-bold text-red-700 text-center">This will reduce your AjoScore by 3 points.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBreakConfirm(false)}
                      className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBreakGoal}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-70"
                    >
                      {actionLoading ? 'Breaking...' : 'Yes, Break'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isComplete && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
              <p className="font-black text-green-700">Goal Completed!</p>
              <p className="text-sm text-green-600 font-medium">Your funds are ready for withdrawal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}