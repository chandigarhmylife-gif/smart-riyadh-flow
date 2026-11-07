import { describe, it, expect } from 'vitest';
import { toCsv } from '../csv';

describe('toCsv', () => {
  const columns = [{ key: 't', label: 'time_s' }, { key: 'name' }, { key: 'v', label: 'value' }];

  it('writes a header and rows with CRLF line endings', () => {
    const csv = toCsv([{ t: 10, name: 'a', v: 1.234 }], columns);
    expect(csv).toBe('time_s,name,value\r\n10,a,1.23\r\n');
  });

  it('quotes commas, quotes and newlines', () => {
    const csv = toCsv([{ t: 0, name: 'King Fahd, "NB"', v: null }], columns);
    expect(csv).toBe('time_s,name,value\r\n0,"King Fahd, ""NB""",\r\n');
  });

  it('writes preamble lines before the header', () => {
    const csv = toCsv([], columns, [['seed', 42]]);
    expect(csv.startsWith('# seed,42\r\ntime_s,')).toBe(true);
  });
});
