import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import IncomingCallListener from "@/components/chat/IncomingCallListener";

interface Props {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}

export default function AppShell({ children, hideNav, className = "" }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className={`flex-1 max-w-md w-full mx-auto flex flex-col ${className}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
      <IncomingCallListener />
    </div>
  );
}
