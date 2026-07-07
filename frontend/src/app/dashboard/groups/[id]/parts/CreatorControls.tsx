"use client";

import { UserPlus, RefreshCw, ChevronRight, Copy } from "lucide-react";

interface CreatorControlsProps {
  inviteCode?: string;
  memberCount?: number;
  maxMembers?: number;
  groupId?: string;
}

export default function CreatorControls({
  inviteCode,
  memberCount = 0,
  maxMembers = 0,
  groupId,
}: CreatorControlsProps) {
  const slotsRemaining = Math.max(0, maxMembers - memberCount);

  const handleInvite = () => {
    const link = `${window.location.origin}/dashboard/groups?join=${inviteCode || ''}`;
    const message = `Join my AjoBI savings group! Use invite code: ${inviteCode} or click: ${link}`;
    if (navigator.share) {
      navigator.share({ title: 'Join my Ajo Group', text: message, url: link });
    } else {
      navigator.clipboard.writeText(message);
      alert('Invite link copied to clipboard!');
    }
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      alert(`Invite code "${inviteCode}" copied!`);
    }
  };

  const handleEditRotation = () => {
    alert('Rotation editing coming soon. Members can swap positions by mutual agreement.');
  };

  const actions = [
    {
      label: "Invite Member",
      subtitle: slotsRemaining > 0 ? `${slotsRemaining} slot${slotsRemaining !== 1 ? 's' : ''} remaining` : 'Group is full',
      icon: UserPlus,
      color: "text-emerald-600 bg-emerald-50",
      onClick: slotsRemaining > 0 ? handleInvite : undefined,
      disabled: slotsRemaining === 0,
    },
    {
      label: "Copy Invite Code",
      subtitle: inviteCode ? `Code: ${inviteCode}` : 'No code available',
      icon: Copy,
      color: "text-blue-500 bg-blue-50",
      onClick: handleCopyCode,
      disabled: !inviteCode,
    },
    {
      label: "Edit Rotation",
      subtitle: "Swap member positions",
      icon: RefreshCw,
      color: "text-purple-500 bg-purple-50",
      onClick: handleEditRotation,
      disabled: false,
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border-2 border-dashed border-[#E8EFE8] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
      <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
        🛠️ Creator Controls
      </h3>

      <div className="space-y-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={act.onClick}
              disabled={act.disabled}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#F1F6F3] hover:border-[#066B44]/20 bg-white hover:bg-[#F9FCF9] transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-gray-800 group-hover:text-[#066B44] transition-colors">{act.label}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{act.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#066B44] transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}