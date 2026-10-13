import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, User, Download, Share2, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export function DigitalTicketPass({ registration, onClose }) {
  if (!registration) return null;

  // Generate .ics calendar file for download
  const downloadICS = () => {
    const title = registration.eventTitle;
    const dateFormatted = (registration.eventDate || '').replace(/-/g, '');
    const startTimeClean = (registration.eventStartTime || '09:00').replace(':', '') + '00';
    const endTimeClean = (registration.eventEndTime || '17:00').replace(':', '') + '00';
    const startDT = `${dateFormatted}T${startTimeClean}`;
    const endDT = `${dateFormatted}T${endTimeClean}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusPulse//Campus Event Pass//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:CampusPulse Digital Event Pass for ${registration.userName}. Seat: ${registration.seatNumber}. Token: ${registration.qrCodeToken}`,
      `LOCATION:${registration.eventVenue}`,
      `DTSTART:${startDT}`,
      `DTEND:${endDT}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.substring(0, 20)}_Pass.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCheckedIn = registration.status === 'attended';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header Graphic */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-200 mb-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              OFFICIAL CAMPUSPULSE PASS
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isCheckedIn ? 'bg-emerald-400 text-slate-950' : 'bg-indigo-300/20 text-indigo-100 border border-indigo-300/30'
            }`}>
              {isCheckedIn ? 'Checked In' : 'Active Pass'}
            </span>
          </div>

          <h2 className="text-lg font-extrabold leading-tight tracking-tight text-white line-clamp-2">
            {registration.eventTitle}
          </h2>

          <div className="flex items-center gap-4 mt-3 text-xs text-indigo-200">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{registration.eventDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{registration.eventStartTime}</span>
            </div>
          </div>
        </div>

        {/* Ticket Perforated Divider */}
        <div className="relative flex items-center justify-between px-4 py-2 bg-slate-950">
          <div className="w-5 h-5 -ml-6 rounded-full bg-slate-950 border-r border-slate-700" />
          <div className="w-full border-t border-dashed border-slate-700 mx-2" />
          <div className="w-5 h-5 -mr-6 rounded-full bg-slate-950 border-l border-slate-700" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 bg-slate-900/90 text-slate-200">
          {/* QR Code Presentation Box */}
          <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-slate-900 shadow-xl ring-4 ring-indigo-500/20">
            <QRCodeSVG
              value={registration.qrCodeToken}
              size={180}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <p className="mt-2 font-mono text-[11px] font-bold tracking-wider text-slate-700">
              {registration.qrCodeToken}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Present this QR to event staff for instant check-in
            </p>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold">Attendee</p>
              <p className="font-bold text-white truncate">{registration.userName}</p>
              <p className="text-[11px] text-slate-400 font-mono">{registration.userRoll}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold">Allocated Seat</p>
              <p className="font-extrabold text-indigo-300 text-sm">{registration.seatNumber || 'Free Seating'}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </p>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium text-slate-300">{registration.eventVenue}</span>
              </span>
              <span className="font-mono text-slate-400">ID: #{registration.id.slice(-6)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={downloadICS}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
