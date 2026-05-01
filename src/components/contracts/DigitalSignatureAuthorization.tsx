import React from 'react';

const DigitalSignatureAuthorization = () => {
  return (
    <div className="bg-[#FAFAFA] text-slate-800 p-8 md:p-12 font-serif rounded-lg shadow-inner max-w-4xl mx-auto border border-slate-200">
      <div className="text-center mb-10 border-b-2 border-slate-300 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">DIGITAL SIGNATURE AUTHORIZATION</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">N-EXIE Entertainment (Next Existence Entertainment)</p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        {/* 1. Purpose */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">1. Purpose</h3>
          <p className="mb-2">This Digital Signature Authorization (“Authorization”) establishes the legal validity, acceptance, and enforceability of electronic signatures used within the N-EXIE ecosystem.</p>
          <p>By agreeing to this Authorization, the signing party acknowledges that electronic signatures carry the same legal effect as handwritten signatures.</p>
        </section>

        {/* 2. Acceptance of Electronic Signatures */}
        <section className="bg-slate-50 p-6 rounded-md border border-slate-200">
          <h3 className="text-xl font-bold mb-3 text-slate-900">2. Acceptance of Electronic Signatures</h3>
          <p className="mb-3">The signing party agrees that:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Electronic signatures are legally binding</li>
            <li>Digital execution of contracts is valid and enforceable</li>
            <li>No physical signature is required for contract validity</li>
            <li>Consent is given to conduct business electronically</li>
          </ul>
        </section>

        {/* 3. Scope of Application & 4. Signature Methods */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-lg font-bold mb-3 text-slate-900">3. Scope of Application</h3>
            <p className="mb-3">This Authorization applies to all documents within N-EXIE, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li>Artist Contracts</li>
              <li>Contract Appendices</li>
              <li>Non-Disclosure Agreements (NDA)</li>
              <li>AI Identity Consent Forms</li>
              <li>Internal approvals and legal acknowledgments</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-3 text-slate-900">4. Signature Methods</h3>
            <p className="mb-3">Accepted forms of digital signature include:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 mb-3">
              <li>Typed full legal name</li>
              <li>Secure click-to-sign system</li>
              <li>Platform-based authentication (login-protected signature)</li>
              <li>Cryptographic or encrypted signature systems</li>
            </ul>
            <p className="text-xs italic text-slate-500 border-l-2 border-slate-300 pl-2">All methods are recognized as valid under this Authorization.</p>
          </section>
        </div>

        {/* 5. Identity Verification */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">5. Identity Verification</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2 font-semibold">The signing party confirms that:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li>They are the authorized individual signing the document</li>
                <li>All provided information is accurate</li>
                <li>The signature is executed voluntarily</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold">N-EXIE reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li>Verify identity through email, phone, or platform authentication</li>
                <li>Request additional verification if necessary</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Security & Integrity & 7. Audit Trail */}
        <div className="grid md:grid-cols-2 gap-8 bg-slate-100 p-6 rounded-md border border-slate-200">
          <section>
            <h3 className="text-lg font-bold mb-3 text-slate-900">6. Security & Integrity</h3>
            <p className="mb-2">N-EXIE ensures that:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 text-sm">
              <li>All signed documents are securely stored</li>
              <li>Data is protected through encrypted systems</li>
              <li>Documents cannot be altered after execution</li>
              <li>An audit trail is generated for all signatures</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-3 text-slate-900">7. Audit Trail & Record Keeping</h3>
            <p className="mb-2">Each signed document will include:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 text-sm mb-3">
              <li>Timestamp of signature</li>
              <li>IP address and/or device identification</li>
              <li>User authentication record</li>
              <li>Document version reference</li>
            </ul>
            <p className="font-semibold text-sm">These records serve as official legal evidence.</p>
          </section>
        </div>

        {/* 8. Withdrawal of Consent */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">8. Withdrawal of Consent</h3>
          <p className="mb-2">The signing party may withdraw consent to electronic signatures by:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700 mb-3">
            <li>Providing written notice to N-EXIE</li>
          </ul>
          <p className="font-semibold mt-4 mb-2">However:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Withdrawal does not affect previously signed documents</li>
            <li>Future agreements may require alternative execution methods</li>
          </ul>
        </section>

        {/* 9. Governing Law & 10. Legal Effect */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">9. Governing Law</h3>
            <p className="text-slate-700 mb-2">This Authorization is governed by the laws of Singapore.</p>
            <p className="text-slate-700 text-sm">Electronic signatures shall be recognized in accordance with applicable international digital transaction laws.</p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">10. Legal Effect</h3>
            <p className="mb-2">By signing electronically, the party agrees that:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 text-sm">
              <li>The signature is legally binding</li>
              <li>The document is enforceable as a formal agreement</li>
              <li>No additional physical execution is required</li>
            </ul>
          </section>
        </div>

        {/* Authorization & Signature */}
        <section className="pt-10 pb-6 border-t border-slate-200 mt-8">
          <h3 className="text-xl font-bold mb-8 text-slate-900 text-center">Authorization & Signature</h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <div>
              <p className="font-bold mb-10 text-slate-900">Artist / Signatory</p>
              <div className="border-b border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600 mt-2">Full Name: <span className="font-medium text-slate-900">___________________________</span></p>
              <p className="text-sm text-slate-600 mt-2">Signature (Digital): __________________</p>
              <p className="text-sm text-slate-600 mt-2">Date: ________________________________</p>
            </div>
            <div>
              <p className="font-bold mb-10 text-slate-900">N-EXIE Entertainment</p>
              <div className="border-b border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600 mt-2">By: _________________________________</p>
              <p className="text-sm text-slate-600 mt-2">Name: <span className="font-medium text-slate-900">Henrique Euler</span></p>
              <p className="text-sm text-slate-600 mt-2">Title: Legal Representative</p>
              <p className="text-sm text-slate-600 mt-2">Date: ________________________________</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DigitalSignatureAuthorization;
