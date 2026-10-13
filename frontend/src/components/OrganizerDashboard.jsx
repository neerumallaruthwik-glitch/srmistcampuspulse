import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConflictWarningBanner } from './ConflictWarningBanner';
import { QRScannerModal } from './QRScannerModal';
import { 
  Sparkles, 
  UploadCloud, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Tag, 
  QrCode, 
  Download, 
  Eye, 
  Building,
  RotateCcw,
  Check,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export function OrganizerDashboard({ activeTab, setActiveTab }) {
  const { user, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Poster Studio State
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [presets, setPresets] = useState([]);
  const [ocrMetadata, setOcrMetadata] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech & Coding',
    venueId: '',
    date: '2026-11-12',
    startTime: '09:30',
    endTime: '18:30',
    capacity: 120,
    description: '',
    tags: 'AI, Hackathon, Coding',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    status: 'pending'
  });

  // Conflict state
  const [conflictReport, setConflictReport] = useState(null);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  // Attendee Management Modal
  const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);
  const [attendeesList, setAttendeesList] = useState([]);
  const [attendeeStats, setAttendeeStats] = useState(null);

  // QR Scanner Modal
  const [scannerEvent, setScannerEvent] = useState(null);

  const categories = [
    'Tech & Coding',
    'Cultural & Arts',
    'Workshops & Seminars',
    'Sports & Fitness',
    'Career & Placements',
    'Gaming & Esports'
  ];

  // Load organizer events and venues
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, venuesRes, presetsRes] = await Promise.all([
        api.getEvents({ status: 'all' }),
        api.getVenues(),
        api.getAIPresets()
      ]);

      if (eventsRes.success) setEvents(eventsRes.events);
      if (venuesRes.success) {
        setVenues(venuesRes.venues);
        if (!formData.venueId && venuesRes.venues.length > 0) {
          setFormData(prev => ({ ...prev, venueId: venuesRes.venues[0].id }));
        }
      }
      if (presetsRes.success) setPresets(presetsRes.presets);
    } catch (err) {
      console.error('Error loading organizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Run Real-Time Conflict Radar whenever venueId, date, startTime, or endTime changes!
  useEffect(() => {
    if (formData.venueId && formData.date && formData.startTime && formData.endTime) {
      checkConflictNow();
    }
  }, [formData.venueId, formData.date, formData.startTime, formData.endTime]);

  const checkConflictNow = async () => {
    try {
      setIsCheckingConflict(true);
      const report = await api.checkConflicts({
        venueId: formData.venueId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      if (report.success) {
        setConflictReport(report);
      }
    } catch (err) {
      console.error('Conflict check error:', err);
    } finally {
      setIsCheckingConflict(false);
    }
  };

  // Handle Preset AI Extraction Selection
  const handleSelectPreset = async (presetId) => {
    try {
      setIsExtracting(true);
      const preset = presets.find(p => p.id === presetId);
      if (!preset) return;

      setPosterPreview(preset.thumbnail);

      // Call extraction endpoint
      const res = await api.extractPoster(new URLSearchParams({ presetId }));
      if (res.success) {
        const d = res.data;
        setFormData({
          title: d.title,
          category: d.category,
          venueId: d.venueId,
          date: d.date,
          startTime: d.startTime,
          endTime: d.endTime,
          capacity: d.capacity,
          description: d.description,
          tags: d.tags ? d.tags.join(', ') : '',
          posterUrl: preset.thumbnail,
          status: 'pending'
        });
        setOcrMetadata(d);
        showToast('AI Poster OCR Extracted successfully!', 'success');
      }
    } catch (err) {
      showToast('Extraction failed: ' + err.message, 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle File Upload Extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));

    try {
      setIsExtracting(true);
      const formPayload = new FormData();
      formPayload.append('poster', file);

      const res = await api.extractPoster(formPayload);
      if (res.success) {
        const d = res.data;
        setFormData(prev => ({
          ...prev,
          title: d.title,
          category: d.category,
          venueId: d.venueId,
          date: d.date,
          startTime: d.startTime,
          endTime: d.endTime,
          capacity: d.capacity,
          description: d.description,
          tags: d.tags ? d.tags.join(', ') : prev.tags,
          posterUrl: res.posterUrl || prev.posterUrl
        }));
        setOcrMetadata(d);
        showToast('AI Details extracted from uploaded poster image!', 'success');
      }
    } catch (err) {
      showToast('OCR extraction error: ' + err.message, 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  // Submit Event Form
  const handleSubmitEvent = async (statusMode = 'pending') => {
    if (!formData.title || !formData.venueId || !formData.date || !formData.startTime || !formData.endTime) {
      showToast('Please fill all required event details', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createEvent({
        ...formData,
        status: statusMode,
        organizerId: user?.id,
        tags: formData.tags.split(',').map(t => t.trim())
      });

      if (res.success) {
        showToast(
          statusMode === 'pending'
            ? 'Event proposal submitted for College Administration approval!'
            : 'Event saved to drafts',
          'success'
        );
        fetchData();
        setActiveTab('organizer-events');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open Attendee Management Drawer
  const handleViewAttendees = async (event) => {
    try {
      setSelectedEventAttendees(event);
      const res = await api.getEventAttendees(event.id);
      if (res.success) {
        setAttendeesList(res.attendees);
        setAttendeeStats(res.stats);
      }
    } catch (err) {
      showToast('Failed to fetch attendee records', 'error');
    }
  };

  // Export Attendees to CSV
  const handleExportCSV = () => {
    if (!attendeesList || attendeesList.length === 0) {
      showToast('No attendees to export', 'info');
      return;
    }

    const headers = ['Registration ID,Student Name,Roll Number,Department,Seat,Status,Registered At,Checked In At\n'];
    const rows = attendeesList.map(a => 
      `"${a.id}","${a.userName}","${a.userRoll}","${a.userDept}","${a.seatNumber}","${a.status}","${a.registeredAt}","${a.checkedInAt || 'N/A'}"\n`
    );

    const csvBlob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedEventAttendees?.title || 'Attendees'}_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Participant list exported to CSV!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Header Summary */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Campus Event Organizer Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Welcome, {user?.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Managing events on behalf of <strong className="text-slate-200">{user?.club || 'IEEE Student Chapter'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai-creator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Launch AI Poster Studio</span>
          </button>
          <button
            onClick={() => setScannerEvent({ title: 'Campus Gate Check-In Desk' })}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Scanner Desk</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI POSTER STUDIO (UPLOAD, OCR EXTRACTION, CONFLICT DETECTION, SUBMIT) */}
      {activeTab === 'ai-creator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Poster Dropzone & OCR Visualizer */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-purple-400" />
                    <span>Upload Event Poster</span>
                  </h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">
                    AI OCR Vision
                  </span>
                </div>

                {/* Poster Dropzone */}
                <label className="relative border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group overflow-hidden min-h-[220px]">
                  {posterPreview ? (
                    <div className="relative w-full h-56 rounded-xl overflow-hidden">
                      <img src={posterPreview} alt="Poster Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white bg-slate-900/80 px-3 py-1.5 rounded-lg font-bold">Change Poster</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">Drag & drop poster image, or browse</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Loading OCR Progress Animation */}
                {isExtracting && (
                  <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                    <div className="flex-1">
                      <p className="font-bold">Analyzing Poster with Vision AI...</p>
                      <p className="text-[10px] opacity-80">Extracting Title, Timings, Venue & Agenda details</p>
                    </div>
                  </div>
                )}

                {/* 1-Click Sample Poster Presets for Instant Live Hackathon Demonstrations */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or Test with Demo Posters (1-Click AI Extraction):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {presets.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-purple-900/40 border border-slate-700/80 hover:border-purple-500/50 text-left transition-all space-y-1 group"
                      >
                        <img src={p.thumbnail} alt="" className="w-full h-14 object-cover rounded-lg" />
                        <span className="text-[10px] font-bold text-slate-200 block truncate group-hover:text-purple-300">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extracted Confidence Scores Pill Matrix */}
                {ocrMetadata && ocrMetadata.confidenceScores && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      AI OCR Confidence Breakdown:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="flex justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
                        <span>Event Title</span>
                        <strong className="text-emerald-400">{ocrMetadata.confidenceScores.title}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
                        <span>Date & Time</span>
                        <strong className="text-emerald-400">{ocrMetadata.confidenceScores.date}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
                        <span>Venue Clue</span>
                        <strong className="text-emerald-400">{ocrMetadata.confidenceScores.venue}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
                        <span>Category</span>
                        <strong className="text-emerald-400">{ocrMetadata.confidenceScores.category}%</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Event Draft Form with Real-time Venue Conflict Detector */}
            <div className="lg:col-span-7 space-y-5">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Event Details & Pipeline Proposal</h3>
                    <p className="text-xs text-slate-400">Review AI-extracted fields, check venue availability, and submit.</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                    Organizer Portal
                  </span>
                </div>

                {/* Real-time Venue Conflict Warning Banner */}
                <ConflictWarningBanner
                  conflictReport={conflictReport}
                  onApplySlot={(slot) => {
                    setFormData(prev => ({
                      ...prev,
                      startTime: slot.startTime,
                      endTime: slot.endTime
                    }));
                    showToast(`Applied alternative time slot: ${slot.startTime} - ${slot.endTime}`, 'info');
                  }}
                  onApplyVenue={(v) => {
                    setFormData(prev => ({
                      ...prev,
                      venueId: v.id
                    }));
                    showToast(`Switched venue to: ${v.name}`, 'info');
                  }}
                />

                {/* Form Fields */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. HackNex 2026: 36-Hour National Hackathon"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Event Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Target Campus Venue *</label>
                      <select
                        value={formData.venueId}
                        onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        {venues.map((v) => (
                          <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Event Date *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Start Time (HH:mm) *</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">End Time (HH:mm) *</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Expected Seat Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="AI, Hackathon, Coding"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Event Description & Agenda</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive overview extracted by AI..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleSubmitEvent('draft')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmitEvent('pending')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit for College Administration Approval</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: HOSTED EVENTS LIST & ATTENDEE MANAGEMENT */}
      {(activeTab === 'organizer-events' || activeTab === 'browse') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">Events Hosting Pipeline</h3>
              <p className="text-xs text-slate-400">Track approvals, live attendee counts, and QR check-in status.</p>
            </div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl">
              {events.length} Total Events
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-slate-900 border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Event & Poster</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date & Venue</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Registrations</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.map((event) => {
                  const isApproved = event.status === 'approved';
                  const isPending = event.status === 'pending';
                  const isRejected = event.status === 'rejected';

                  return (
                    <tr key={event.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={event.posterUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <p className="font-bold text-white text-sm line-clamp-1">{event.title}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{event.organizerClub}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300">
                          {event.category}
                        </span>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <p className="font-medium text-slate-200">{event.date} ({event.startTime})</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{event.venueName}</p>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          isRejected ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-slate-700/50 text-slate-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isApproved ? 'bg-emerald-400' : isPending ? 'bg-amber-400 animate-ping' : 'bg-rose-400'
                          }`} />
                          {event.status}
                        </span>
                        {isRejected && event.rejectionReason && (
                          <p className="text-[10px] text-rose-400 mt-1 max-w-[180px]">
                            Reason: {event.rejectionReason}
                          </p>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="font-semibold text-white">
                          {event.registeredCount || 0} / {event.capacity}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewAttendees(event)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-xs font-semibold transition-colors"
                          title="View attendee list"
                        >
                          Attendees
                        </button>
                        <button
                          onClick={() => setScannerEvent(event)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 text-xs font-semibold transition-colors"
                          title="Open QR scanner for this event"
                        >
                          Scan QR
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CAMPUS VENUES RADAR */}
      {activeTab === 'venues' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <span>Campus Venues Availability & Facilities Radar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time audit of auditorium halls, tech labs, sports arenas, and open amphitheatre facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => (
              <div key={v.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{v.name}</h4>
                    <p className="text-xs text-slate-400">{v.building}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {v.capacity} Seats
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Available Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {v.facilities?.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendee Management Drawer / Modal */}
      {selectedEventAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Attendee Roster & Check-In Log</h3>
                <p className="text-xs text-slate-400">{selectedEventAttendees.title}</p>
              </div>
              <button
                onClick={() => setSelectedEventAttendees(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Attendance Stats Cards */}
            {attendeeStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Total Registered</span>
                  <strong className="text-lg text-white font-extrabold">{attendeeStats.totalRegistered}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Checked-In</span>
                  <strong className="text-lg text-emerald-400 font-extrabold">{attendeeStats.totalAttended}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Pending Check-In</span>
                  <strong className="text-lg text-amber-400 font-extrabold">{attendeeStats.pendingCheckIn}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Turnout Percentage</span>
                  <strong className="text-lg text-indigo-300 font-extrabold">{attendeeStats.attendanceRate}%</strong>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Participant records: <strong className="text-white">{attendeesList.length}</strong>
              </span>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Attendee List (.CSV)</span>
              </button>
            </div>

            {/* Attendee Table */}
            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-3">Attendee</th>
                    <th className="p-3">Roll / Dept</th>
                    <th className="p-3">Seat</th>
                    <th className="p-3">Ticket Token</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {attendeesList.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white">{a.userName}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{a.userRoll}</td>
                      <td className="p-3 font-bold text-indigo-300">{a.seatNumber}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500 truncate max-w-[120px]">{a.qrCodeToken}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.status === 'attended' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {scannerEvent && (
        <QRScannerModal
          activeEvent={scannerEvent}
          onClose={() => setScannerEvent(null)}
          onAttendanceUpdated={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
}
