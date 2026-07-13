"use client";

import { Plus, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "./model/useGroups";
import MyGroups from "./parts/MyGroups";
import BrowseGroups from "./parts/BrowseGroups";
import AutoMatch from "./parts/AutoMatch";
import { groupsService } from "@/services/groupsService";

export default function GroupsOverviewPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const {
    myGroups,
    publicGroups,
    matchedGroups,
    searchFilter,
    setSearchFilter,
    amountFilter,
    setAmountFilter,
    frequencyFilter,
    setFrequencyFilter,
    matchAmount,
    setMatchAmount,
    matchFrequency,
    setMatchFrequency,
    isMatching,
    showMatches,
    handleFindMatch,
    activeTab,
    setActiveTab
  } = useGroups();

  const handleJoinWithCode = async () => {
    if (!inviteCode.trim()) return;
    setJoining(true);
    setJoinError(null);
    try {
      const response = await groupsService.joinGroup({ invite_code: inviteCode.trim().toUpperCase() });
      if (response.status) {
        setInviteCode('');
        window.location.reload();
      } else {
        setJoinError(response.message || 'Invalid invite code');
      }
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-8 w-full mx-auto pb-12">

      {/* Join with Code Banner */}
      <div className="bg-white rounded-2xl border border-[#E8EFE8] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Have an invite code?</p>
          <p className="text-xs text-gray-400 font-medium">Enter it below to join a group instantly</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoinWithCode()}
            placeholder="e.g. 7PCFJS"
            maxLength={6}
            className="flex-1 sm:w-40 px-4 py-2.5 rounded-xl border border-[#E8EFE8] text-[14px] font-bold tracking-widest outline-none focus:border-[#066B44] bg-[#FAFCFB] transition-all uppercase"
          />
          <button
            onClick={handleJoinWithCode}
            disabled={joining || !inviteCode.trim()}
            className="bg-[#066B44] hover:bg-[#055737] text-white px-5 py-2.5 rounded-xl text-[13px] font-extrabold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {joining ? 'Joining...' : 'Join'}
          </button>
        </div>
        {joinError && (
          <p className="text-xs text-red-500 font-bold w-full sm:w-auto">{joinError}</p>
        )}
      </div>

      {/* Sub Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EFE8]">
        <div className="flex items-center gap-8">
          {[
            { id: 'my', label: 'My Groups' },
            { id: 'browse', label: 'Browse Groups' },
            { id: 'match', label: 'Auto-Match' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[14px] font-bold pb-4 -mb-4.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#066B44] border-[#066B44]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link
          href="/dashboard/groups/create"
          className="inline-flex items-center justify-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-6 py-3 rounded-xl text-[13px] font-extrabold transition-all shadow-[0_4px_14px_rgba(6,107,68,0.25)] hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Create Group
        </Link>
      </div>

      {/* Conditional Rendering based on Tabs */}
      {activeTab === 'my' && <MyGroups groups={myGroups} />}

      {activeTab === 'browse' && (
        <BrowseGroups
          groups={publicGroups}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          amountFilter={amountFilter}
          setAmountFilter={setAmountFilter}
          frequencyFilter={frequencyFilter}
          setFrequencyFilter={setFrequencyFilter}
        />
      )}

      {activeTab === 'match' && (
        <AutoMatch
          matchAmount={matchAmount}
          setMatchAmount={setMatchAmount}
          matchFrequency={matchFrequency}
          setMatchFrequency={setMatchFrequency}
          isMatching={isMatching}
          showMatches={showMatches}
          onFindMatch={handleFindMatch}
          matchedGroups={matchedGroups}
        />
      )}
    </div>
  );
}