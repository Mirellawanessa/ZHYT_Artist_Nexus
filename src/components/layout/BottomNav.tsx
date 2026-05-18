import { NavLink, useLocation } from "react-router-dom";
import { CreditCard, FolderClosed, Home, MessageCircle, User } from "lucide-react";

const tabs = [
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/axs", icon: FolderClosed, label: "A.X.S" },
  { to: "/home", icon: Home, label: "Home" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-30">
      <ul className="flex items-center justify-around max-w-md mx-auto px-2 py-3">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to}>
              <NavLink
                to={to}
                aria-label={label}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
