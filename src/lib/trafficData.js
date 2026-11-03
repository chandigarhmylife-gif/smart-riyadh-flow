// Parsing, validation and normalisation for imported traffic count files (CSV/JSON).

export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;

/** 'json' | 'csv' | null, from the file's MIME type or extension. */
export function detectFormat(file) {
  const name = (file?.name || '').toLowerCase();
  const type = file?.type || '';
  if (type === 'application/json' || name.endsWith('.json')) return 'json';
  if (type === 'text/csv' || name.endsWith('.csv')) return 'csv';
  return null;
}

/** Split one CSV line, honouring double quotes and "" escapes (RFC 4180). */
export function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      values.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current);
  return values.map((v) => v.trim());
}

export function parseCSV(text) {
  const lines = String(text ?? '').split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ?? '';
    });
    return obj;
  });
}

/**
 * Parse file text into raw records. Throws an Error with a readable message
 * for unsupported formats or malformed JSON.
 */
export function parseTrafficFile(text, format) {
  if (format === 'csv') return parseCSV(text);
  if (format === 'json') {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('The file is not valid JSON.');
    }
    if (data === null || typeof data !== 'object') {
      throw new Error('JSON must be an object or an array of records.');
    }
    return data;
  }
  throw new Error('Unsupported file type. Please upload a .csv or .json file.');
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
  const records = (Array.isArray(data) ? data : [data]).filter(r => r && typeof r === 'object');

  return records.map(record => ({
    timestamp: record.timestamp || record.time || new Date().toISOString(),
    direction: record.direction || record.lane || 'unknown',
    vehicleCount: parseInt(record.count || record.vehicle_count || 0, 10),
    avgSpeed: parseFloat(record.speed || record.avg_speed || 0),
    queueLength: parseInt(record.queue || record.queue_length || 0, 10)
  }));
}
