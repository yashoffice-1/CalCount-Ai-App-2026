'use client'

import * as React from 'react'
import { Calendar as CalendarIcon, X, RefreshCw, ChevronLeft, ChevronRight, ChevronsRight, Waves, AtSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { monitorCards, monitorStats, activityLogs, type ActivityLogRow, type ApiMonitorCard } from '@/data/dummies'

export function ApiViewPage() {
  const [selectedCard, setSelectedCard] = React.useState<ApiMonitorCard | null>(null)
  const [showRequestsModal, setShowRequestsModal] = React.useState(false)
  const [showLatencyModal, setShowLatencyModal] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen p-6" suppressHydrationWarning />
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-[url('https://transparenttextures.com/patterns/graphy-light.png')] text-[#111827] -m-6 p-6 font-sans" suppressHydrationWarning>
      
      {/* Filter Section */}
      <Card className="mb-6 shadow-sm border-gray-200 rounded-xl">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
            <span>Filter by Date</span>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white shadow-sm hover:border-gray-300 transition-colors cursor-pointer">
              04/08/2026
              <CalendarIcon className="h-3.5 w-3.5" />
            </div>
            <button className="flex items-center gap-1 hover:text-gray-800 transition-colors ml-2">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-emerald-500 bg-emerald-50/50 border-emerald-200 gap-1.5 px-3 py-1 font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </Badge>
            <Button className="bg-[#111827] hover:bg-gray-800 text-white shadow-md">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {monitorCards.map((card, idx) => (
          <Card 
            key={idx} 
            className="relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all border-gray-200 group rounded-xl bg-white"
            onClick={() => setSelectedCard(card)}
          >
            <div className={`h-1.5 w-full`} style={{ backgroundColor: card.color }} />
            <CardContent className="p-5">
              <div className="text-sm font-semibold text-gray-800 mb-2">{card.title}</div>
              <div className="px-3 py-1 bg-gray-50 text-gray-400 text-xs rounded border border-gray-100 font-mono inline-block mb-4 shadow-inner">
                {card.title.toLowerCase().replace(' ', '')}
              </div>
              <div className="text-4xl font-bold tracking-tight text-gray-900 drop-shadow-sm">{card.count}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mt-2 font-semibold">Peak: {card.peak}</div>
              <div className="absolute -bottom-4 -right-4 text-9xl font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                {card.letter}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card 
          className="relative overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200 rounded-xl bg-white"
          onClick={() => setShowRequestsModal(true)}
        >
          <div className="h-1.5 w-full bg-blue-500" />
          <CardContent className="p-5">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 mb-4 font-bold border-blue-100 shadow-sm uppercase text-[10px] tracking-wider px-2 py-0.5">
              <RefreshCw className="mr-1.5 h-3 w-3" /> Requests
            </Badge>
            <div className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">{monitorStats.requests}</div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] select-none pointer-events-none">
              <ChevronsRight className="w-32 h-32" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-sm border-gray-200 rounded-xl bg-white">
          <div className="h-1.5 w-full bg-emerald-500" />
          <CardContent className="p-5">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 mb-4 font-bold border-emerald-100 shadow-sm uppercase text-[10px] tracking-wider px-2 py-0.5">
              <RefreshCw className="mr-1.5 h-3 w-3" /> Avg Latency
            </Badge>
            <div className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">{monitorStats.avgLatency}</div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] select-none pointer-events-none">
              <Waves className="w-32 h-32" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200 rounded-xl bg-white"
          onClick={() => setShowLatencyModal(true)}
        >
          <div className="h-1.5 w-full bg-amber-500" />
          <CardContent className="p-5">
            <Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-100 mb-4 font-bold border-amber-100 shadow-sm uppercase text-[10px] tracking-wider px-2 py-0.5">
              <RefreshCw className="mr-1.5 h-3 w-3" /> Max Latency
            </Badge>
            <div className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">{monitorStats.maxLatency}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-sm border-gray-200 rounded-xl bg-white">
          <div className="h-1.5 w-full bg-red-500" />
          <CardContent className="p-5">
            <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 mb-4 font-bold border-red-100 shadow-sm uppercase text-[10px] tracking-wider px-2 py-0.5">
              <RefreshCw className="mr-1.5 h-3 w-3" /> Unique Users
            </Badge>
            <div className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">{monitorStats.uniqueUsers}</div>
            <div className="absolute -bottom-6 -right-2 opacity-[0.03] select-none pointer-events-none">
              <AtSign className="w-32 h-32" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Table */}
      <Card className="shadow-sm border-gray-200 rounded-xl bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-900">Activity Log</h3>
            <Badge variant="secondary" className="bg-gray-200/50 text-gray-500 border-0 text-xs">
              {monitorStats.requests} records
            </Badge>
          </div>
          <div className="text-xs text-gray-400 font-medium">Page 1 of 789</div>
        </div>
        
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <TableHead className="w-[200px] h-12">Timestamp</TableHead>
              <TableHead className="w-[150px] h-12">User ID</TableHead>
              <TableHead className="w-[120px] h-12">Method</TableHead>
              <TableHead className="h-12">Endpoint</TableHead>
              <TableHead className="text-right h-12">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow key={log.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors font-mono text-[13px]">
                <TableCell className="text-gray-500 font-medium">{log.timestamp}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    log.userId === 'Guest' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-transparent text-blue-500'
                  }`}>
                    {log.userId}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-md text-[11px] font-bold tracking-wide border ${
                    log.method === 'GET' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {log.method}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 truncate max-w-[300px]">
                  {log.endpoint}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-bold flex items-center justify-end gap-1.5 ${
                    log.duration < 100 ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                    {log.duration}ms
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <Button variant="outline" disabled className="text-gray-400 border-gray-200 bg-gray-50/50 shadow-sm text-xs font-medium h-9 px-4 rounded-lg">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`h-8 w-8 rounded-md text-xs font-semibold shadow-sm transition-colors border ${
                  page === 1
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-gray-400 mx-1 text-sm">...</span>
            <button className="h-8 w-10 py-1 px-2 rounded-md text-xs font-medium bg-white text-gray-500 border border-gray-200 hover:border-gray-300 shadow-sm transition-colors">
              789
            </button>
          </div>
          <Button variant="outline" className="text-gray-600 border-gray-200 shadow-sm text-xs font-medium h-9 px-4 rounded-lg hover:bg-gray-50 hover:text-gray-900">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Card>

      {/* Modal for Card Click */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl bg-white border-gray-200 shadow-2xl p-0 overflow-hidden rounded-xl">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 uppercase tracking-tight">
              {selectedCard?.title} 
              <span className="text-gray-400 font-medium tracking-normal capitalize flex items-center gap-2">
                <span className="text-gray-300">|</span> 
                Peak: {selectedCard?.peak} <span className="text-gray-400 font-normal">({selectedCard?.count} requests)</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-200">
            <Table>
              <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
                <TableRow className="hover:bg-transparent border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <TableHead className="w-[200px] h-10 px-6">Timestamp</TableHead>
                  <TableHead className="w-[120px] h-10">User ID</TableHead>
                  <TableHead className="w-[100px] h-10">Method</TableHead>
                  <TableHead className="text-right h-10 px-6">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCard?.requests?.map((log, idx) => (
                  <TableRow key={idx} className="border-gray-50 hover:bg-gray-50/50 transition-colors font-mono text-[13px]">
                    <TableCell className="text-gray-500 font-medium px-6">{log.timestamp}</TableCell>
                    <TableCell>
                      <span className="bg-transparent text-blue-500 font-semibold px-2 py-1 rounded border border-blue-100 bg-blue-50/30 text-xs shadow-sm">
                        {log.userId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[11px] font-bold tracking-wide shadow-sm">
                        {log.method}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-500 px-6">
                      {log.duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requests by API Modal */}
      <Dialog open={showRequestsModal} onOpenChange={setShowRequestsModal}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-0">
           <DialogHeader className="p-10 pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Requests by API</DialogTitle>
           </DialogHeader>
           <div className="px-10 pb-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="h-12 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-0">Endpoint</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right px-0">Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { path: '/dashboard', count: '24608' },
                    { path: '/app-version?version_id=0', count: '6981' },
                    { path: '/meal/detail', count: '6151' },
                    { path: '/meal/saved/check', count: '5594' },
                    { path: '/meal/update', count: '3193' },
                    { path: '/meal/add', count: '3009' },
                    { path: '/subscription/discount', count: '1807' },
                    { path: '/videos/%D7%91%D7%95%D7%95%D7%AA/...', count: '1755' },
                    { path: '/videos/v14044g50000d2sqtdfog65v97hn1vsg.MP4', count: '1446' },
                    { path: '/user/onboarding', count: '1214' },
                  ].map((row, i) => (
                    <TableRow key={i} className="border-gray-50 hover:bg-gray-50/40 transition-colors group">
                      <TableCell className="py-4 px-0 font-mono text-[13px] text-gray-500 group-hover:text-gray-900 transition-colors truncate max-w-[400px]">{row.path}</TableCell>
                      <TableCell className="py-4 px-0 text-right font-semibold text-gray-800 tabular-nums">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </div>
        </DialogContent>
      </Dialog>

      {/* Max Latency by API Modal */}
      <Dialog open={showLatencyModal} onOpenChange={setShowLatencyModal}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-0">
           <DialogHeader className="p-10 pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Max Latency by API</DialogTitle>
           </DialogHeader>
           <div className="px-10 pb-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="h-12 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-0">Endpoint</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right px-0 pr-4">Max Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { path: '/meal/regenerate', lat: '49156ms' },
                    { path: '/mealadd/barcode', lat: '21949ms' },
                    { path: '/meal/add', lat: '21411ms' },
                    { path: '/meal/update', lat: '5832ms' },
                    { path: '/manaul/update-ingredient', lat: '4063ms' },
                    { path: '/foodDatabase/search?searchTerm=%D7%A9%D7%9C%D7%95%D7%... ', lat: '3832ms' },
                    { path: '/foodDatabase/search?searchTerm=%D7%9E%D7%99%D7%A0%... ', lat: '3725ms' },
                    { path: '/foodDatabase/search?searchTerm=%D7%9E%D7%A6%D7%94%... ', lat: '3159ms' },
                    { path: '/manaul/add-ingredient', lat: '2883ms' },
                    { path: '/foodDatabase/search?searchTerm=%D7%A1%D7%9C%D7%98%... ', lat: '2774ms' },
                  ].map((row, i) => (
                    <TableRow key={i} className="border-gray-50/60 hover:bg-gray-50/60 transition-colors group">
                      <TableCell className="py-2.5 px-0 font-mono text-[13.5px] text-gray-400 group-hover:text-gray-900 transition-colors truncate max-w-[400px] tracking-tight">{row.path}</TableCell>
                      <TableCell className="py-2.5 px-0 text-right font-bold text-red-500 tabular-nums text-lg pr-4 drop-shadow-sm-red">{row.lat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

