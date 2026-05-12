import React from 'react';
import SignatureBlock from './SignatureBlock';

interface ContractProps {
  isSigned?: boolean;
  signatureName?: string | null;
  signedDate?: string | null;
  onSign?: (name: string) => void;
  isSigning?: boolean;
}

const AIOperatedContract = ({ isSigned = false, signatureName, signedDate, onSign = () => {}, isSigning = false }: ContractProps) => {
  return (
    <div className="bg-[#FAFAFA] text-slate-800 p-8 md:p-12 font-serif rounded-lg shadow-inner max-w-4xl mx-auto border border-slate-200">
      <div className="text-center mb-10 border-b-2 border-slate-300 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">N-EXIE AI-OPERATED HUMAN ARTIST CONTRACT</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">Confidential Legal Document</p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        {/* Intro */}
        <section className="bg-slate-100 p-6 rounded-md border border-slate-200 text-sm">
          <h2 className="font-bold text-lg mb-4 text-slate-900 border-b border-slate-300 pb-2">AI-Based Identity Representation Agreement</h2>
          <p className="mb-2">This Agreement is entered into between:</p>
          <p className="font-semibold text-slate-900">N-EXIE Entertainment Pte. Ltd., a company incorporated under the laws of Singapore, with its registered office at [Address] (“Company”),</p>
          <p className="my-2">and</p>
          <p className="font-semibold text-slate-900">[Full Legal Name], residing at [Address] (“Counterparty”),</p>
          <p className="mt-4"><span className="font-semibold">Effective Date:</span> [Date]</p>
          <p className="mt-2 text-slate-600 italic">The Counterparty shall be referred to as the “Artist” for the purposes of this Agreement.</p>
        </section>

        {/* 1. Purpose */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">1. Purpose</h3>
          <p>This Agreement defines the terms under which the Artist operates within N-EXIE as a human individual represented primarily through artificial intelligence systems, forming a digitally mediated artistic identity.</p>
        </section>

        {/* 2. Identity Model */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">2. Identity Model</h3>
          <p className="mb-3">The Artist is classified as an AI-Operated Human Artist, meaning:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>The Artist is a real human individual</li>
            <li>The Artist's public presence is primarily executed through AI systems</li>
            <li>A digital identity ("Digital Persona") represents the Artist across platforms</li>
          </ul>
        </section>

        {/* 3. Digital Persona */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">3. Digital Persona</h3>
          <p className="mb-3">The Company shall create and manage a Digital Persona based on the Artist, which will serve as the primary representation of the Artist across all platforms.</p>
          <p className="mb-3 font-semibold">The Digital Persona may include:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
            <li>visual representation (avatar or virtual likeness)</li>
            <li>synthesized or enhanced voice</li>
            <li>behavioral and personality systems</li>
            <li>narrative and branding elements</li>
          </ul>

          <div className="space-y-6 pl-4 border-l-2 border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900">3.1 Origin of the Digital Persona</h4>
              <p className="mb-2">The Digital Persona shall, by default, be directly based on the Artist's real identity. This includes:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li>visual appearance derived from the Artist</li>
                <li>voice based on the Artist's natural voice</li>
                <li>behavioral traits inspired by the Artist's personality</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3.2 Exceptions to Direct Representation</h4>
              <p className="mb-2">The Digital Persona may differ from the Artist's real identity under the following circumstances:</p>
              <div className="pl-4 space-y-3 mt-2">
                <div>
                  <span className="font-semibold">a) Artist Decision:</span> When the Artist chooses to not use their real appearance, not use their natural voice, or maintain anonymity or privacy.
                </div>
                <div>
                  <span className="font-semibold">b) Personal or Physical Conditions:</span> When physical, medical, or personal conditions limit or prevent the use of the Artist's real identity.
                </div>
                <div>
                  <span className="font-semibold">c) Creative Direction:</span> When necessary for artistic concept development, brand positioning, or aesthetic differentiation.
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3.3 Alternative Representation</h4>
              <p>In such cases, the Company may create a Digital Persona that is inspired by the Artist, partially based on the Artist, or entirely original. Such representation requires the Artist's approval.</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3.4 Pre-Existing AI Identity</h4>
              <p>If the Artist already owns a pre-existing digital identity or AI system: the Company may integrate it into the N-EXIE ecosystem; ownership and usage rights shall be defined in a separate agreement; original ownership shall be respected, unless otherwise agreed.</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3.5 Consent and Control</h4>
              <p>Regardless of the model adopted: the Artist must approve the creation of the Digital Persona; significant changes require prior consent; usage must comply with agreed identity boundaries.</p>
            </div>
          </div>
        </section>

        {/* 4. Ownership Structure */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">4. Ownership Structure</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">4.1 Human Identity</h4>
              <p>Owned exclusively by the Artist.</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">4.2 Digital Persona</h4>
              <p className="mb-2">Owned by the Company. Includes:</p>
              <ul className="list-disc pl-5 text-sm text-slate-700">
                <li>avatar and visual systems</li>
                <li>AI-generated voice</li>
                <li>behavioral models</li>
                <li>digital outputs</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-slate-900">4.3 Usage Limitation</h4>
            <p>The Digital Persona may only be commercially used during the validity of this Agreement, unless otherwise agreed in writing.</p>
          </div>
        </section>

        {/* Rest of clauses up to 22 */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">5. AI Operation and Control</h3>
            <p className="mb-2">The Company has the right to:</p>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>operate the Digital Persona across platforms</li>
              <li>generate content using AI systems</li>
              <li>scale the Artist's presence globally</li>
              <li>manage automation and interaction systems</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">6. Artist Rights and Protections</h3>
            <p className="mb-2">The Artist has the right to:</p>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>be informed about how their Digital Persona is used</li>
              <li>approve sensitive or high-impact uses</li>
              <li>request adjustments to identity representation</li>
              <li>participate in strategic decisions affecting their image</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">7. AI Usage Boundaries</h3>
            <p className="mb-2">The Company agrees that the Digital Persona shall not:</p>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>represent opinions that damage the Artist's reputation</li>
              <li>simulate unauthorized personal behavior</li>
              <li>be used in sensitive or controversial scenarios without consent</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-slate-900">8. Revenue Structure</h3>
            <div className="space-y-2 text-sm text-slate-700 bg-white p-4 border border-slate-200 rounded">
              <p><span className="font-semibold text-slate-900">8.1 Phase 1 — Investment Recovery:</span> 70% Company / 30% Artist</p>
              <p><span className="font-semibold text-slate-900">8.2 Phase 2 — Growth:</span> 60% Company / 40% Artist</p>
              <p><span className="font-semibold text-slate-900">8.3 Phase 3 — Established:</span> 50% Company / 50% Artist</p>
              <div className="pt-2 border-t border-slate-200 mt-2">
                <p className="font-semibold text-slate-900 mb-1">8.4 Revenue by Type:</p>
                <ul className="list-disc pl-5">
                  <li>Digital/AI content → 70% Company / 30% Artist</li>
                  <li>Brand deals → 50% / 50%</li>
                  <li>Virtual performances → 60% Company / 40% Artist</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-slate-100 p-6 rounded-md border border-slate-200 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2 text-slate-900">9. Payment Terms</h3>
            <ul className="list-disc pl-5 text-slate-700">
              <li>Payments made quarterly</li>
              <li>Financial reports provided</li>
              <li>Currency: USD (unless otherwise agreed)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-slate-900">10. Exclusivity</h3>
            <p className="text-slate-700">The Artist agrees to exclusive representation by the Company during the term of this Agreement.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-slate-900">11. Content Ownership</h3>
            <p className="text-slate-700">All content produced through the Digital Persona belongs to the Company.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-slate-900">12. Data & Biometric Use</h3>
            <p className="mb-1 text-slate-700">The Artist consents to the controlled use of voice data, facial references, and behavioral input.</p>
            <p className="text-xs italic text-slate-500">Strictly for Digital Persona development and operation.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-slate-900">13. Data Protection & Security</h3>
            <ul className="list-disc pl-5 text-slate-700">
              <li>protect all biometric and identity data</li>
              <li>prevent unauthorized access or misuse</li>
              <li>implement cybersecurity measures against deepfakes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-slate-900">14. AI Autonomy</h3>
            <p className="mb-1 text-slate-700">The Digital Persona may operate under:</p>
            <ul className="list-disc pl-5 text-slate-700">
              <li>Controlled mode</li>
              <li>Semi-autonomous mode</li>
              <li>Autonomous mode (within defined limits)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">15. Liability</h3>
            <ul className="list-disc pl-5 text-slate-700">
              <li>The Company is responsible for technical failures of AI systems</li>
              <li>The Artist agrees to cooperate in public image management when required</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">16. Term</h3>
            <p className="mb-2">The duration of this Agreement shall be:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-700 grid md:grid-cols-2 gap-2">
              <li>7 years for idols/groups</li>
              <li>5–7 years for solo artists</li>
              <li>5–7 years for actors and actresses</li>
              <li>3–5 years for influencers and creators</li>
              <li>3–5 years for models and visual talents</li>
            </ul>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900">16.1 Review:</span> Mandatory review in Year 3. Optional review in Year 5.
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900">16.2 Renewal:</span> Subject to mutual agreement.
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">17. Termination</h3>
            <p className="mb-2">Upon termination:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-slate-300 pl-4 bg-white p-3 rounded-r">
                <span className="font-semibold block mb-1 text-slate-900">The Artist retains:</span>
                <p className="text-slate-700">full human identity rights</p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4 bg-white p-3 rounded-r">
                <span className="font-semibold block mb-1 text-slate-900">The Company:</span>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  <li>retains all produced content</li>
                  <li>must permanently deactivate the Digital Persona</li>
                  <li>may not continue use without a new agreement</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final clauses grid */}
        <section className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900">18. Confidentiality</h3>
            <p className="text-sm text-slate-700">The Artist agrees not to disclose AI systems, internal processes, or proprietary technology.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">19. Force Majeure</h3>
            <p className="text-sm text-slate-700">Neither party is liable for events beyond control.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">20. Dispute Resolution</h3>
            <p className="text-sm text-slate-700">Governed by the laws of Singapore. Resolved through international arbitration.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">21. Amendments & 22. Entire Agreement</h3>
            <p className="text-sm text-slate-700">All changes must be made in writing. This document represents the full agreement between both parties.</p>
          </div>
        </section>

        {/* Signature Section */}
        <SignatureBlock
          title="21. Signatures"
          artistRoleLabel="Artist"
          companyRoleLabel="N-EXIE Entertainment Pte. Ltd."
          companyTitle="Legal Representative"
          isSigned={isSigned}
          signatureName={signatureName}
          signedDate={signedDate}
          onSign={onSign}
          isSigning={isSigning}
        />

        {/* APPENDIX */}
        <section className="mt-16 pt-12 border-t border-slate-300">
          <div className="text-center mb-10 bg-slate-900 text-white py-6 rounded-md shadow-md">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 uppercase">4.5.X Music Appendix — AXS Group Member</h2>
            <p className="text-slate-300 font-semibold uppercase tracking-widest text-xs">Contract Appendix – Music Division (AXS Project)</p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-200 pb-2">1. Scope</h3>
              <p className="mb-3">This Appendix applies to:</p>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-slate-500">Artist:</span> <span className="font-semibold text-slate-900">Andressa Correia Morais</span>
                <span className="text-slate-500">Project:</span> <span className="font-semibold text-slate-900">AXS</span>
                <span className="text-slate-500">Group Owner:</span> <span className="font-semibold text-slate-900">ZHYT SONG</span>
                <span className="text-slate-500">Managing Entity:</span> <span className="font-semibold text-slate-900">N-EXIE Entertainment</span>
                <span className="text-slate-500">Division:</span> <span className="font-semibold text-slate-900">N-EXIE Music</span>
              </div>
              <p className="mt-4 text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">This document defines the operational, creative, and commercial structure of the Artist's participation as a member of the AXS group under an intercompany collaboration model.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-5 border border-slate-200 rounded-md">
                <h3 className="font-bold text-slate-900 mb-3">2. Identity Model</h3>
                <p className="mb-2">The Artist operates under: <span className="font-semibold text-slate-900 block mt-1">AI-Operated Human Artist Model</span></p>
                <ul className="list-disc pl-5 text-sm text-slate-700 mt-3 space-y-1">
                  <li>Primary presence through AI-based persona</li>
                  <li>No direct use of real face or voice</li>
                  <li>Original AI persona inspired by the Artist's personality</li>
                  <li>Fully compliant with AI Identity Consent Form</li>
                </ul>
              </div>

              <div className="bg-white p-5 border border-slate-200 rounded-md">
                <h3 className="font-bold text-slate-900 mb-3">3. Group Structure</h3>
                <p className="font-semibold text-sm text-slate-900">3.1 Composition</p>
                <p className="text-sm text-slate-700 mb-4">AXS may include: AI-Operated artists, Hybrid artists, AI Entities</p>
                <p className="font-semibold text-sm text-slate-900">3.2 Artist Role (Andressa)</p>
                <p className="text-sm text-slate-700">Visual Direction Core, Concept Identity Anchor, Digital Presence Lead</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">4. Performance Model</h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 mb-3 space-y-1">
                  <li>Fully AI-generated performances</li>
                  <li>Virtual concerts and digital experiences</li>
                  <li>Music videos and cinematic productions</li>
                  <li>AI-based fan interaction systems</li>
                </ul>
                <div className="bg-slate-100 p-2 text-center rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">No physical performance obligation unless otherwise agreed.</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">5. Training & Development</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div className="bg-white p-3 border border-slate-200 rounded">
                    <p className="font-semibold mb-2 text-slate-900">5.1 AI Development</p>
                    <ul className="text-slate-700 list-disc pl-4 space-y-1 text-xs">
                      <li>Personality modeling</li>
                      <li>Behavioral training</li>
                      <li>Interaction systems</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 rounded">
                    <p className="font-semibold mb-2 text-slate-900">5.2 Artistic</p>
                    <ul className="text-slate-700 list-disc pl-4 space-y-1 text-xs">
                      <li>Creative direction</li>
                      <li>Brand positioning</li>
                      <li>Identity development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-md shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">6. Content Production</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-sm mb-2 text-slate-900">Includes:</p>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                      <li>Music production</li>
                      <li>Music videos</li>
                      <li>Promotional & Social media content</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2 text-slate-900">Responsibilities:</p>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li><span className="font-bold text-slate-900">ZHYT SONG:</span> music production and group direction</li>
                      <li><span className="font-bold text-slate-900">N-EXIE:</span> AI identity and digital presence</li>
                    </ul>
                  </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">7. Revenue Structure</h3>
                <p className="text-sm text-slate-700 mb-2"><span className="font-semibold text-slate-900">Sources:</span> Streaming, Digital performances, Brand partnerships, Merchandise, Licensing</p>
                <p className="text-sm text-slate-700"><span className="font-semibold text-slate-900">Distribution:</span> N-EXIE Entertainment, ZHYT SONG, The Artist. Specific terms will be defined in the primary contract and intercompany agreements.</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">8. Group Intellectual Property</h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  <li>The group AXS is owned by ZHYT SONG</li>
                  <li>All group-related IP belongs to ZHYT SONG unless otherwise agreed</li>
                  <li>N-EXIE retains ownership over: AI systems, digital identity, underlying technology</li>
                  <li>The Artist holds no ownership over the group IP</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-900 mb-2 text-sm">9. Identity Control</h3>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                  <li>AI persona exclusively managed by N-EXIE</li>
                  <li>Visual identity must align with group standards</li>
                  <li>External use requires prior approval</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-900 mb-2 text-sm">10. Exclusivity</h3>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                  <li>Exclusivity in music activities related to AXS</li>
                  <li>No participation in other groups without approval</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-900 mb-2 text-sm">11. Expansion Rights</h3>
                <p className="text-xs text-slate-700">The Artist may expand into Acting (N-EXIE Studios), Modeling (N-EXIE Visual), Digital influencing (N-EXIE Creators). Subject to intercompany approval when involving AXS.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">12. AI Autonomy Level</h3>
                <p className="text-sm text-slate-700">Classification: <span className="font-bold text-slate-900 bg-slate-200 px-1 rounded">Controlled AI</span></p>
                <p className="text-xs text-slate-500 mt-2">All outputs require approval. No independent public operation.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">13. Term</h3>
                <p className="text-sm text-slate-700">During the Artist's participation in AXS. Until formal termination or replacement.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">14. Governing Law</h3>
                <p className="text-sm text-slate-700">Governed by the laws of Singapore.</p>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-6 rounded-md shadow-lg mt-8">
              <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">15. Intercompany Structure</h3>
              <p className="text-sm mb-4 text-slate-300">The Artist is contracted by N-EXIE Entertainment. Participation in AXS occurs through collaboration with ZHYT SONG.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                  <p className="font-bold text-white text-sm mb-2 text-center border-b border-slate-600 pb-2">N-EXIE Entertainment</p>
                  <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                    <li>Artist management</li>
                    <li>AI operation</li>
                    <li>Identity development</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                  <p className="font-bold text-white text-sm mb-2 text-center border-b border-slate-600 pb-2">ZHYT SONG</p>
                  <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                    <li>Group management</li>
                    <li>Music production</li>
                    <li>Project direction</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default AIOperatedContract;
