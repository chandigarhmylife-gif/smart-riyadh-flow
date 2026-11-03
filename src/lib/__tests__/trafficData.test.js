import { describe, it, expect } from 'vitest';
import { parseCSV, validateCsvData, validateJsonData, cleanAndTransform } from '../trafficData';

describe('parseCSV', () => {
  it('parses rows into objects keyed by header', () => {
    const rows = parseCSV('timestamp,direction,count\n2026-01-01T07:00,north,42\n2026-01-01T07:15,south,37');
    expect(rows).toEqual([
      { timestamp: '2026-01-01T07:00', direction: 'north', count: '42' },
      { timestamp: '2026-01-01T07:15', direction: 'south', count: '37' },
    ]);
  });

  it('handles Windows line endings and blank lines', () => {
    const rows = parseCSV('time,count\r\n07:00,5\r\n\r\n07:15,8\r\n');
    expect(rows).toEqual([{ time: '07:00', count: '5' }, { time: '07:15', count: '8' }]);
  });

  it('returns an empty list for an empty file instead of throwing', () => {
    expect(parseCSV('')).toEqual([]);
    expect(parseCSV(undefined)).toEqual([]);
  });
});

describe('validation', () => {
  it('flags CSV rows without a timestamp, using spreadsheet row numbers', () => {
    const q = validateCsvData([{ timestamp: 'x' }, { count: '3' }]);
    expect(q.validRecords).toBe(1);
    expect(q.errors).toEqual(['Row 3: Missing required timestamp field']);
  });

  it('treats a JSON record without a count as an error and missing metadata as warnings', () => {
    const q = validateJsonData([{ count: 4 }, { timestamp: 't', direction: 'n' }]);
    expect(q.totalRecords).toBe(2);
    expect(q.validRecords).toBe(1);
    expect(q.errors).toEqual(['Record 2: Missing vehicle count']);
    expect(q.warnings).toHaveLength(2);
  });

  it('accepts a single JSON object as one record', () => {
    expect(validateJsonData({ count: 1, time: 't', lane: 1 }).totalRecords).toBe(1);
  });
});

describe('cleanAndTransform', () => {
  it('normalises alternative field names and numeric types', () => {
    const [r] = cleanAndTransform([{ time: 't', lane: 'L2', vehicle_count: '12', avg_speed: '41.5', queue_length: '3' }]);
    expect(r).toEqual({ timestamp: 't', direction: 'L2', vehicleCount: 12, avgSpeed: 41.5, queueLength: 3 });
  });

  it('fills defaults for missing fields', () => {
    const [r] = cleanAndTransform([{ timestamp: 't' }]);
    expect(r).toMatchObject({ direction: 'unknown', vehicleCount: 0, avgSpeed: 0, queueLength: 0 });
  });
});

import { parseCSVLine, detectFormat, parseTrafficFile } from '../trafficData';

describe('CSV quoting', () => {
  it('keeps commas inside quoted fields', () => {
    expect(parseCSVLine('"King Fahd Rd, NB",42,"07:00"')).toEqual(['King Fahd Rd, NB', '42', '07:00']);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCSVLine('"say ""hi""",1')).toEqual(['say "hi"', '1']);
  });

  it('parses a quoted location column end to end', () => {
    const rows = parseCSV('location,count,time\n"Olaya St, SB",12,07:15');
    expect(rows).toEqual([{ location: 'Olaya St, SB', count: '12', time: '07:15' }]);
  });
});

describe('file handling', () => {
  it('detects format by MIME type or extension', () => {
    expect(detectFormat({ name: 'counts.CSV', type: '' })).toBe('csv');
    expect(detectFormat({ name: 'x.json', type: '' })).toBe('json');
    expect(detectFormat({ name: 'x', type: 'application/json' })).toBe('json');
    expect(detectFormat({ name: 'photo.png', type: 'image/png' })).toBe(null);
  });

  it('gives a readable error for malformed JSON', () => {
    let message = '';
    try { parseTrafficFile('{oops', 'json'); } catch (e) { message = e.message; }
    expect(message).toBe('The file is not valid JSON.');
  });

  it('rejects unsupported formats and bare JSON values', () => {
    let a = '';
    let b = '';
    try { parseTrafficFile('hi', null); } catch (e) { a = e.message; }
    try { parseTrafficFile('42', 'json'); } catch (e) { b = e.message; }
    expect(a.startsWith('Unsupported file type')).toBe(true);
    expect(b).toBe('JSON must be an object or an array of records.');
  });

  it('ignores non-object entries when normalising', () => {
    expect(cleanAndTransform([null, 5, { count: '2', timestamp: 't' }])).toHaveLength(1);
  });
});
