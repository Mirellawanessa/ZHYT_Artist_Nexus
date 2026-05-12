import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface SignatureBlockProps {
  title?: string;
  artistRoleLabel?: string;
  companyRoleLabel?: string;
  companyTitle?: string;
  isSigned: boolean;
  signatureName?: string | null;
  signedDate?: string | null;
  onSign: (name: string) => void;
  isSigning?: boolean;
}

export const SignatureBlock = ({
  title = "Signatures",
  artistRoleLabel = "Artist",
  companyRoleLabel = "N-EXIE Entertainment",
  companyTitle = "Legal Representative",
  isSigned,
  signatureName,
  signedDate,
  onSign,
  isSigning = false,
}: SignatureBlockProps) => {
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);

  const formatDate = (d?: string | null) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric"
      });
    } catch {
      return d;
    }
  };
  const displayDate = formatDate(signedDate);

  return (
    <section className="pt-10 pb-6 border-t border-slate-300 mt-8">
      <h3 className="text-xl font-bold mb-8 text-slate-900 text-center">{title}</h3>
      <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto mb-10">
        {/* Artist column */}
        <div>
          <p className="font-bold mb-10 text-slate-900">{artistRoleLabel}</p>
          <div className="border-b border-slate-400 mb-2 h-8 flex items-end">
            {isSigned && (
              <span className="font-serif italic text-lg text-slate-900 pb-1">
                {signatureName}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">Signature</p>
          <p className="text-sm text-slate-600 mt-3">
            Name: <span className="font-medium text-slate-900">{isSigned ? signatureName : "___________________________"}</span>
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Date: <span className="font-medium text-slate-900">{isSigned ? displayDate : "_________________________"}</span>
          </p>
        </div>

        {/* Company column */}
        <div>
          <p className="font-bold mb-10 text-slate-900">{companyRoleLabel}</p>
          <div className="border-b border-slate-400 mb-2 h-8 flex items-end">
            {isSigned && (
              <span className="font-serif italic text-lg text-slate-900 pb-1">
                Henrique Euler
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">Signature</p>
          <p className="text-sm text-slate-600 mt-3">
            Name: <span className="font-medium text-slate-900">Henrique Euler</span>
          </p>
          <p className="text-sm text-slate-600 mt-2">Title: {companyTitle}</p>
          <p className="text-sm text-slate-600 mt-2">
            Date: <span className="font-medium text-slate-900">{isSigned ? displayDate : "_________________________"}</span>
          </p>
        </div>
      </div>

      {!isSigned ? (
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-md p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-900 text-center">Sign this document</p>
          <Input
            placeholder="Type your full name as digital signature"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white"
          />
          <div className="flex items-center gap-2">
            <Checkbox id="agree-doc" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} />
            <Label htmlFor="agree-doc" className="text-sm text-slate-700 leading-tight">
              I have read and agree to the contract terms. My electronic signature carries the same legal effect as a handwritten signature.
            </Label>
          </div>
          <Button
            onClick={() => onSign(name.trim())}
            disabled={!agreed || !name.trim() || isSigning}
            className="w-full"
          >
            {isSigning ? "Signing..." : "Sign Contract"}
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center text-sm text-emerald-700 font-semibold p-4 bg-emerald-50 rounded-md border border-emerald-200 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Document signed on {displayDate} by {signatureName}
        </div>
      )}
    </section>
  );
};

export default SignatureBlock;
