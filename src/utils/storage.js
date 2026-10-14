import { initialGymData } from '../data/initialData';

const STORAGE_KEY = 'GYMFLOW_PRO_DATA_V1';

export function loadGymData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveGymData(initialGymData);
      return initialGymData;
    }
    const parsed = JSON.parse(raw);
    return { ...initialGymData, ...parsed };
  } catch (err) {
    console.error('Failed to load local gym data:', err);
    return initialGymData;
  }
}

export function saveGymData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to persist gym data:', err);
  }
}

export function resetGymData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    saveGymData(initialGymData);
    return initialGymData;
  } catch (err) {
    console.error('Failed to reset gym data:', err);
    return initialGymData;
  }
}

export function exportGymDataToFile(data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `gymflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportMembersToCSV(members) {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Tier', 'Status', 'Expiry Date', 'Visits This Month', 'Assigned Trainer'];
  const rows = members.map(m => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    m.email,
    m.phone,
    `"${m.tier}"`,
    m.status,
    m.expiryDate,
    m.visitsThisMonth,
    `"${m.trainer || 'None'}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `gym-members-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
