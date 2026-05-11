import { useState, useEffect } from "react";
import { ArrowLeft, Folder, FileText, CheckCircle2 } from "lucide-react";
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
import AIIdentityConsentForm from "@/components/contracts/AIIdentityConsentForm";
import NonDisclosureAgreement from "@/components/contracts/NonDisclosureAgreement";
import DigitalSignatureAuthorization from "@/components/contracts/DigitalSignatureAuthorization";

interface Contract {
  id: string;
  title: string;
  status: string;
  action: string;
  created_at: string;
}

const defaultContracts = [
  { title: "Primary Contract", status: "Signature pending", action: "view" },
  { title: "Music Appendix — A.X.S", status: "Signature pending", action: "view" },
  { title: "Digital Signature Authorization", status: "Signature pending", action: "view" },
  { title: "NDA", status: "Signature pending", action: "view" },
];

const Contracts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [fetching, setFetching] = useState(true);

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
        setContracts(defaultContracts as any);
      } else if (!data || data.length === 0) {
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

  const handleActionClick = (contract: Contract) => {
    setSelectedContract(contract);
    setShowSignModal(true);
  };

  const handleSignContract = async () => {
    if (!signatureName.trim() || !agreedToTerms || !selectedContract) return;
    setIsSigning(true);
    try {
      const today = new Date().toLocaleDateString('pt-BR');
      const newStatus = `Signed on ${today}`;
      const { error } = await supabase
        .from("contracts")
        .update({ status: newStatus, action: "view" })
        .eq("id", selectedContract.id);
      if (error) throw error;
      setContracts(contracts.map((c) =>
        c.id === selectedContract.id ? { ...c, status: newStatus, action: "view" } : c
      ));
      toast.success("Contract signed successfully!");
      setShowSignModal(false);
      setSignatureName("");
      setAgreedToTerms(false);
      setSelectedContract(null);
    } catch (error) {
      toast.error("Error signing contract.");
    } finally {
      setIsSigning(false);
    }
  };

  const renderContractContent = (title?: string) => {
    if (!title) return null;
    if (title.includes("Primary") || title.includes("AI-Operated")) return <AIOperatedContract />;
    if (title.includes("Music Appendix") || title.includes("A.X.S") || title.includes("Identity")) return <AIIdentityConsentForm />;
    if (title.includes("Digital Signature")) return <DigitalSignatureAuthorization />;
    if (title.includes("NDA") || title.includes("Non-Disclosure")) return <NonDisclosureAgreement />;
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 border border-border text-muted-foreground rounded-md">
        Content not available.
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#ebebeb] font-serif">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full hover:bg-black/5 transition-colors mb-4"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
        </button>

        {/* Centered folder icon */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-md">
            <Folder className="w-9 h-9 text-white" fill="white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 font-serif">
          Contracts &amp; Documents
        </h1>

        <p className="text-lg font-bold text-[#4a4a6a] mb-3 font-sans">
          Secure Legal Documentation Portal
        </p>

        <p className="text-[#4a4a6a] leading-relaxed mb-12 max-w-3xl font-sans">
          This section contains all official contracts, legal documents, and confidential files related to the artist's career within ZHYT and N-EXIE Entertainment. All documents are encrypted, digitally verified, and legally binding.
        </p>

        {/* Dashboard heading */}
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 font-serif">
          Contract Status Dashboard
        </h2>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-black/5">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#8a93b8] text-white">
              <tr>
                <th className="py-5 px-8 text-base font-bold font-sans">Document</th>
                <th className="py-5 px-8 text-base font-bold font-sans text-center">Status</th>
                <th className="py-5 px-8 text-base font-bold font-sans text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : contracts.map((c, i) => {
                const signed = c.status?.includes("Signed");
                return (
                  <tr key={c.id || i} className={`${i !== contracts.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50/60 transition-colors`}>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#4a4a6a] shrink-0" />
                        <span className="text-[#1a1a1a] font-sans">{c.title}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className={`font-sans inline-flex items-center gap-1.5 ${signed ? 'text-emerald-600 font-semibold' : 'text-[#4a4a6a]'}`}>
                        {signed && <CheckCircle2 className="w-4 h-4" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <button
                        onClick={() => handleActionClick(c)}
                        className="font-bold text-[#1a1a1a] hover:underline font-sans"
                      >
                        view
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedContract?.title}</DialogTitle>
            <DialogDescription>
              Please read the contract carefully before signing.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[60vh] my-4 rounded-md">
            {renderContractContent(selectedContract?.title)}
          </div>

          {!selectedContract?.status.includes("Signed") ? (
            <DialogFooter className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm font-medium leading-none">
                    I have read and agree to the contract terms.
                  </Label>
                </div>
                <Input
                  placeholder="Type your full name as signature..."
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                />
              </div>
              <Button onClick={handleSignContract} disabled={!agreedToTerms || !signatureName.trim() || isSigning} className="w-full sm:w-auto">
                {isSigning ? "Signing..." : "Sign Contract"}
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter>
              <div className="w-full text-center text-sm text-green-700 font-semibold p-4 bg-green-50 rounded-md border border-green-200 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Document {selectedContract.status.toLowerCase()}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
