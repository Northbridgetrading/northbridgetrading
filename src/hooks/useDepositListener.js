// src/hooks/useDepositListener.js
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useDepositListener = (userId, onApproved, onRejected) => {
  useEffect(() => {
    if (!userId) return;

    console.log("🔌 Realtime listener started for userId:", userId);

    const channel = supabase
      .channel(`deposits:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "deposit_requests",
          // ← removed filter, we check manually below
        },
        (payload) => {
          console.log("📨 Realtime event received:", payload);
          const updated = payload.new;

          // Only process events for this user
          if (updated.user_id !== userId) return;

          if (updated.status === "approved") {
            onApproved?.(updated);
          } else if (updated.status === "rejected") {
            onRejected?.(updated);
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => supabase.removeChannel(channel);
  }, [userId]);
};