'use client'

import * as React from 'react'
import {
  Search,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Plus,
  Maximize2,
  CheckCircle2,
  X,
  Info,
  MoreVertical,
  Calendar as CalendarIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const times = ['04:30', '04:35', '04:40', '04:45', '04:50', '04:55', '05:00', '05:05', '05:10', '05:15', '05:20', '05:25', '05:30']

const instances = [
  { id: 'i-069e079e255676fa5', name: 'prod-calcounti', type: 't3.xlarge', state: 'Running', checks: '3/3 checks passed', zone: 'il-central-1c', selected: true },
  { id: 'i-08486c2fac75b6a99', name: 'prod-calcounti-db', type: 'm7i.4xlarge', state: 'Running', checks: '3/3 checks passed', zone: 'il-central-1c', selected: true },
  { id: 'i-031f5c861ab61ef51', name: 'calcounti-backend', type: 't3.micro', state: 'Running', checks: '3/3 checks passed', zone: 'il-central-1b', selected: false },
]

function generateData(base1: number, delta1: number, base2: number, delta2: number) {
  return times.map((t, i) => {
    // using pseudo-random based on index to prevent hydration mismatches
    const r1 = Math.abs(Math.sin(i * 13.5));
    const r2 = Math.abs(Math.cos(i * 7.1));
    return {
      time: t,
      instance1: parseFloat(Math.max(0, base1 + (r1 * delta1 - (delta1 / 2))).toFixed(2)),
      instance2: parseFloat(Math.max(0, base2 + (r2 * delta2 - (delta2 / 2))).toFixed(2)),
    }
  })
}

const charts = [
  { title: 'CPU utilization (%)', unit: 'Percent', format: (v: number) => `${v}%`, data: times.map((t, i) => ({ time: t, instance1: parseFloat((2.8 + Math.sin(i)*0.1 + Math.abs(Math.cos(i*3))*0.1).toFixed(2)), instance2: parseFloat((0.6 + Math.cos(i)*0.2 + Math.abs(Math.sin(i*2))*0.2).toFixed(2)) })) },
  { title: 'Network in (bytes)', unit: 'Bytes', format: (v: number) => `${v}k`, data: generateData(500, 200, 100, 20) },
  { title: 'Network out (bytes)', unit: 'Bytes', format: (v: number) => `${v}M`, data: generateData(18, 5, 2, 0.5) },
  { title: 'Network packets in (count)', unit: 'Count', format: (v: number) => `${v}K`, data: generateData(5, 2, 1, 0.2) },
  { title: 'Network packets out (count)', unit: 'Count', format: (v: number) => `${v}K`, data: generateData(12, 4, 3, 1) },
  { title: 'Metadata no token (count)', unit: 'Count', format: (v: number) => `${v}`, data: generateData(0, 0, 0, 0) },
  { title: 'CPU credit usage (count)', unit: 'Count', format: (v: number) => `${v}`, data: generateData(0.5, 0.1, 0, 0) },
  { title: 'CPU credit balance (count)', unit: 'Count', format: (v: number) => `${v}K`, data: generateData(2, 0.5, 4, 1) },
]

export function ServerConsumptionPage() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen -m-6 p-6 bg-[#0f141c] flex items-center justify-center" suppressHydrationWarning>
        <div className="text-gray-500 text-sm">Loading instance data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen -m-6 p-6 bg-[#f8f9fa] text-[#111827] font-sans text-sm" suppressHydrationWarning>
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Active Instances <span className="text-gray-400 font-normal text-lg">(2/4)</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"><RefreshCw className="h-4 w-4" /></button>
          <button className="px-4 py-2 font-medium border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors">Connect</button>
          <button className="flex items-center gap-2 px-4 py-2 font-medium border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors">Instance state <ChevronDown className="h-4 w-4 text-gray-500" /></button>
          <button className="flex items-center gap-2 px-4 py-2 font-medium border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors">Actions <ChevronDown className="h-4 w-4 text-gray-500" /></button>
          <div className="flex items-center rounded-lg overflow-hidden shadow-sm border border-[#111827]">
            <button className="px-4 py-2 font-semibold bg-[#111827] text-white hover:bg-gray-800 transition-colors">Launch instances</button>
            <button className="px-3 py-2 bg-[#111827] text-white hover:bg-gray-800 transition-colors border-l border-gray-600"><ChevronDown className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 mb-6 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <span className="text-[10px] text-gray-500 absolute -top-2 left-2 bg-white px-1 font-semibold uppercase tracking-wider">Saved filters</span>
            <button className="flex items-center justify-between w-40 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 font-medium">
              Choose filter <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 bg-white border border-gray-200 shadow-sm px-2 py-0.5 rounded-md text-xs font-medium text-gray-700">
                <span>State = running</span>
                <button className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
              </div>
            </div>
            <input type="text" placeholder="Search by attribute or tag..." className="bg-transparent border-none outline-none flex-1 ml-2 text-sm placeholder:text-gray-400" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 font-medium border border-transparent rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">
            Clear
          </button>
        </div>
        <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
          <div className="flex gap-3 text-gray-400">
            <ChevronLeft className="h-5 w-5 cursor-not-allowed" />
            <span className="text-[#111827] font-medium text-sm">1</span>
            <ChevronRight className="h-5 w-5 cursor-pointer hover:text-[#111827]" />
          </div>
          <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-[#111827]" />
        </div>
      </div>

      {/* Instances Table */}
      <div className="bg-white border border-gray-200 border-b-0 rounded-t-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 w-8"><div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center shadow-sm"><div className="w-2 h-0.5 bg-gray-400"></div></div></th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Name <ChevronDown className="h-3.5 w-3.5 inline ml-1" /></th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Instance ID</th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Instance State <ChevronDown className="h-3.5 w-3.5 inline ml-1" /></th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Instance Type</th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Status Check</th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Alarm Status</th>
              <th className="px-3 py-3 cursor-pointer hover:text-[#111827] transition-colors">Zone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {instances.map((inst, idx) => (
              <tr key={inst.id} className={`${inst.selected ? 'bg-blue-50/40' : 'hover:bg-gray-50 transition-colors'}`}>
                <td className="px-4 py-3">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center shadow-sm ${inst.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                    {inst.selected && <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={4} />}
                  </div>
                </td>
                <td className="px-3 py-3 font-semibold text-[#111827]">{inst.name}</td>
                <td className="px-3 py-3 text-blue-600 font-mono text-xs cursor-pointer hover:underline">{inst.id}</td>
                <td className="px-3 py-3 flex items-center gap-2 font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> {inst.state}</td>
                <td className="px-3 py-3 text-gray-600">{inst.type}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> {inst.checks}</div>
                </td>
                <td className="px-3 py-3"><a href="#" className="flex items-center text-blue-600 font-medium hover:underline">View alarms <Plus className="h-3 w-3 ml-0.5" /></a></td>
                <td className="px-3 py-3 text-gray-600">{inst.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resize Handle */}
      <div className="flex justify-center -mt-px relative z-10 border-t border-b border-gray-200 bg-gray-50 cursor-row-resize h-4 shadow-sm rounded-b-xl">
        <div className="w-12 h-1 bg-gray-300 mt-1.5 rounded-full"></div>
      </div>

      {/* Bottom Pane Header */}
      <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">2 instances selected</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">Alarm recommendations</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1">Configure CloudWatch agent <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            {['3h', '1d', '1w', '1h'].map(t => (
              <button key={t} className={`px-4 py-1.5 text-sm font-medium border-l border-gray-200 first:border-0 ${t === '1h' ? 'bg-blue-50 text-blue-600 shadow-inner' : 'hover:bg-gray-50 text-gray-600'}`}>{t}</button>
            ))}
            <button className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-500 border-l border-gray-200 flex items-center"><CalendarIcon className="h-4 w-4" /></button>
            <button className="px-4 py-1.5 text-sm font-medium border-l border-gray-200 bg-white hover:bg-gray-50 text-blue-600">Custom</button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm font-medium text-sm text-gray-700 hover:bg-gray-50">
            UTC Timezone <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          <button className="flex items-center justify-center p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-blue-600 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 px-4 py-1.5 font-medium border border-gray-200 rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50">
            <ExternalLink className="h-4 w-4 text-gray-400" /> Explore related
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-6 px-1">
        <div className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700 font-medium text-sm">i-069e079e255676fa5 <span className="text-gray-400">(prod-calcounti)</span></span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-700 font-medium text-sm">i-08486c2fac75b6a99 <span className="text-gray-400">(prod-calcounti-db)</span></span>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
        {charts.map((chart, idx) => (
          <div key={idx} className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 relative group hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-[#111827] text-sm group-hover:text-blue-600 transition-colors">{chart.title}</h3>
                <div className="text-xs font-semibold text-gray-400 mt-0.5">{chart.unit}</div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-100 text-gray-500 rounded"><Info className="h-4 w-4" /></button>
                <button className="p-1 hover:bg-gray-100 text-gray-500 rounded"><Maximize2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="h-36 w-full ml-[-20px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                    stroke="#e5e7eb" 
                    tickLine={{ stroke: '#e5e7eb' }}
                    minTickGap={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                    stroke="transparent" 
                    tickFormatter={chart.format}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}
                    formatter={(value: any, name: any) => {
                      if (name === 'instance1') return [value, 'i-069e079e255676fa5']
                      if (name === 'instance2') return [value, 'i-08486c2fac75b6a99']
                      return [value, name]
                    }}
                  />
                  <Line type="linear" dataKey="instance1" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="linear" dataKey="instance2" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

