import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let { error } = await signIn(email, password);
    if (error) {
      const r = await signUp(email, password);
      if (!r.error) {
        const re = await signIn(email, password);
        error = re.error;
      } else { error = r.error; }
    }
    if (error) toast({ title: String(error.message), variant: "destructive" });
    else navigate("/welcome");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative lilac blob */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-soft -translate-x-1/3 -translate-y-1/3" aria-hidden />

      <header className="px-6 pt-6 relative z-10">
        <p className="text-xs font-semibold tracking-tight">ZHYT. Artist Nexus</p>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto px-8 pb-12 relative z-10">
        <h1 className="text-3xl font-serif font-bold mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-muted/60 rounded-full px-4 py-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-muted/60 rounded-full px-4 py-3">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground"
            />
            <button type="button" className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">FORGOT</button>
          </div>

          <div className="flex justify-center pt-12">
            <button
              type="submit" disabled={loading}
              className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"} <LogIn className="w-4 h-4" />
            </button>
          </div>
        </form>

        <footer className="mt-16 text-center text-[11px] text-muted-foreground">
          <p>ZHYT — N-EXIE Entertainment</p>
          <p className="mt-1">Private and Confidential · All communications are encrypted and protected</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
