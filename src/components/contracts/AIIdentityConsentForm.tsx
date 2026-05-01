import React, { useState } from 'react';

const AIIdentityConsentForm = () => {
  const [auth, setAuth] = useState({
    face: null as string | null,
    voice: null as string | null,
    personality: null as string | null,
    likeness: null as string | null,
    artistic: null as string | null,
    inspired: null as string | null,
  });

  const handleOptionChange = (field: keyof typeof auth, value: string) => {
    setAuth((prev) => ({ ...prev, [field]: value }));
  };

  const renderOption = (field: keyof typeof auth) => (
    <div className="flex space-x-6">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name={field}
          value="yes"
          checked={auth[field] === 'yes'}
          onChange={() => handleOptionChange(field, 'yes')}
          className="w-4 h-4 text-slate-900 border-slate-400 focus:ring-slate-900 cursor-pointer accent-slate-900"
        />
        <span className="font-medium">Yes</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name={field}
          value="no"
          checked={auth[field] === 'no'}
          onChange={() => handleOptionChange(field, 'no')}
          className="w-4 h-4 text-slate-900 border-slate-400 focus:ring-slate-900 cursor-pointer accent-slate-900"
        />
        <span className="font-medium">No</span>
      </label>
    </div>
  );

  return (
    <div className="bg-[#FAFAFA] text-slate-800 p-8 md:p-12 font-serif rounded-lg shadow-inner max-w-4xl mx-auto border border-slate-200">
      <div className="text-center mb-10 border-b-2 border-slate-300 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">AI IDENTITY CREATION AND USAGE CONSENT FORM</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">N-EXIE Entertainment</p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        {/* 1. Participant Information */}
        <section className="bg-slate-100 p-6 rounded-md border border-slate-200 text-sm">
          <h2 className="font-bold text-lg mb-4 text-slate-900 border-b border-slate-300 pb-2">1. Participant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-slate-900">Name:</span> Andressa Correia Morais
            </div>
            <div>
              <span className="font-semibold text-slate-900">Email:</span> dessacorreiia@gmail.com
            </div>
          </div>
        </section>

        {/* 2. Purpose */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">2. Purpose</h3>
          <p>This document authorizes N-EXIE Entertainment to create, develop, and manage an artificial intelligence-based digital identity.</p>
        </section>

        {/* 3. Scope of Authorization */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-slate-900">3. Scope of Authorization</h3>
          <p className="mb-4">The Participant authorizes the use of:</p>
          
          <div className="bg-white border border-slate-300 rounded-md overflow-hidden mb-6">
            <div className="grid grid-cols-2 bg-slate-100 p-3 border-b border-slate-300 font-bold text-slate-900">
              <div>Element</div>
              <div>Authorized</div>
            </div>
            <div className="grid grid-cols-2 p-3 border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-800">Face</div>
              {renderOption('face')}
            </div>
            <div className="grid grid-cols-2 p-3 border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-800">Voice</div>
              {renderOption('voice')}
            </div>
            <div className="grid grid-cols-2 p-3 border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-800">Personality Traits</div>
              {renderOption('personality')}
            </div>
            <div className="grid grid-cols-2 p-3 border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-800">Likeness</div>
              {renderOption('likeness')}
            </div>
            <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-800">Artistic Concept</div>
              {renderOption('artistic')}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded border border-slate-200">
            <p className="mb-3 font-medium text-slate-800">If not authorized, the Participant agrees to the creation of an inspired digital identity:</p>
            {renderOption('inspired')}
          </div>
        </section>

        {/* 4. Rights and Ownership */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">4. Rights and Ownership</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>The AI system will be created and operated by N-EXIE.</li>
            <li>Ownership of the AI identity will be defined in the applicable contract.</li>
            <li>The Participant retains rights over their human identity.</li>
          </ul>
        </section>

        {/* 5. Usage Rights */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">5. Usage Rights</h3>
          <p className="mb-3">The AI identity may be used for:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Music and entertainment</li>
            <li>Social media and digital content</li>
            <li>Advertising and branding</li>
            <li>Film, series, and virtual productions</li>
          </ul>
        </section>

        {/* 6. Revocation */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">6. Revocation</h3>
          <p className="text-slate-700">This authorization may only be revoked in accordance with contractual agreements.</p>
        </section>

        {/* 7. Governing Law */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">7. Governing Law</h3>
          <p className="text-slate-700">This Agreement shall be governed by the laws of Singapore.</p>
        </section>

        {/* 8. Signatures */}
        <section className="pt-10 pb-6 border-t border-slate-200 mt-8">
          <h3 className="text-xl font-bold mb-8 text-slate-900 text-center">8. Signatures</h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <div>
              <p className="font-bold mb-10 text-slate-900">Participant (Artist)</p>
              <div className="border-b border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600">Signature: ____________________</p>
              <p className="text-sm text-slate-600 mt-2">Name: <span className="font-medium text-slate-900">Andressa Correia Morais</span></p>
              <p className="text-sm text-slate-600 mt-2">Date: _________________________</p>
            </div>
            <div>
              <p className="font-bold mb-10 text-slate-900">Authorized Representative</p>
              <div className="border-b border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600">By: ___________________________</p>
              <p className="text-sm text-slate-600 mt-2">Name: <span className="font-medium text-slate-900">Henrique Euler</span></p>
              <p className="text-sm text-slate-600 mt-2">Title: Legal Representative (N-EXIE Entertainment)</p>
              <p className="text-sm text-slate-600 mt-2">Date: _________________________</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIIdentityConsentForm;
