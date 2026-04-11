import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created! Check your email to confirm." });
      }
    } else {
      if (email !== "andressa.morais@fameandco.ai" || password !== "FAME&CO.Andressa@2026") {
        toast({ title: "Acesso negado", description: "Estas credenciais não têm permissão para acessar o portal.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: error.message, variant: "destructive" });
      } else {
        navigate("/welcome");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Section */}
      <div className="flex-1 flex flex-col px-8 py-6 relative">
        <h1 className="text-lg font-bold tracking-tight text-foreground">FAME & CO. Artist Nexus</h1>
        <div className="absolute left-16 top-24 bottom-48 w-px bg-foreground/20" />

        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-12 text-center">
            Where Stars Connect<br />and Legends Begin.
          </h2>

          <form onSubmit={handleSubmit} className="border border-foreground/20 rounded-2xl p-8 w-full max-w-lg">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-foreground mb-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 rounded-full border-2 px-4 text-sm bg-background text-foreground focus:outline-none"
                  style={{ borderColor: "hsl(270, 50%, 90%)" }}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-foreground mb-2">
                  <Lock className="h-4 w-4" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 rounded-full border-2 px-4 text-sm bg-background text-foreground focus:outline-none"
                  style={{ borderColor: "hsl(270, 50%, 90%)" }}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-full text-lg font-semibold text-foreground transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "hsl(220, 30%, 90%)" }}
                >
                  {loading ? "Loading..." : isSignUp ? "Create Account" : "Access Portal"}
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                This is an invite-only platform. If you don't have credentials, contact{" "}
                <span style={{ color: "hsl(270, 50%, 70%)" }} className="cursor-pointer">FAME & CO.</span> to request access.
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-mono text-foreground tracking-widest">FAME & CO. — N-EXIE Entertainment</p>
            <p className="text-xs text-muted-foreground mt-1">Private and Confidential Platform · All communications are encrypted and protected</p>
            <p className="text-xs text-muted-foreground">© N-EXIE Entertainment. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Section - N-EXIE between lines */}
      <div className="hidden lg:block w-48 relative">
        {/* 4 vertical lines evenly spaced */}
        <div className="absolute inset-y-0 left-0 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-foreground" />
        <div className="absolute inset-y-0 right-0 w-px bg-foreground" />

        {/* N-EXIE text centered vertically, each pair between lines */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="w-full flex text-5xl font-serif text-foreground">
            <span className="flex-1 text-center">N-</span>
            <span className="flex-1 text-center">EX</span>
            <span className="flex-1 text-center">IE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
