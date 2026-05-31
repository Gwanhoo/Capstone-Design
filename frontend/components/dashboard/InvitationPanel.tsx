"use client";

import { useEffect, useState } from "react";
import { acceptInvitation, declineInvitation, getMyInvitations, MyInvitation } from "@/lib/api/invitationApi";

export function InvitationPanel() {
  const [invitations, setInvitations] = useState<MyInvitation[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setInvitations(await getMyInvitations());
    } catch {
      setError("초대 목록을 불러오지 못했습니다.");
    }
  };
  useEffect(() => { load(); }, []);

  const process = async (invitationId: string, action: "accept" | "decline") => {
    try {
      setProcessingId(invitationId);
      setError(null);
      if (action === "accept") {
        await acceptInvitation(invitationId);
        window.dispatchEvent(new Event("projects:refresh"));
      } else {
        await declineInvitation(invitationId);
      }
      await load();
    } catch {
      setError(action === "accept" ? "초대 수락에 실패했습니다." : "초대 거절에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-sm font-semibold">받은 초대</h2>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
      {invitations.length === 0 ? <p className="mt-2 text-xs text-on-surface-variant">대기 중인 초대가 없습니다.</p> : (
        <div className="mt-3 space-y-2">{invitations.map((inv) => {
          const isProcessing = processingId === inv.id;
          return <div key={inv.id} className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs"><p className="font-semibold">{inv.project.name}</p><p className="text-on-surface-variant">초대자: {inv.inviter.name} ({inv.inviter.email})</p><div className="mt-2 flex gap-2"><button disabled={isProcessing} className="rounded bg-primary px-2 py-1 text-on-primary disabled:opacity-60" onClick={() => process(inv.id, "accept")}>{isProcessing ? "처리 중" : "수락"}</button><button disabled={isProcessing} className="rounded border border-white/20 px-2 py-1 disabled:opacity-60" onClick={() => process(inv.id, "decline")}>거절</button></div></div>;
        })}</div>
      )}
    </section>
  );
}
