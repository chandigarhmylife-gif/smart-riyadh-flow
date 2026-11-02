// Parsing, validation and normalisation for imported traffic count files (CSV/JSON).

export function parseCSV(text) {
  const lines = String(text ?? '').split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i]?.trim() || '';
    });
    return obj;
  });
}

export function validateJsonData(data) {
  const records = Array.isArray(data) ? data : [data];
  const errors = [];
  const warnings = [];
  let validRecords = 0;

  records.forEach((record, index) => {
    if (!record.timestamp && !record.time) {
      warnings.push(`Record ${index + 1}: Missing timestamp`);
    }
    if (!record.direction && !record.lane) {
      warnings.push(`Record ${index + 1}: Missing direction/lane`);
    }
    if (!record.count && !record.vehicle_count) {
      errors.push(`Record ${index + 1}: Missing vehicle count`);
    } else {
      validRecords++;
    }
  });

  return { errors, warnings, totalRecords: records.length, validRecords };
}

export function validateCsvData(data) {
  const errors = [];
  const warnings = [];
  let validRecords = 0;

  data.forEach((record, index) => {
    const hasRequiredFields = record.timestamp || record.time;
    if (!hasRequiredFields) {
      errors.push(`Row ${index + 2}: Missing required timestamp field`);
    } else {
      validRecords++;
    }
  });

  return { errors, warnings, totalRecords: data.length, validRecords };
}

export function cleanAndTransform(data) {
  const records = Array.isArray(data) ? data : [data];

  return records.map(record => ({
    timestamp: record.timestamp || record.time || new Date().toISOString(),
    direction: record.direction || record.lane || 'unknown',
    vehicleCount: parseInt(record.count || record.vehicle_count || 0, 10),
    avgSpeed: parseFloat(record.speed || record.avg_speed || 0),
    queueLength: parseInt(record.queue || record.queue_length || 0, 10)
  }));
}
