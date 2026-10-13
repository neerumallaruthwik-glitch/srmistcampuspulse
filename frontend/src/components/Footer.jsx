import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, X } from 'lucide-react';

export function Footer() {
  const [activeModal, setActiveModal] = useState(null); // 'about', 'help', 'contact', 'privacy', 'terms'

  return (
    <>
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Academic Statement */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-base font-extrabold text-white tracking-tight">SRM CampusPulse</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart Campus Event Hub & Hosting Pipeline proposed for the SRM Institute of Science and Technology, Ramapuram campus community.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                ⚠️ <strong>Prototype Note:</strong> Demonstration project. Not officially endorsed or operated by SRM IST.
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Navigation</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-white transition-colors">About CampusPulse</button></li>
                <li><button onClick={() => setActiveModal('help')} className="hover:text-white transition-colors">Help & Support</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors">Contact Directory</button></li>
              </ul>
            </div>

            {/* Column 3: Legal & Governance */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Policies & Compliance</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms & Conditions</button></li>
                <li><span className="text-slate-500">Student Code of Conduct</span></li>
              </ul>
            </div>

            {/* Column 4: Campus Location */}
            <div className="space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Campus Location</h4>
              <div className="space-y-1.5 text-slate-400 text-xs">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>SRM IST, Bharathi Salai, Ramapuram, Chennai, Tamil Nadu 600089</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>campuspulse-support@srmist.edu.in</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>+91 44 2249 2882</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 SRM CampusPulse. Academic Technology Platform Prototype.</p>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">React 19 + TypeScript</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Node.js Express</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">QR Engine</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy and Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">{activeModal.replace('-', ' ')}</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              {activeModal === 'about' && (
                <>
                  <p><strong>SRM CampusPulse</strong> is a proposed smart campus event hub and hosting pipeline conceived to resolve the chaos of fragmented WhatsApp groups, physical notices, and spreadsheets at SRM IST Ramapuram.</p>
                  <p>It unifies event discovery, AI poster extraction, venue conflict detection, administrative approval workflows, anti-duplicate QR attendance check-in, and automated certificate issuance.</p>
                </>
              )}
              {activeModal === 'help' && (
                <>
                  <p><strong>Need help registering or hosting?</strong></p>
                  <p>• <strong>Students:</strong> Select any approved event, review eligibility, and click Register Now to receive your instant cryptographic QR ticket.</p>
                  <p>• <strong>Organizers:</strong> Use the Organizer Portal to upload posters or draft event proposals for Dean approval.</p>
                  <p>• <strong>Event Staff:</strong> Launch the QR Attendance Desk to scan tickets and prevent duplicate entries.</p>
                </>
              )}
              {activeModal === 'contact' && (
                <>
                  <p><strong>Campus Administration & Club Advisory:</strong></p>
                  <p>Office of the Dean, Student Affairs, Administrative Block 1st Floor, SRM IST Ramapuram Campus.</p>
                  <p>Email: dean.studentaffairs@srmist.edu.in | Helpdesk: +91 44 2249 2882</p>
                </>
              )}
              {activeModal === 'privacy' && (
                <>
                  <p><strong>Privacy Policy & Data Security:</strong></p>
                  <p>SRM CampusPulse stores only student identifiers (registration number, institutional email, department) necessary for event tickets and certificate issuance. No financial data or card numbers are stored on application servers.</p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p><strong>Terms and Conditions:</strong></p>
                  <p>All participants must adhere to university academic decorum. Event tickets are non-transferable and verified at gate entry through non-guessable cryptographic tokens.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
