'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends { id?: string }>({
  title,
  rows,
  columns,
  pageSize = 8,
  getRowKey,
  searchable = false,
  getSearchText,
  rowActions,
}: {
  title?: string
  rows: T[]
  columns: DataTableColumn<T>[]
  pageSize?: number
  getRowKey?: (row: T, index: number) => string
  searchable?: boolean
  getSearchText?: (row: T) => string
  rowActions?: React.ReactNode
}) {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    if (!searchable) return rows
    const q = query.trim().toLowerCase()
    if (!q) return rows
    const fn = getSearchText ?? ((r: T) => JSON.stringify(r))
    return rows.filter((r) => fn(r).toLowerCase().includes(q))
  }, [getSearchText, query, rows, searchable])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  React.useEffect(() => {
    setPage(1)
  }, [query, pageSize])

  return (
    <div className="space-y-4">
      {(title || searchable) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {title && (
            <div>
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="text-xs text-[hsl(var(--muted))]">
                Showing {filtered.length} record{filtered.length === 1 ? '' : 's'}
              </p>
            </div>
          )}
          {searchable && (
            <div className="w-full sm:max-w-[340px]">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search table"
              />
            </div>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.id} className={c.className}>
                {c.header}
              </TableHead>
            ))}
            {rowActions ? <TableHead className="w-[140px]">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="py-10 text-center text-[hsl(var(--muted))]">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map((row, index) => (
              <TableRow key={getRowKey ? getRowKey(row, index) : String(row.id ?? index)}>
                {columns.map((c) => (
                  <TableCell key={c.id} className={c.className}>
                    {c.cell(row)}
                  </TableCell>
                ))}
                {rowActions ? (
                  <TableCell>
                    {React.isValidElement(rowActions)
                      ? React.cloneElement(
                          rowActions as React.ReactElement<any>,
                          { row } as any
                        )
                      : rowActions}
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-[hsl(var(--muted))]">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            type="button"
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

