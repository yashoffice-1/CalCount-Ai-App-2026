export function downloadCsv({
  filename,
  headers,
  rows,
}: {
  filename: string
  headers: string[]
  rows: (string | number | boolean | null | undefined)[][]
}) {
  const escapeCell = (v: any) => {
    const s = v === null || v === undefined ? '' : String(v)
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return `"${s.replaceAll('"', '""')}"`
    }
    return s
  }

  const csv = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

