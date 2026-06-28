"use client"

import { 
  Plus, 
  RefreshCcw, 
  Target, 
  Briefcase, 
  Calendar, 
  RefreshCw, 
  Download, 
  Settings, 
  LayoutDashboard, 
  History, 
  TrendingUp,
  Store,
  MoreVertical,
  Banknote,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { savingsService } from "@/services/savingsService";

export default function SavingsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const [overviewRes, goalsRes] = await Promise.all([
          savingsService.getOverview(),
          savingsService.getGoals()
        ]);
        
        if (overviewRes.success || overviewRes.status) {
          setOverview(overviewRes.data);
        }
        if (goalsRes.success || goalsRes.status) {
          setGoals(goalsRes.data);
        }
      } catch (err) {
        console.error("Error fetching savings data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavingsData();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Inner Sidebar for Savings Hub */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-ajobi-green">Savings hub</h2>
          </div>
          <div className="p-3 space-y-1">
            <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-ajobi-green text-white rounded-xl font-medium text-sm shadow-sm">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green rounded-xl font-medium text-sm transition-colors">
              <Target className="w-5 h-5" />
              Savings Goals
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green rounded-xl font-medium text-sm transition-colors">
              <Settings className="w-5 h-5" />
              Automation Rules
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-ajobi-light hover:text-ajobi-green rounded-xl font-medium text-sm transition-colors">
              <History className="w-5 h-5" />
              History
            </Link>
          </div>
        </div>

        {/* Daily Tip Card */}
        <div className="bg-[#006C49] rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-ajobi-light text-xs font-bold uppercase tracking-wider mb-2">Daily Tip</p>
            <p className="font-medium text-sm leading-relaxed">
              Automate your savings to reach goals 3x faster.
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white opacity-10 rotate-45 transform"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Total Savings Balance Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Savings Balance</p>
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-4xl md:text-5xl font-bold text-[#006C49] tracking-tight">
                {loading ? "..." : `₦${(overview?.total_saved || 0).toLocaleString()}`}
              </h2>
            </div>
            <p className="text-sm font-medium text-[#006C49] flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> {loading ? "..." : `+${overview?.percentage_growth || 0}% this month`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/savings/create" className="bg-[#006C49] hover:bg-[#005a3d] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Save Now
            </Link>
            <button className="bg-ajobi-light hover:bg-[#d1eee3] text-[#006C49] px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
              <RefreshCcw className="w-5 h-5" />
              Transfer
            </button>
          </div>
        </div>

        {/* Savings Goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Savings Goals</h3>
            <Link href="#" className="text-[#006C49] font-medium text-sm flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
               <div className="col-span-2 text-center text-gray-500 py-8">Loading goals...</div>
            ) : goals.length === 0 ? (
               <div className="col-span-2 text-center text-gray-500 py-8 bg-white rounded-2xl border border-gray-100 border-dashed">
                 No savings goals yet. <Link href="/dashboard/savings/create" className="text-ajobi-green underline font-medium">Create one now.</Link>
               </div>
            ) : (
              goals.map((goal: any) => {
                const progress = goal.target_amount > 0 ? (goal.locked_balance / goal.target_amount) * 100 : 0;
                
                return (
                  <Link href={`/dashboard/savings/${goal.id}`} key={goal.id} className="bg-white hover:border-ajobi-green hover:shadow-md transition-all rounded-2xl p-6 shadow-sm border border-gray-100 block">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-ajobi-light flex items-center justify-center text-ajobi-green">
                        <Store className="w-5 h-5" />
                      </div>
                      <span className="bg-ajobi-light text-ajobi-green px-3 py-1 rounded-full text-xs font-bold">
                        {progress.toFixed(0)}% Achieved
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{goal.name}</h4>
                    <p className="text-sm text-gray-500 mb-6">Target: ₦{(goal.target_amount || 0).toLocaleString()}</p>
                    
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-ajobi-green rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">₦{(goal.locked_balance || 0).toLocaleString()}</span>
                        <span className="text-gray-500">₦{(goal.target_amount - (goal.locked_balance || 0)).toLocaleString()} left</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Automation Rules */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Automation Rules</h3>
          <div className="space-y-3">
            {/* Rule 1 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Weekly Stash</h4>
                  <p className="text-sm text-gray-500">₦5,000 every Monday</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-ajobi-light text-ajobi-green px-3 py-1 rounded-full text-xs font-bold hidden sm:inline-block">
                  Active
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Spare Change Roundup</h4>
                  <p className="text-sm text-gray-500">Round transactions to nearest ₦100</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-ajobi-light text-ajobi-green px-3 py-1 rounded-full text-xs font-bold hidden sm:inline-block">
                  Active
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Savings Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Description</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 border-b border-gray-100">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 text-right border-b border-gray-100">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-ajobi-green" />
                      <span className="font-medium text-gray-900">Interest Earned</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Oct 30, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦14,200.50</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-4 h-4 text-ajobi-green" />
                      <span className="font-medium text-gray-900">Deposit: Weekly Stash</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Oct 27, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦5,000.00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-4 h-4 text-ajobi-green" />
                      <span className="font-medium text-gray-900">Deposit: New Shop Goal</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Oct 25, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦50,000.00</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-ajobi-green" />
                      <span className="font-medium text-gray-900">Bonus Interest</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Oct 20, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#006C49] text-right">+₦2,500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <button className="text-ajobi-green font-medium text-sm flex items-center gap-2 hover:underline">
              Download Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
