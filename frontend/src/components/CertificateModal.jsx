import React from 'react';
import { Award, Download, Printer, ShieldCheck, X, CheckCircle, ExternalLink } from 'lucide-react';

export function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Actions */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>VERIFIED DIGITAL CREDENTIAL • SRM CAMPUSPULSE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Parchment Design */}
        <div className="p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-8 border-slate-800 m-4 rounded-2xl relative text-center space-y-6">
          {/* Watermark / Badge */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border-2 border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Award className="w-8 h-8 text-amber-400" />
          </div>

          {/* Institution Header */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-400">
              SRM INSTITUTE OF SCIENCE AND TECHNOLOGY
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              RAMAPURAM CAMPUS, CHENNAI • DIRECTORATE OF STUDENT AFFAIRS
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide pt-2">
              Certificate of Attendance & Participation
            </h2>
            <p className="text-xs text-slate-400 italic">This is proudly presented to</p>
          </div>

          {/* Student Name */}
          <div className="border-b border-amber-500/30 pb-3 max-w-md mx-auto">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200">
              {certificate.userName}
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Registration No: <strong className="text-amber-300">{certificate.userRegNo}</strong> • {certificate.department}
            </p>
          </div>

          {/* Event description */}
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            for verified attendance and successful completion of the campus technical / cultural initiative{' '}
            <strong className="text-white font-semibold">"{certificate.eventTitle}"</strong> held on{' '}
            <strong className="text-amber-300 font-semibold">{certificate.eventDate}</strong> at SRM Institute of Science and Technology, Ramapuram.
          </p>

          {/* Verification Hash & Signatures */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono block">Certificate Number:</span>
              <p className="text-xs font-mono font-bold text-slate-300">{certificate.certificateNumber}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Hash: {certificate.verificationHash?.slice(0, 22)}...</span>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <p className="font-serif italic text-amber-200 text-sm">{certificate.issuedBy || 'Dean of Student Affairs'}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Authorized Academic Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            This digital credential is tied to verified server check-in records on the SRM CampusPulse platform.
          </p>
        </div>
      </div>
    </div>
  );
}
