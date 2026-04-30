import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Download, Edit3, Eye, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AIOperatedContract from "@/components/contracts/AIOperatedContract";

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
  { title: "Welcome & Onboarding Pack", status: "Available", action: "View" },
];

const Contracts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [fetching, setFetching] = useState(true);

  // Modal State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

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

  const handleActionClick = (contract: Contract) => {
    if (contract.title === "AI-Operated Human Artist Contract" && contract.action !== "View") {
      setSelectedContract(contract);
      setShowSignModal(true);
    } else {
      toast("Ação não disponível no momento para este documento.");
    }
  };

  const handleSignContract = async () => {
    if (!signatureName.trim() || !agreedToTerms || !selectedContract) return;
    
    setIsSigning(true);
    try {
      const today = new Date().toLocaleDateString('pt-BR');
      const newStatus = `Signed on ${today}`;
      
      const { error } = await supabase
        .from("contracts")
        .update({ status: newStatus, action: "View" })
        .eq("id", selectedContract.id);
        
      if (error) throw error;
      
      setContracts(contracts.map((c) => 
        c.id === selectedContract.id ? { ...c, status: newStatus, action: "View" } : c
      ));
      
      toast.success("Contrato assinado com sucesso!");
      setShowSignModal(false);
      setSignatureName("");
      setAgreedToTerms(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Erro ao assinar contrato. Tente novamente.");
    } finally {
      setIsSigning(false);
    }
  };

  const getActionBtn = (action: string, title: string, contract: Contract) => {
    let Icon = Eye;
    let btnClass = "bg-foreground text-background hover:bg-foreground/90";
    
    if (action === "Download") {
      Icon = Download;
      btnClass = "bg-blue-600 text-white hover:bg-blue-700";
    } else if (action === "Sign") {
      Icon = Edit3;
      btnClass = "bg-emerald-600 text-white hover:bg-emerald-700";
    }

    const btn = (
      <button 
        onClick={() => title !== "Welcome & Onboarding Pack" && handleActionClick(contract)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm ${btnClass}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {action}
      </button>
    );

    if (title === "Welcome & Onboarding Pack") {
      return (
        <a href="/welcome-pack.html" target="_blank" rel="noopener noreferrer">
          {btn}
        </a>
      );
    }

    return btn;
  };

  // Derive overall contract status from the main AI contract
  const aiContract = contracts.find(c => c.title === "AI-Operated Human Artist Contract");
  const overallStatus = aiContract ? aiContract.status : "Pending Signature";
  const isOverallSigned = overallStatus.includes("Signed on");

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
            <span>ZHYT</span>
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
            This section contains all official contracts, legal documents, and confidential files related to the artist's career within ZHYT and N-EXIE Entertainment. All documents are encrypted, digitally verified, and legally binding.
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 w-full">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Artist</p>
              <p className="font-bold text-foreground">Ryu Soo-min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Program</p>
              <p className="font-medium text-foreground">AI-Operated Human</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Division</p>
              <p className="font-medium text-foreground">N-EXIE Creators</p>
            </div>
            <div 
              className={`cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-lg transition-colors ${!isOverallSigned ? 'animate-pulse' : ''}`}
              onClick={() => {
                if (aiContract && !isOverallSigned) {
                  handleActionClick(aiContract);
                }
              }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Contract Status</p>
              <p className={`font-bold flex items-center gap-1 ${isOverallSigned ? "text-emerald-600" : "text-amber-600"}`}>
                {isOverallSigned ? <CheckCircle2 className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />} 
                {overallStatus}
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
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[50%]">Document</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fetching ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">Carregando documentos criptografados...</td>
                    </tr>
                  ) : contracts.map((c, i) => (
                    <tr 
                      key={c.id || i} 
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => c.title !== "Welcome & Onboarding Pack" && handleActionClick(c)}
                    >
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
                        {getActionBtn(c.title === "Welcome & Onboarding Pack" ? "View" : c.action, c.title, c)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedContract?.title}</DialogTitle>
            <DialogDescription>
              Por favor, leia atentamente o contrato abaixo antes de assinar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto max-h-[60vh] my-4 rounded-md">
            {selectedContract?.title === "AI-Operated Human Artist Contract" ? (
              <AIOperatedContract />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 border border-border text-muted-foreground rounded-md">
                Conteúdo do contrato não disponível.
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <div className="flex flex-col gap-3 flex-1 w-full">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms} 
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Li e concordo com os termos do contrato.
                </Label>
              </div>
              <div className="flex gap-3">
                <Input 
                  placeholder="Digite seu nome completo como assinatura..." 
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSignContract} 
              disabled={!agreedToTerms || !signatureName.trim() || isSigning}
              className="w-full sm:w-auto"
            >
              {isSigning ? "Assinando..." : "Assinar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
