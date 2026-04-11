import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Download, Edit3, Eye, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Contract {
  id: string;
  title: string;
  status: string;
  action: string;
  created_at: string;
}

const defaultContracts = [
  { title: "Non-Disclosure Agreement (NDA)", status: "Pending Signature", action: "Review" },
  { title: "AI-Operated Human Artist Contract", status: "Pending Signature", action: "Review" },
  { title: "AI Identity Consent Form", status: "Pending Approval", action: "View" },
  { title: "Digital Signature Authorization", status: "Pending Signature", action: "Sign" },
  { title: "Welcome & Onboarding Pack", status: "Available", action: "Download" },
];

const Contracts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching contracts:", error);
        // Fallback for UI se a tabela ainda não tiver sido criada pelo usuário
        setContracts(defaultContracts as any);
      } else if (data && data.length === 0) {
        // População de banco automática!
        const initialInserts = defaultContracts.map(c => ({
          user_id: user.id,
          title: c.title,
          status: c.status,
          action: c.action,
        }));
        await supabase.from("contracts").insert(initialInserts);
        
        const { data: newData } = await supabase
          .from("contracts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        
        setContracts(newData || []);
      } else {
        setContracts(data);
      }
      setFetching(false);
    };

    if (user) fetchContracts();
  }, [user]);

  if (loading || !user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Signature":
        return <Edit3 className="w-4 h-4 text-amber-500" />;
      case "Pending Approval":
      case "Under Review":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Available":
      case "Active":
      case "Signed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    let colorClass = "bg-muted text-muted-foreground border-border";
    if (status.includes("Pending")) colorClass = "bg-amber-100 text-amber-800 border-amber-200";
    if (status.includes("Review") || status.includes("Approval")) colorClass = "bg-blue-100 text-blue-800 border-blue-200";
    if (status.includes("Signed") || status.includes("Available") || status.includes("Active")) colorClass = "bg-green-100 text-green-800 border-green-200";
    
    return (
      <span className={`inline-flex flex-row items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const getActionBtn = (action: string) => {
    let Icon = Eye;
    let btnClass = "bg-foreground text-background hover:bg-foreground/90";
    
    if (action === "Download") {
      Icon = Download;
      btnClass = "bg-blue-600 text-white hover:bg-blue-700";
    } else if (action === "Sign") {
      Icon = Edit3;
      btnClass = "bg-emerald-600 text-white hover:bg-emerald-700";
    }

    return (
      <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm ${btnClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {action}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-muted cursor-pointer transition-colors border border-border"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center text-sm font-medium text-muted-foreground uppercase tracking-widest gap-2">
            <span>FAME & CO.</span>
            <span className="text-border">—</span>
            <span>N-EXIE Entertainment</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Secure Legal & Documentation Center
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Contracts & Documents
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Secure Legal Documentation Portal</p>
          
          <p className="text-muted-foreground leading-relaxed pt-2">
            This section contains all official contracts, legal documents, and confidential files related to the artist's career within FAME & CO. and N-EXIE Entertainment. All documents are encrypted, digitally verified, and legally binding.
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 w-full">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Artist</p>
              <p className="font-bold text-foreground">Andressa Morais</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Program</p>
              <p className="font-medium text-foreground">AI-Operated Human</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Division</p>
              <p className="font-medium text-foreground">N-EXIE Creators</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Contract Status</p>
              <p className="font-bold text-amber-600 flex items-center gap-1">
                <Edit3 className="w-4 h-4" /> Pending Signature
              </p>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="space-y-5 max-w-4xl">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Contract Status Dashboard
          </h2>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[50%]">Documento</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fetching ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">Carregando documentos criptografados...</td>
                    </tr>
                  ) : contracts.map((c, i) => (
                    <tr key={c.id || i} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="font-semibold text-foreground text-sm">{c.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {getActionBtn(c.action)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contracts;
