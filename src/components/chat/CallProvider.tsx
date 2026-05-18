import { createContext, ReactNode, useContext } from "react";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import { useAuth } from "@/hooks/useAuth";

type CallCtx = ReturnType<typeof useWebRTCCall>;
const CallContext = createContext<CallCtx | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const call = useWebRTCCall({ userId: user?.id });
  return <CallContext.Provider value={call}>{children}</CallContext.Provider>;
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used inside CallProvider");
  return ctx;
}
