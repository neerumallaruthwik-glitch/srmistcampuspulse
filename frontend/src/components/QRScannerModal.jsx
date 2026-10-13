import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  X, 
  Clock, 
  User, 
  ShieldCheck, 
  RefreshCw,
  QrCode
} from 'lucide-react';

export function QRScannerModal({ activeEvent, onClose, onAttendanceUpdated }) {
  const { user, showToast } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);

  // Initialize camera scanner
  useEffect(() => {
    let scanner = null;
    if (isCameraActive) {
      try {
        scanner = new Html5QrcodeScanner('qr-reader-container', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true
        });

        scanner.render(
          (decodedText) => {
            handleVerifyToken(decodedText);
            // Temporarily pause camera after success
            scanner.clear();
            setIsCameraActive(false);
          },
          (errorMessage) => {
            // Ignore scan frame noise
          }
        );
        scannerRef.current = scanner;
      } catch (err) {
        console.error('Failed to init QR camera scanner:', err);
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isCameraActive]);

  const handleVerifyToken = async (tokenToVerify) => {
    if (!tokenToVerify) return;

    try {
      setLoading(true);
      const res = await api.checkInTicket({
        token: tokenToVerify.trim(),
        eventId: activeEvent?.id,
        staffName: user?.name || 'Gate Staff'
      });

      const newScan = {
        timestamp: new Date().toLocaleTimeString(),
        token: tokenToVerify,
        status: res.status,
        message: res.message,
        registration: res.registration
      };

      setScanResult(newScan);
      setRecentScans(prev => [newScan, ...prev.slice(0, 5)]);

      if (res.status === 'SUCCESS') {
        showToast(`Verified: ${res.registration?.userName} checked in!`, 'success');
        if (onAttendanceUpdated) onAttendanceUpdated();
      }
    } catch (err) {
      // In case backend returned 409 DUPLICATE or 404 INVALID
      let errorData = {
        timestamp: new Date().toLocaleTimeString(),
        token: tokenToVerify,
        status: 'ERROR',
        message: err.message || 'Verification failed'
      };

      if (err.message && err.message.includes('ALREADY CHECKED IN')) {
        errorData.status = 'DUPLICATE';
      } else if (err.message && err.message.includes('DIFFERENT event')) {
        errorData.status = 'WRONG_EVENT';
      }

      setScanResult(errorData);
      setRecentScans(prev => [errorData, ...prev.slice(0, 5)]);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
      setManualToken('');
    }
  };

  // Demo shortcut test tokens for quick live evaluation
  const demoTokens = [
    { label: 'Test Valid Ticket (Alex Rivera)', token: 'CP-EVT1-REG1001-SECURE-98471' },
    { label: 'Test Duplicate Ticket (Already Scanned)', token: 'CP-EVT1-REG1004-CHECKEDIN-ALREADY' },
    { label: 'Test Invalid / Counterfeit Token', token: 'CP-FAKE-TOKEN-99999' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl my-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Campus QR Check-In & Attendance Desk
              </h2>
              <p className="text-xs text-slate-400">
                Event: <span className="text-indigo-300 font-semibold">{activeEvent?.title || 'All Events Mode'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Active Result Banner */}
          {scanResult && (
            <div className={`p-4 rounded-2xl border transition-all animate-in zoom-in-95 ${
              scanResult.status === 'SUCCESS' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100' :
              scanResult.status === 'DUPLICATE' ? 'bg-amber-950/90 border-amber-500 text-amber-100 ring-2 ring-amber-500/30' :
              'bg-rose-950/90 border-rose-500 text-rose-100'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.status === 'SUCCESS' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                ) : scanResult.status === 'DUPLICATE' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base tracking-tight">
                      {scanResult.status === 'SUCCESS' ? '✅ ENTRY VERIFIED - ATTENDANCE MARKED' :
                       scanResult.status === 'DUPLICATE' ? '⚠️ DUPLICATE TICKET DETECTED!' :
                       '❌ INVALID OR UNRECOGNIZED PASS'}
                    </span>
                    <span className="text-[11px] font-mono opacity-80">{scanResult.timestamp}</span>
                  </div>

                  <p className="text-xs leading-relaxed">{scanResult.message}</p>

                  {scanResult.registration && (
                    <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Student Name</span>
                        <strong className="text-white">{scanResult.registration.userName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Roll Number</span>
                        <span className="font-mono text-slate-200">{scanResult.registration.userRoll}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Seat Number</span>
                        <strong className="text-indigo-300">{scanResult.registration.seatNumber}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Camera Scanner View / Toggle */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-3">
            {!isCameraActive ? (
              <div className="py-4 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Live Camera QR Scanner</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Scan student tickets in real time using your device's webcam or smartphone camera.
                  </p>
                </div>
                <button
                  onClick={() => setIsCameraActive(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera Scanner</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div id="qr-reader-container" className="overflow-hidden rounded-xl bg-black text-white max-w-sm mx-auto" />
                <button
                  onClick={() => setIsCameraActive(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-600"
                >
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Manual Input or 1-Click Demo Tokens */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Instant Hackathon Verification (Manual / Demo Tokens)
            </h4>

            {/* Quick Demo Tokens Row */}
            <div className="flex flex-wrap gap-2">
              {demoTokens.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVerifyToken(t.token)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Manual input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Or paste ticket token string (e.g. CP-EVT1-REG1001-...)"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyToken(manualToken)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleVerifyToken(manualToken)}
                disabled={loading || !manualToken}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md"
              >
                {loading ? 'Verifying...' : 'Verify Token'}
              </button>
            </div>
          </div>

          {/* Scan Log History */}
          {recentScans.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Recent Verification Log:</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recentScans.map((s, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-800/60 text-xs flex items-center justify-between">
                    <span className="font-mono text-slate-300 text-[11px] truncate max-w-xs">{s.token}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' :
                      s.status === 'DUPLICATE' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
