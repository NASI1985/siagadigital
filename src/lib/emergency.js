// Logika murni untuk halaman Bantuan.
import { INCIDENTS, PLATFORMS, WARNING_TONES } from '../data/emergency.js';

export function findById(list, id) {
  return list.find((item) => item.id === id) ?? null;
}

// Rencana aksi: langkah kejadian + langkah khusus platform di blok "Sekarang juga".
export function buildActionPlan(incidentId, platformId, incidents = INCIDENTS, platforms = PLATFORMS) {
  const incident = findById(incidents, incidentId);
  const platform = findById(platforms, platformId);
  if (!incident || !platform) return null;
  return {
    title: incident.title,
    now: [...incident.now, ...platform.now],
    today: [...incident.today],
  };
}

export function fillTemplate(template, topic) {
  return template.replaceAll('{topic}', topic);
}

export function buildWarningMessage(toneId, incidentId, tones = WARNING_TONES, incidents = INCIDENTS) {
  const tone = findById(tones, toneId) ?? tones[0];
  const incident = findById(incidents, incidentId) ?? incidents[0];
  return fillTemplate(tone.template, incident.topic);
}

export function whatsappShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
