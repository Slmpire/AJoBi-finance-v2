"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { groupsService } from "@/services/groupsService";

export default function JoinGroupPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Save the invite code and redirect to login
      localStorage.setItem('pending_invite_code', code);
      router.push(`/onboarding?invite=${code}`);
      return;
    }

    setJoining(true);
    setError(null);
    try {
      const response = await groupsService.joinGroup({ invite_code: code });
      if (response.status) {
        setJoined(true);
        setTimeout(() => {
          router.push('/dashboard/groups');
        }, 2000);
      } else {
        setError(response.message || 'Failed to join group');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setJoining(false);
    }
  };

  if (joined) {
    return (
      <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-sm space-y-4">
          <CheckCircle2 className="w-16 h-16 text-[#066B44] mx-auto" />
          <h2 className="text-2xl font-black text-gray-900">You're in!</h2>
          <p className="text-gray-500 font-medium">Taking you to the group dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#F1F6F3] rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-[#066B44]" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Join Ajo Group</h1>
          <p className="text-sm text-gray-500 font-medium">You've been invited to join a savings group</p>
        </div>

        {/* Invite Code Display */}
        <div className="bg-[#F1F6F3] rounded-2xl p-6 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invite Code</p>
          <p className="text-4xl font-black text-[#066B44] tracking-widest">{code}</p>
        </div>

        {error && (
          <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Action */}
        <div className="space-y-3">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          >
            {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
            {joining ? 'Joining...' : isLoggedIn ? 'Join This Group' : 'Sign Up to Join'}
          </button>

          {!isLoggedIn && (
            <p className="text-center text-xs text-gray-400 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => {
                  localStorage.setItem('pending_invite_code', code);
                  router.push('/login');
                }}
                className="text-[#066B44] font-bold hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">Secured by AjoBI — Nigeria's digital cooperative savings platform</p>
        </div>
      </div>
    </div>
  );
}