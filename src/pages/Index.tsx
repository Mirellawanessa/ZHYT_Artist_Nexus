import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/welcome");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Section */}
      <div className="flex-1 flex flex-col px-8 py-6 relative">
        {/* Header */}
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          FAME & CO. Artist Nexus
        </h1>

        {/* Vertical decorative line */}
        <div className="absolute left-16 top-24 bottom-48 w-px bg-foreground/20" />

        {/* Main Title */}
        <div className="flex-1 flex flex-col justify-center pl-12 max-w-2xl">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground mb-12">
            Where Stars Connect<br />and Legends Begin.
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="border border-foreground/20 rounded-2xl p-8 max-w-lg">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-foreground mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-full border-2 px-4 text-sm bg-background text-foreground focus:outline-none"
                  style={{ borderColor: "hsl(270, 50%, 90%)" }}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-foreground mb-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-full border-2 px-4 text-sm bg-background text-foreground focus:outline-none"
                  style={{ borderColor: "hsl(270, 50%, 90%)" }}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-14 rounded-full text-lg font-semibold text-foreground transition-colors"
                  style={{ backgroundColor: "hsl(220, 30%, 90%)" }}
                >
                  Access Portal
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is an invite-only platform. If you don't have credentials, contact{" "}
                <span style={{ color: "hsl(270, 50%, 70%)" }} className="cursor-pointer">
                  FAME & CO.
                </span>{" "}
                to request access.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8">
          <p className="text-sm font-mono text-foreground tracking-widest">
            FAME & CO. — N-EXIE Entertainment
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Private and Confidential Platform · All communications are encrypted and protected
          </p>
          <p className="text-xs text-muted-foreground">
            © N-EXIE Entertainment. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Section - N-EXIE with vertical lines */}
      <div className="hidden lg:flex w-80 relative items-center justify-center">
        {/* Vertical lines */}
        <div className="absolute inset-y-0 flex gap-8">
          <div className="w-px bg-foreground h-full" />
          <div className="w-px bg-foreground h-full" />
          <div className="w-px bg-foreground h-full" />
          <div className="w-px bg-foreground h-full" />
        </div>
        {/* N-EXIE text */}
        <span className="text-6xl font-serif font-normal text-foreground z-10 tracking-wider">
          N-EXIE
        </span>
      </div>
    </div>
  );
};

export default Index;
