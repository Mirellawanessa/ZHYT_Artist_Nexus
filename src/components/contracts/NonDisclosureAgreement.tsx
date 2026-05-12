import React from 'react';
import SignatureBlock from './SignatureBlock';

interface ContractProps {
  isSigned?: boolean;
  signatureName?: string | null;
  signedDate?: string | null;
  onSign?: (name: string) => void;
  isSigning?: boolean;
}

const NonDisclosureAgreement = ({ isSigned = false, signatureName, signedDate, onSign = () => {}, isSigning = false }: ContractProps) => {
  return (
    <div className="bg-[#FAFAFA] text-slate-800 p-8 md:p-12 font-serif rounded-lg shadow-inner max-w-4xl mx-auto border border-slate-200">
      <div className="text-center mb-10 border-b-2 border-slate-300 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">NON-DISCLOSURE AGREEMENT (NDA)</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">Confidentiality and Non-Disclosure Agreement</p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        {/* 1. Parties */}
        <section className="bg-slate-100 p-6 rounded-md border border-slate-200 text-sm">
          <h2 className="font-bold text-lg mb-4 text-slate-900 border-b border-slate-300 pb-2">1. Parties</h2>
          <p className="mb-4">This Non-Disclosure Agreement (“Agreement”) is entered into on this ___ day of _______, 20__, by and between:</p>
          
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-slate-900 text-base">N-EXIE Entertainment (Next Existence Entertainment)</p>
              <p>Represented by its Legal & Business Affairs Division</p>
              <p>Email: legal.nexieentertainment@outlook.com</p>
            </div>
            
            <p className="font-bold text-center text-slate-500 uppercase tracking-widest">and</p>
            
            <div>
              <p className="font-semibold text-slate-900 text-base">Andressa Correia Morais</p>
              <p>Email: dessacorreiia@gmail.com</p>
            </div>
          </div>
          
          <p className="mt-6 italic text-slate-600">Collectively referred to as the “Parties.”</p>
        </section>

        {/* 2. Purpose */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">2. Purpose</h3>
          <p>The purpose of this Agreement is to protect confidential and proprietary information shared during the development of AI-based artistic projects and contractual negotiations.</p>
        </section>

        {/* 3. Definition of Confidential Information */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">3. Definition of Confidential Information</h3>
          <p className="mb-3">Confidential Information includes, but is not limited to:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Business strategies and financial data</li>
              <li>AI technologies and proprietary systems</li>
              <li>Digital identity designs and concepts</li>
            </ul>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Contracts, proposals, and legal documents</li>
              <li>Creative materials and intellectual property</li>
            </ul>
          </div>
        </section>

        {/* 4. Obligations of Confidentiality */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">4. Obligations of Confidentiality</h3>
          <p className="mb-3">The Receiving Party agrees to:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Maintain strict confidentiality</li>
            <li>Not disclose any information without written authorization</li>
            <li>Use the information solely for evaluation and collaboration purposes</li>
          </ul>
        </section>

        {/* 5. Exclusions */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">5. Exclusions</h3>
          <p className="mb-3">Confidential Information does not include information that:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Is publicly available</li>
            <li>Was already known prior to disclosure</li>
            <li>Is required to be disclosed by law</li>
          </ul>
        </section>

        {/* 6. Term & 7. Governing Law */}
        <section className="grid md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-md border border-slate-200">
          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">6. Term</h3>
            <p className="text-slate-700">This Agreement shall remain in effect for <span className="font-bold">5 years</span> from the date of signature.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">7. Governing Law</h3>
            <p className="text-slate-700">This Agreement shall be governed by the laws of <span className="font-bold">Singapore</span>.</p>
          </div>
        </section>

        <SignatureBlock
          title="8. Signatures"
          artistRoleLabel="Receiving Party (Artist)"
          companyRoleLabel="N-EXIE Entertainment"
          companyTitle="Legal Representative"
          isSigned={isSigned}
          signatureName={signatureName}
          signedDate={signedDate}
          onSign={onSign}
          isSigning={isSigning}
        />
      </div>
    </div>
  );
};

export default NonDisclosureAgreement;
