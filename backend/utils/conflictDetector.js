const db = require('../data/db');

// Convert "HH:mm" to minutes from 00:00
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + (minutes || 0);
}

// Convert minutes to "HH:mm"
function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Checks for venue scheduling conflicts and generates intelligent alternatives.
 * @param {Object} params
 * @param {string} params.venueId
 * @param {string} params.date - "YYYY-MM-DD"
 * @param {string} params.startTime - "HH:mm"
 * @param {string} params.endTime - "HH:mm"
 * @param {string} [params.excludeEventId] - Event ID to exclude (when editing)
 * @returns {Object} Conflict assessment with suggested alternatives
 */
function checkVenueConflict({ venueId, date, startTime, endTime, excludeEventId }) {
  const events = db.getEvents();
  const venues = db.getVenues();
  const currentVenue = db.getVenueById(venueId);

  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);
  const duration = Math.max(reqEnd - reqStart, 60); // minimum 1 hour

  // Filter existing events on same date & venue that are active/approved/pending
  const activeEventsOnSameVenue = events.filter(e => {
    if (excludeEventId && e.id === excludeEventId) return false;
    if (e.venueId !== venueId) return false;
    if (e.date !== date) return false;
    // Disregard rejected or draft events
    if (e.status === 'rejected') return false;
    return true;
  });

  const conflicts = [];

  for (const existing of activeEventsOnSameVenue) {
    const exStart = timeToMinutes(existing.startTime);
    const exEnd = timeToMinutes(existing.endTime);

    // Overlap condition
    if (reqStart < exEnd && exStart < reqEnd) {
      conflicts.push({
        eventId: existing.id,
        title: existing.title,
        startTime: existing.startTime,
        endTime: existing.endTime,
        organizer: existing.organizerName || existing.organizerClub,
        status: existing.status
      });
    }
  }

  const hasConflict = conflicts.length > 0;

  // 1. Suggest alternative time slots at the SAME venue on this date
  const suggestedTimeSlots = [];
  if (hasConflict) {
    // Campus operational hours: 08:00 (480 mins) to 22:00 (1320 mins)
    const campusOpen = 8 * 60;
    const campusClose = 22 * 60;

    // Potential slot 1: Morning slot before first conflict
    const earliestConflictStart = Math.min(...activeEventsOnSameVenue.map(e => timeToMinutes(e.startTime)));
    if (earliestConflictStart - campusOpen >= duration) {
      suggestedTimeSlots.push({
        startTime: minutesToTime(campusOpen),
        endTime: minutesToTime(campusOpen + duration),
        label: `Morning Slot (${minutesToTime(campusOpen)} – ${minutesToTime(campusOpen + duration)})`
      });
    }

    // Potential slot 2: Slot right after latest conflict
    const latestConflictEnd = Math.max(...activeEventsOnSameVenue.map(e => timeToMinutes(e.endTime)));
    const buffer = 30; // 30 mins setup buffer
    if (campusClose - (latestConflictEnd + buffer) >= duration) {
      const slotStart = latestConflictEnd + buffer;
      suggestedTimeSlots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotStart + duration),
        label: `Post-Event Slot (${minutesToTime(slotStart)} – ${minutesToTime(slotStart + duration)})`
      });
    }

    // Fallback slot if morning or post-event couldn't fit
    if (suggestedTimeSlots.length === 0) {
      suggestedTimeSlots.push({
        startTime: "09:00",
        endTime: minutesToTime(9 * 60 + duration),
        label: "Next Day Morning Slot (Recommended)"
      });
    }
  }

  // 2. Suggest alternative AVAILABLE venues at the requested date & time
  const suggestedVenues = [];
  if (hasConflict) {
    for (const otherVenue of venues) {
      if (otherVenue.id === venueId) continue;

      // Check if otherVenue has any conflict at [reqStart, reqEnd] on this date
      const otherConflicts = events.filter(e => {
        if (excludeEventId && e.id === excludeEventId) return false;
        if (e.venueId !== otherVenue.id) return false;
        if (e.date !== date) return false;
        if (e.status === 'rejected') return false;

        const s = timeToMinutes(e.startTime);
        const en = timeToMinutes(e.endTime);
        return reqStart < en && s < reqEnd;
      });

      if (otherConflicts.length === 0) {
        suggestedVenues.push({
          id: otherVenue.id,
          name: otherVenue.name,
          building: otherVenue.building,
          capacity: otherVenue.capacity,
          facilities: otherVenue.facilities,
          capacityComparison: currentVenue ? `${otherVenue.capacity} seats (vs ${currentVenue.capacity} requested)` : `${otherVenue.capacity} seats`
        });
      }
    }
  }

  return {
    hasConflict,
    venueName: currentVenue ? currentVenue.name : 'Selected Venue',
    conflicts,
    suggestedTimeSlots,
    suggestedVenues: suggestedVenues.slice(0, 3), // top 3 alternatives
    message: hasConflict
      ? `Schedule conflict detected! ${conflicts.length} overlapping event(s) booked at ${currentVenue?.name || 'this venue'}.`
      : `Venue is available with no scheduling overlaps.`
  };
}

module.exports = {
  checkVenueConflict,
  timeToMinutes,
  minutesToTime
};
