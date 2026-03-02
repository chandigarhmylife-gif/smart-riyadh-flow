// ─── Template configurations: 10 distinct report types ───────────────────────

export const TEMPLATE_CONFIGS = {

  // ── 1. Performance Summary ── Executive/green/teal
  summary: {
    theme: {
      cover: 'from-emerald-900 via-emerald-800 to-teal-600',
      accent: '#10B981', accentText: 'text-emerald-700', accentBg: 'bg-emerald-50',
      accentBorder: 'border-emerald-200',
      headerGradients: ['from-emerald-700 to-teal-500', 'from-teal-700 to-cyan-500', 'from-emerald-600 to-green-400'],
      tableHeader: 'bg-gradient-to-r from-emerald-700 to-teal-600',
      kpiColor: 'text-emerald-700', badgeGood: 'bg-emerald-100 text-emerald-700',
    },
    label: 'Executive Performance Summary', audience: 'City Council & Senior Leadership',
    focusAreas: ['KPIs at a glance', 'System health overview', 'Top wins', 'Strategic next steps'],
    kpis: [
      { label: 'Wait Time Saved', ai: 33, fixed: 71, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Vehicles/Hour', ai: 1950, fixed: 1340, unit: '', better: 'higher', icon: 'Car' },
      { label: 'Network Efficiency', ai: 94, fixed: 61, unit: '%', better: 'higher', icon: 'Zap' },
      { label: 'Emissions Down', ai: 42, fixed: 0, unit: '%', better: 'higher', icon: 'Leaf' },
    ],
    coverStats: [
      { label: 'Intersections', value: '24' }, { label: 'Uptime', value: '99.7%' },
      { label: 'Improvement', value: '43%' }, { label: 'CO₂ Saved', value: '4.2T/day' },
    ],
    recommendations: [
      { priority: 'High', text: 'Full network AI rollout — projected 43% city-wide wait time reduction.', dept: 'Executive Office' },
      { priority: 'High', text: 'Secure SAR 120M budget allocation for Phase 2 sensor expansion.', dept: 'Finance' },
      { priority: 'Medium', text: 'Publish quarterly citizen-facing traffic performance scorecards.', dept: 'Communications' },
      { priority: 'Low', text: 'Establish a cross-ministry traffic data sharing agreement.', dept: 'Policy' },
    ],
    chartData: {
      waitBar: [
        { period: 'Morning', ai: 35, fixed: 67 }, { period: 'Midday', ai: 22, fixed: 40 },
        { period: 'Evening', ai: 45, fixed: 84 }, { period: 'Night', ai: 14, fixed: 25 },
      ],
      emissionsPie: [{ name: 'CO₂ Saved', value: 42 }, { name: 'Remaining', value: 58 }],
    },
  },

  // ── 2. Daily Analysis ── Operational/blue/indigo
  daily: {
    theme: {
      cover: 'from-blue-950 via-blue-900 to-indigo-700',
      accent: '#1E40AF', accentText: 'text-blue-700', accentBg: 'bg-blue-50',
      accentBorder: 'border-blue-200',
      headerGradients: ['from-blue-700 to-indigo-600', 'from-indigo-700 to-blue-500', 'from-blue-600 to-sky-400', 'from-indigo-600 to-purple-500'],
      tableHeader: 'bg-gradient-to-r from-blue-800 to-indigo-700',
      kpiColor: 'text-blue-700', badgeGood: 'bg-blue-100 text-blue-700',
    },
    label: 'Daily Traffic Analysis', audience: 'Traffic Engineers & Operations Team',
    focusAreas: ['Hour-by-hour breakdown', 'Peak period deep dive', 'Intersection-level LOS', 'Incident log'],
    kpis: [
      { label: 'Peak Wait (AI)', ai: 48, fixed: 89, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Off-Peak Wait', ai: 14, fixed: 26, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Avg Throughput', ai: 1820, fixed: 1290, unit: ' v/hr', better: 'higher', icon: 'Car' },
      { label: 'Stop Events/km', ai: 7, fixed: 18, unit: '', better: 'lower', icon: 'AlertTriangle' },
    ],
    coverStats: [
      { label: 'Hours Analyzed', value: '24h' }, { label: 'Data Points', value: '1.2M' },
      { label: 'Peak Reduction', value: '46%' }, { label: 'Incidents', value: '3' },
    ],
    chartData: {
      hourlyLine: [
        { hour: '5AM', ai: 11, fixed: 19 }, { hour: '6AM', ai: 22, fixed: 41 },
        { hour: '7AM', ai: 35, fixed: 67 }, { hour: '8AM', ai: 48, fixed: 89 },
        { hour: '9AM', ai: 31, fixed: 58 }, { hour: '10AM', ai: 24, fixed: 44 },
        { hour: '11AM', ai: 21, fixed: 39 }, { hour: '12PM', ai: 28, fixed: 51 },
        { hour: '1PM', ai: 26, fixed: 48 }, { hour: '2PM', ai: 23, fixed: 42 },
        { hour: '3PM', ai: 29, fixed: 53 }, { hour: '4PM', ai: 44, fixed: 81 },
        { hour: '5PM', ai: 48, fixed: 89 }, { hour: '6PM', ai: 39, fixed: 72 },
        { hour: '7PM', ai: 27, fixed: 49 }, { hour: '8PM', ai: 18, fixed: 33 },
      ],
      intersectionData: [
        { name: 'King Fahd / Olaya', los: 'A', wait: 28, flow: 96, volume: 2340 },
        { name: 'Tahlia / King Abdullah', los: 'B', wait: 34, flow: 91, volume: 2100 },
        { name: 'Uruba / Prince Sultan', los: 'B', wait: 37, flow: 88, volume: 1890 },
        { name: 'Makkah Rd / Exit 7', los: 'C', wait: 51, flow: 79, volume: 1650 },
        { name: 'Northern Ring / Hala', los: 'C', wait: 55, flow: 74, volume: 1420 },
        { name: 'Salah Al-Din / King Faisal', los: 'A', wait: 24, flow: 98, volume: 2560 },
      ],
      incidents: [
        { time: '07:42', location: 'King Fahd Rd NB', type: 'Congestion', duration: '18 min', response: 'Signal offset applied' },
        { time: '12:15', location: 'Olaya St / Faisaliyyah', type: 'Stall', duration: '9 min', response: 'Manual override' },
        { time: '17:08', location: 'Northern Ring / Exit 12', type: 'Accident', duration: '34 min', response: 'Emergency preemption' },
      ],
    },
  },

  // ── 3. Comparison Report ── Policy/purple/violet
  comparison: {
    theme: {
      cover: 'from-purple-950 via-purple-900 to-violet-700',
      accent: '#7C3AED', accentText: 'text-purple-700', accentBg: 'bg-purple-50',
      accentBorder: 'border-purple-200',
      headerGradients: ['from-purple-700 to-violet-600', 'from-violet-700 to-purple-500', 'from-purple-600 to-indigo-500'],
      tableHeader: 'bg-gradient-to-r from-purple-800 to-violet-700',
      kpiColor: 'text-purple-700', badgeGood: 'bg-purple-100 text-purple-700',
    },
    label: 'AI vs Fixed-Time Comparison', audience: 'Procurement, Policy & Technical Review Committees',
    focusAreas: ['Side-by-side metric analysis', 'Multi-dimensional radar', 'ROI & cost-benefit', 'Benchmarks'],
    kpis: [
      { label: 'Wait Time Δ', ai: 38, fixed: 71, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Throughput Δ', ai: 1950, fixed: 1340, unit: ' v/hr', better: 'higher', icon: 'Car' },
      { label: 'Fuel Saved', ai: 6.1, fixed: 8.4, unit: 'L/100km', better: 'lower', icon: 'Zap' },
      { label: 'CO₂ Saved/yr', ai: 1570, fixed: 0, unit: ' T', better: 'higher', icon: 'Leaf' },
    ],
    coverStats: [
      { label: 'Methods Compared', value: '2' }, { label: 'Metrics', value: '18' },
      { label: 'Cost Saving/yr', value: '1.2B SAR' }, { label: 'ROI Period', value: '2.4 yrs' },
    ],
    chartData: {
      radar: [
        { metric: 'Throughput', ai: 95, fixed: 65 }, { metric: 'Wait Time', ai: 88, fixed: 45 },
        { metric: 'Efficiency', ai: 92, fixed: 60 }, { metric: 'Safety', ai: 87, fixed: 70 },
        { metric: 'Emissions', ai: 90, fixed: 55 }, { metric: 'Reliability', ai: 93, fixed: 62 },
        { metric: 'Cost', ai: 78, fixed: 52 },
      ],
      weeklyBar: [
        { day: 'Mon', ai: 1820, fixed: 1340 }, { day: 'Tue', ai: 1950, fixed: 1380 },
        { day: 'Wed', ai: 1870, fixed: 1290 }, { day: 'Thu', ai: 2010, fixed: 1420 },
        { day: 'Fri', ai: 2180, fixed: 1510 }, { day: 'Sat', ai: 1640, fixed: 1180 },
        { day: 'Sun', ai: 1390, fixed: 1020 },
      ],
      comparisonRows: [
        { metric: 'Avg Wait Time', fixed: '71s', ai: '38s', imp: '46%↓', annual: '2.1M hrs saved' },
        { metric: 'Vehicle Throughput', fixed: '1,340/hr', ai: '1,950/hr', imp: '45%↑', annual: '+223M vehicles' },
        { metric: 'Signal Efficiency', fixed: '61%', ai: '92%', imp: '51%↑', annual: 'Full network' },
        { metric: 'Fuel Consumption', fixed: '8.4L/100km', ai: '6.1L/100km', imp: '27%↓', annual: '1.2B SAR saved' },
        { metric: 'CO₂ Emissions', fixed: '10.2 t/day', ai: '5.9 t/day', imp: '42%↓', annual: '1,570 t saved' },
        { metric: 'Stop-and-Go Events', fixed: '18/km', ai: '7/km', imp: '61%↓', annual: 'Reduced wear' },
        { metric: 'Travel Time Reliability', fixed: '54%', ai: '89%', imp: '65%↑', annual: 'Customer satisfaction' },
      ],
    },
  },

  // ── 4. Performance Metrics ── Technical/orange/amber
  performance: {
    theme: {
      cover: 'from-orange-950 via-orange-900 to-amber-700',
      accent: '#D97706', accentText: 'text-amber-700', accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-200',
      headerGradients: ['from-orange-700 to-amber-600', 'from-amber-700 to-yellow-500', 'from-orange-600 to-red-500', 'from-amber-600 to-orange-400'],
      tableHeader: 'bg-gradient-to-r from-orange-800 to-amber-700',
      kpiColor: 'text-amber-700', badgeGood: 'bg-amber-100 text-amber-700',
    },
    label: 'Comprehensive Metrics & KPI Report', audience: 'Traffic Engineering & Data Science Teams',
    focusAreas: ['15 KPI deep-dive', 'Signal phase analysis', 'Queue modeling', 'Model metrics', 'Global benchmarks'],
    kpis: [
      { label: 'Peak Hour Factor', ai: 0.94, fixed: 0.71, unit: '', better: 'higher', icon: 'TrendingUp' },
      { label: 'Avg Queue Length', ai: 4.2, fixed: 11.8, unit: ' veh', better: 'lower', icon: 'Car' },
      { label: 'Signal Cycle Eff.', ai: 94, fixed: 61, unit: '%', better: 'higher', icon: 'Zap' },
      { label: 'Travel Time Idx', ai: 1.12, fixed: 1.74, unit: '', better: 'lower', icon: 'Clock' },
    ],
    coverStats: [
      { label: 'KPIs Tracked', value: '15' }, { label: 'Sensors Active', value: '312' },
      { label: 'Model Accuracy', value: '96.4%' }, { label: 'Data Latency', value: '<1.2s' },
    ],
    chartData: {
      throughputLine: [
        { day: 'Mon', ai: 1820, fixed: 1340, target: 2000 }, { day: 'Tue', ai: 1950, fixed: 1380, target: 2000 },
        { day: 'Wed', ai: 1870, fixed: 1290, target: 2000 }, { day: 'Thu', ai: 2010, fixed: 1420, target: 2000 },
        { day: 'Fri', ai: 2180, fixed: 1510, target: 2000 }, { day: 'Sat', ai: 1640, fixed: 1180, target: 2000 },
        { day: 'Sun', ai: 1390, fixed: 1020, target: 2000 },
      ],
      queueBar: [
        { intersection: 'King Fahd', aiQ: 3.1, fixedQ: 9.8 }, { intersection: 'Tahlia', aiQ: 4.2, fixedQ: 11.4 },
        { intersection: 'Uruba', aiQ: 4.8, fixedQ: 12.9 }, { intersection: 'Makkah Rd', aiQ: 6.1, fixedQ: 14.2 },
        { intersection: 'N. Ring', aiQ: 6.8, fixedQ: 15.7 },
      ],
      metricsRows: [
        { metric: 'Peak Hour Factor (PHF)', ai: '0.94', fixed: '0.71', benchmark: '0.85', status: 'Exceeds' },
        { metric: 'Volume/Capacity Ratio', ai: '0.68', fixed: '0.91', benchmark: '0.75', status: 'Exceeds' },
        { metric: 'Avg Queue Length (veh)', ai: '4.2', fixed: '11.8', benchmark: '6.0', status: 'Exceeds' },
        { metric: 'Travel Time Index', ai: '1.12', fixed: '1.74', benchmark: '1.25', status: 'Exceeds' },
        { metric: 'Stop Rate (stops/veh)', ai: '0.31', fixed: '0.87', benchmark: '0.50', status: 'Exceeds' },
        { metric: 'Signal Cycle Efficiency', ai: '94%', fixed: '61%', benchmark: '80%', status: 'Exceeds' },
        { metric: 'Model Prediction Acc.', ai: '96.4%', fixed: 'N/A', benchmark: '90%', status: 'Exceeds' },
        { metric: 'Avg Detection Latency', ai: '1.2s', fixed: 'N/A', benchmark: '2.0s', status: 'Exceeds' },
      ],
    },
  },

  // ── 5. Environmental Impact ── Sustainability/green-lime
  environmental: {
    theme: {
      cover: 'from-green-900 via-lime-800 to-green-600',
      accent: '#22C55E', accentText: 'text-green-700', accentBg: 'bg-green-50',
      accentBorder: 'border-green-200',
      headerGradients: ['from-green-700 to-lime-600', 'from-lime-700 to-green-500', 'from-green-600 to-teal-500'],
      tableHeader: 'bg-gradient-to-r from-green-700 to-lime-600',
      kpiColor: 'text-green-700', badgeGood: 'bg-green-100 text-green-700',
    },
    label: 'Environmental Impact Report', audience: 'Sustainability Officers & Vision 2030 Committee',
    focusAreas: ['CO₂ & emissions analysis', 'Fuel savings', 'Noise reduction', 'Vision 2030 alignment'],
    kpis: [
      { label: 'CO₂ Saved/Day', ai: 4.2, fixed: 0, unit: ' T', better: 'higher', icon: 'Leaf' },
      { label: 'Fuel Saved', ai: 12400, fixed: 0, unit: ' L/day', better: 'higher', icon: 'Zap' },
      { label: 'NOx Reduction', ai: 38, fixed: 0, unit: '%', better: 'higher', icon: 'TrendingUp' },
      { label: 'Idle Time Cut', ai: 61, fixed: 0, unit: '%', better: 'higher', icon: 'Clock' },
    ],
    coverStats: [
      { label: 'CO₂ Saved/Year', value: '1,533 T' }, { label: 'Fuel Cost Saved', value: 'SAR 3.3M' },
      { label: 'Trees Equivalent', value: '70,300' }, { label: 'Vision 2030', value: '✓ Aligned' },
    ],
    chartData: {
      monthlyEmissions: [
        { month: 'Jan', ai: 5.9, fixed: 10.2 }, { month: 'Feb', ai: 5.7, fixed: 10.0 },
        { month: 'Mar', ai: 6.1, fixed: 10.5 }, { month: 'Apr', ai: 5.8, fixed: 10.1 },
        { month: 'May', ai: 6.3, fixed: 10.8 }, { month: 'Jun', ai: 6.5, fixed: 11.2 },
      ],
      vehicleTypePie: [
        { name: 'Passenger Cars', value: 58 }, { name: 'SUVs', value: 24 },
        { name: 'Buses', value: 9 }, { name: 'Trucks', value: 6 }, { name: 'Motorcycles', value: 3 },
      ],
      impactRows: [
        { category: 'CO₂ Emissions', daily: '4.3 T saved', annual: '1,569 T', equivalent: '70,300 trees/yr', vision2030: '✓' },
        { category: 'NOx Pollutants', daily: '12 kg saved', annual: '4,380 kg', equivalent: 'Cleaner air index +18%', vision2030: '✓' },
        { category: 'Fuel Consumption', daily: '12,400 L saved', annual: '4.5M L', equivalent: 'SAR 3.3M cost saving', vision2030: '✓' },
        { category: 'Noise Pollution', daily: '−8 dB avg', annual: 'Sustained', equivalent: 'Improved urban livability', vision2030: '✓' },
        { category: 'Idling Time', daily: '61% reduction', annual: 'City-wide', equivalent: '2.1M hrs saved', vision2030: '✓' },
      ],
    },
  },

  // ── 6. Peak Hour Analysis ── red/rose, congestion-focused
  peak_hour: {
    theme: {
      cover: 'from-red-900 via-rose-800 to-red-600',
      accent: '#EF4444', accentText: 'text-red-700', accentBg: 'bg-red-50',
      accentBorder: 'border-red-200',
      headerGradients: ['from-red-700 to-rose-600', 'from-rose-700 to-pink-600', 'from-red-600 to-orange-500'],
      tableHeader: 'bg-gradient-to-r from-red-800 to-rose-700',
      kpiColor: 'text-red-700', badgeGood: 'bg-red-100 text-red-700',
    },
    label: 'Peak Hour Congestion Report', audience: 'Operations Center & Traffic Control Room',
    focusAreas: ['Morning & evening peak analysis', 'Bottleneck mapping', 'Queue propagation', 'Emergency response'],
    kpis: [
      { label: 'AM Peak Wait (AI)', ai: 42, fixed: 87, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'PM Peak Wait (AI)', ai: 48, fixed: 92, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Max Queue (AI)', ai: 6.2, fixed: 18.4, unit: ' veh', better: 'lower', icon: 'Car' },
      { label: 'Throughput Peak', ai: 2180, fixed: 1510, unit: ' v/hr', better: 'higher', icon: 'TrendingUp' },
    ],
    coverStats: [
      { label: 'AM Peak Duration', value: '2h 15m' }, { label: 'PM Peak Duration', value: '3h 00m' },
      { label: 'Bottlenecks', value: '7 sites' }, { label: 'Clearance Time', value: '−34%' },
    ],
    chartData: {
      peakProfile: [
        { time: '6AM', am: 22, pm: null }, { time: '7AM', am: 55, pm: null }, { time: '8AM', am: 87, pm: null },
        { time: '9AM', am: 48, pm: null }, { time: '10AM', am: 24, pm: null },
        { time: '3PM', am: null, pm: 31 }, { time: '4PM', am: null, pm: 78 },
        { time: '5PM', am: null, pm: 92 }, { time: '6PM', am: null, pm: 67 }, { time: '7PM', am: null, pm: 39 },
      ],
      bottlenecks: [
        { location: 'King Fahd Rd NB / Exit 9', severity: 'Critical', maxQueue: '18 veh', clearTime: '42 min', aiAction: 'Phase extension' },
        { location: 'Olaya St / Al-Uruba Rd', severity: 'High', maxQueue: '14 veh', clearTime: '28 min', aiAction: 'Green wave' },
        { location: 'Northern Ring / KAFD', severity: 'High', maxQueue: '12 veh', clearTime: '31 min', aiAction: 'Split adjustment' },
        { location: 'Makkah Rd / Rawdah', severity: 'Medium', maxQueue: '9 veh', clearTime: '19 min', aiAction: 'Cycle shortening' },
        { location: 'Prince Sultan / Tahlia', severity: 'Medium', maxQueue: '8 veh', clearTime: '16 min', aiAction: 'Offset tuning' },
      ],
      hourlyComparison: [
        { hour: '7AM', ai: 42, fixed: 87 }, { hour: '8AM', ai: 48, fixed: 92 }, { hour: '9AM', ai: 31, fixed: 58 },
        { hour: '4PM', ai: 44, fixed: 81 }, { hour: '5PM', ai: 48, fixed: 89 }, { hour: '6PM', ai: 39, fixed: 72 },
      ],
    },
  },

  // ── 7. Monthly Trend Report ── slate/cyan, trend analysis
  monthly_trend: {
    theme: {
      cover: 'from-slate-900 via-slate-800 to-cyan-700',
      accent: '#0891B2', accentText: 'text-cyan-700', accentBg: 'bg-cyan-50',
      accentBorder: 'border-cyan-200',
      headerGradients: ['from-slate-700 to-cyan-600', 'from-cyan-700 to-sky-500', 'from-slate-600 to-blue-500'],
      tableHeader: 'bg-gradient-to-r from-slate-700 to-cyan-700',
      kpiColor: 'text-cyan-700', badgeGood: 'bg-cyan-100 text-cyan-700',
    },
    label: 'Monthly Trend Analysis', audience: 'Planning Department & Municipal Authority',
    focusAreas: ['6-month performance trends', 'Month-over-month change', 'Seasonal patterns', 'Growth forecasting'],
    kpis: [
      { label: 'MoM Efficiency Gain', ai: 3.2, fixed: 0, unit: '%', better: 'higher', icon: 'TrendingUp' },
      { label: '6-Month Avg Wait', ai: 36, fixed: 70, unit: 's', better: 'lower', icon: 'Clock' },
      { label: 'Trend Score', ai: 94, fixed: 61, unit: '/100', better: 'higher', icon: 'Zap' },
      { label: 'Network Coverage', ai: 78, fixed: 0, unit: '%', better: 'higher', icon: 'Target' },
    ],
    coverStats: [
      { label: 'Months Analyzed', value: '6' }, { label: 'Data Completeness', value: '99.1%' },
      { label: 'YoY Improvement', value: '+31%' }, { label: 'Forecast Accuracy', value: '94.2%' },
    ],
    chartData: {
      monthlyTrend: [
        { month: 'Sep', efficiency: 74, waitAI: 44, waitFixed: 73 },
        { month: 'Oct', efficiency: 79, waitAI: 41, waitFixed: 72 },
        { month: 'Nov', efficiency: 83, waitAI: 39, waitFixed: 71 },
        { month: 'Dec', efficiency: 87, waitAI: 37, waitFixed: 71 },
        { month: 'Jan', efficiency: 91, waitAI: 36, waitFixed: 70 },
        { month: 'Feb', efficiency: 94, waitAI: 33, waitFixed: 70 },
      ],
      growthBar: [
        { metric: 'Efficiency', sep: 74, feb: 94, change: '+27%' },
        { metric: 'Throughput', sep: 1620, feb: 1950, change: '+20%' },
        { metric: 'Coverage', sep: 45, feb: 78, change: '+73%' },
        { metric: 'Satisfaction', sep: 62, feb: 88, change: '+42%' },
      ],
      forecastLine: [
        { month: 'Mar', forecast: 95, actual: null }, { month: 'Apr', forecast: 96, actual: null },
        { month: 'May', forecast: 97, actual: null },
      ],
    },
  },

  // ── 8. Safety & Incident Report ── dark/yellow, safety-focused
  safety: {
    theme: {
      cover: 'from-yellow-900 via-yellow-800 to-amber-600',
      accent: '#F59E0B', accentText: 'text-yellow-700', accentBg: 'bg-yellow-50',
      accentBorder: 'border-yellow-200',
      headerGradients: ['from-yellow-700 to-amber-600', 'from-amber-700 to-orange-500', 'from-yellow-600 to-orange-400'],
      tableHeader: 'bg-gradient-to-r from-yellow-700 to-amber-600',
      kpiColor: 'text-yellow-700', badgeGood: 'bg-yellow-100 text-yellow-700',
    },
    label: 'Safety & Incident Analysis Report', audience: 'Traffic Safety Authority & Emergency Services',
    focusAreas: ['Incident frequency', 'Near-miss analysis', 'Emergency response times', 'Risk heatmap'],
    kpis: [
      { label: 'Incident Reduction', ai: 38, fixed: 0, unit: '%', better: 'higher', icon: 'AlertTriangle' },
      { label: 'Avg Response Time', ai: 4.2, fixed: 8.7, unit: ' min', better: 'lower', icon: 'Clock' },
      { label: 'Near-Miss Events', ai: 12, fixed: 47, unit: '/week', better: 'lower', icon: 'AlertTriangle' },
      { label: 'Safety Score', ai: 91, fixed: 63, unit: '/100', better: 'higher', icon: 'TrendingUp' },
    ],
    coverStats: [
      { label: 'Incidents (Period)', value: '23' }, { label: 'Response Avg', value: '4.2 min' },
      { label: 'Severity Reduced', value: '−41%' }, { label: 'Preemptions', value: '14' },
    ],
    chartData: {
      incidentTrend: [
        { week: 'W1', ai: 8, fixed: 18 }, { week: 'W2', ai: 6, fixed: 16 },
        { week: 'W3', ai: 5, fixed: 17 }, { week: 'W4', ai: 4, fixed: 15 },
      ],
      incidentTypePie: [
        { name: 'Congestion', value: 42 }, { name: 'Stalls', value: 28 },
        { name: 'Accidents', value: 18 }, { name: 'Pedestrian', value: 12 },
      ],
      safetyIncidents: [
        { date: '2026-02-03', location: 'King Fahd / Exit 9', type: 'Accident', severity: 'High', responseTime: '3.8 min', outcome: 'Preemption activated' },
        { date: '2026-02-07', location: 'Tahlia / Al-Uruba', type: 'Near-Miss', severity: 'Medium', responseTime: '2.1 min', outcome: 'Signal re-phased' },
        { date: '2026-02-12', location: 'N. Ring / KAFD', type: 'Stall', severity: 'Low', responseTime: '5.4 min', outcome: 'Tow dispatched' },
        { date: '2026-02-18', location: 'Olaya St / Faisaliyyah', type: 'Congestion', severity: 'High', responseTime: '4.9 min', outcome: 'Green wave applied' },
        { date: '2026-02-25', location: 'Makkah Rd / Rawdah', type: 'Accident', severity: 'Critical', responseTime: '3.2 min', outcome: 'Emergency preemption' },
      ],
    },
  },

  // ── 9. Network Efficiency Report ── indigo/sky, network-wide focus
  network: {
    theme: {
      cover: 'from-indigo-950 via-sky-900 to-indigo-700',
      accent: '#4F46E5', accentText: 'text-indigo-700', accentBg: 'bg-indigo-50',
      accentBorder: 'border-indigo-200',
      headerGradients: ['from-indigo-700 to-sky-600', 'from-sky-700 to-indigo-500', 'from-indigo-600 to-blue-400'],
      tableHeader: 'bg-gradient-to-r from-indigo-800 to-sky-700',
      kpiColor: 'text-indigo-700', badgeGood: 'bg-indigo-100 text-indigo-700',
    },
    label: 'Network-Wide Efficiency Report', audience: 'City Infrastructure & Smart City Division',
    focusAreas: ['Full network overview', 'Corridor performance', 'Green wave coordination', 'Connectivity index'],
    kpis: [
      { label: 'Network Efficiency', ai: 92, fixed: 59, unit: '%', better: 'higher', icon: 'Zap' },
      { label: 'Green Wave Uptime', ai: 87, fixed: 0, unit: '%', better: 'higher', icon: 'TrendingUp' },
      { label: 'Coordinated Signals', ai: 186, fixed: 0, unit: '', better: 'higher', icon: 'Target' },
      { label: 'Avg Travel Speed', ai: 54, fixed: 31, unit: ' km/h', better: 'higher', icon: 'Car' },
    ],
    coverStats: [
      { label: 'Total Signals', value: '248' }, { label: 'AI-Controlled', value: '186' },
      { label: 'Corridors', value: '12' }, { label: 'Avg Connectivity', value: '94.2%' },
    ],
    chartData: {
      corridorBar: [
        { corridor: 'King Fahd Rd', efficiency: 96, speed: 58 }, { corridor: 'Olaya St', efficiency: 91, speed: 51 },
        { corridor: 'Northern Ring', efficiency: 88, speed: 49 }, { corridor: 'Makkah Rd', efficiency: 84, speed: 46 },
        { corridor: 'Prince Sultan', efficiency: 79, speed: 42 }, { corridor: 'Tahlia St', efficiency: 93, speed: 54 },
      ],
      networkRadar: [
        { metric: 'Coverage', value: 78 }, { metric: 'Coordination', value: 87 },
        { metric: 'Reliability', value: 93 }, { metric: 'Adaptability', value: 91 },
        { metric: 'Speed Flow', value: 86 }, { metric: 'Green Wave', value: 87 },
      ],
      connectivityTrend: [
        { month: 'Sep', pct: 45 }, { month: 'Oct', pct: 54 }, { month: 'Nov', pct: 63 },
        { month: 'Dec', pct: 71 }, { month: 'Jan', pct: 78 }, { month: 'Feb', pct: 87 },
      ],
    },
  },

  // ── 10. ROI & Cost-Benefit Report ── dark/gold, financial focus
  roi: {
    theme: {
      cover: 'from-gray-950 via-gray-900 to-yellow-800',
      accent: '#CA8A04', accentText: 'text-yellow-700', accentBg: 'bg-yellow-50',
      accentBorder: 'border-yellow-300',
      headerGradients: ['from-gray-800 to-yellow-700', 'from-yellow-800 to-amber-600', 'from-gray-700 to-yellow-600'],
      tableHeader: 'bg-gradient-to-r from-gray-800 to-yellow-700',
      kpiColor: 'text-yellow-700', badgeGood: 'bg-yellow-100 text-yellow-700',
    },
    label: 'ROI & Cost-Benefit Analysis', audience: 'Finance Ministry & Investment Committees',
    focusAreas: ['Full financial ROI model', 'Break-even analysis', 'Annual savings projection', 'Cost per intersection'],
    kpis: [
      { label: 'Annual Savings', ai: 1200, fixed: 0, unit: 'M SAR', better: 'higher', icon: 'TrendingUp' },
      { label: 'ROI Period', ai: 2.4, fixed: 0, unit: ' yrs', better: 'higher', icon: 'Clock' },
      { label: 'Cost per Signal', ai: 48000, fixed: 0, unit: ' SAR', better: 'higher', icon: 'Zap' },
      { label: '10-Year NPV', ai: 8.4, fixed: 0, unit: 'B SAR', better: 'higher', icon: 'Target' },
    ],
    coverStats: [
      { label: 'Total Investment', value: 'SAR 580M' }, { label: 'Annual Return', value: 'SAR 1.2B' },
      { label: 'Break-Even', value: '2.4 Years' }, { label: '10-Year NPV', value: 'SAR 8.4B' },
    ],
    chartData: {
      roiTimeline: [
        { year: 'Y1', investment: -580, cumulative: -580, savings: 420 },
        { year: 'Y2', investment: 0, cumulative: -160, savings: 1200 },
        { year: 'Y3', investment: 0, cumulative: 1040, savings: 1200 },
        { year: 'Y4', investment: 0, cumulative: 2240, savings: 1200 },
        { year: 'Y5', investment: 0, cumulative: 3440, savings: 1200 },
      ],
      costBreakdownPie: [
        { name: 'Hardware', value: 38 }, { name: 'Software', value: 22 },
        { name: 'Installation', value: 18 }, { name: 'Maintenance', value: 12 }, { name: 'Training', value: 10 },
      ],
      roiRows: [
        { category: 'Fuel Savings', annualSAR: '320M', year5: '1.6B', source: 'Reduced idling' },
        { category: 'Time Value (commuters)', annualSAR: '480M', year5: '2.4B', source: '2.1M hrs saved/yr' },
        { category: 'Emission Credits', annualSAR: '95M', year5: '475M', source: '1,533 T CO₂/yr' },
        { category: 'Accident Cost Reduction', annualSAR: '180M', year5: '900M', source: '38% incident drop' },
        { category: 'Infrastructure Longevity', annualSAR: '125M', year5: '625M', source: 'Reduced road wear' },
        { category: 'Total Benefits', annualSAR: '1,200M', year5: '6,000M', source: 'Net of operations' },
      ],
    },
  },
};