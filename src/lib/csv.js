// Minimal CSV writer (RFC 4180 quoting).

function cell(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * rows: array of objects; columns: [{ key, label }] (label defaults to key).
 * Optional `preamble` lines (e.g. run settings) are written first as "# key,value".
 */
export function toCsv(rows, columns, preamble = []) {
  const lines = preamble.map(([k, v]) => `# ${cell(k)},${cell(v)}`);
  lines.push(columns.map((c) => cell(c.label ?? c.key)).join(','));
  for (const row of rows) lines.push(columns.map((c) => cell(row[c.key])).join(','));
  return lines.join('\r\n') + '\r\n';
}

/** Trigger a browser download of `text` as a file. */
export function downloadText(filename, text, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
