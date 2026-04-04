"use client";

import { useState, useEffect } from "react";
import { api, buildQueryParams } from "@/lib/api-client";
import {
  Users, UserCheck, Clock, AlertTriangle, CalendarCheck, DoorOpen, UserX,
  BadgeCheck, Fingerprint, Activity, BarChart3, LineChart as LineChartIcon,
  Search, X, Mail, Phone, Briefcase, Shield, MapPin,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const hourlyData = [
  { hour: "6AM", visitors: 4, capacity: 20, expected: 6 }, { hour: "7AM", visitors: 12, capacity: 20, expected: 15 },
  { hour: "8AM", visitors: 38, capacity: 50, expected: 42 }, { hour: "9AM", visitors: 65, capacity: 50, expected: 60 },
  { hour: "10AM", visitors: 52, capacity: 50, expected: 55 }, { hour: "11AM", visitors: 41, capacity: 50, expected: 45 },
  { hour: "12PM", visitors: 28, capacity: 40, expected: 30 }, { hour: "1PM", visitors: 35, capacity: 40, expected: 38 },
  { hour: "2PM", visitors: 48, capacity: 50, expected: 50 }, { hour: "3PM", visitors: 42, capacity: 50, expected: 44 },
  { hour: "4PM", visitors: 30, capacity: 40, expected: 32 }, { hour: "5PM", visitors: 18, capacity: 30, expected: 20 },
  { hour: "6PM", visitors: 8, capacity: 20, expected: 10 },
];

const weeklyTrend = [
  { day: "Mon", thisWeek: 67, lastWeek: 58 }, { day: "Tue", thisWeek: 70, lastWeek: 62 },
  { day: "Wed", thisWeek: 88, lastWeek: 75 }, { day: "Thu", thisWeek: 73, lastWeek: 68 },
  { day: "Fri", thisWeek: 53, lastWeek: 55 }, { day: "Sat", thisWeek: 13, lastWeek: 10 },
  { day: "Sun", thisWeek: 5, lastWeek: 4 },
];

const typeData = [
  { name: "Business", value: 42, color: "hsl(173, 58%, 39%)" },
  { name: "Contractor", value: 25, color: "hsl(222, 60%, 30%)" },
  { name: "Delivery", value: 18, color: "hsl(217, 91%, 60%)" },
  { name: "Interview", value: 10, color: "hsl(38, 92%, 50%)" },
  { name: "VIP", value: 5, color: "hsl(160, 60%, 45%)" },
];

const accessMethodData = [
  { name: "Face ID", value: 38, color: "hsl(173, 58%, 39%)" },
  { name: "QR Code", value: 32, color: "hsl(217, 91%, 60%)" },
  { name: "RFID", value: 18, color: "hsl(222, 60%, 30%)" },
  { name: "NFC", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Manual", value: 4, color: "hsl(215, 16%, 47%)" },
];

const recentVisitors = [
  { name: "Sarah Johnson", company: "Acme Corp", host: "John Smith", status: "checked-in", time: "9:15 AM", type: "Business", method: "Face ID", zone: "Floor 3", email: "sarah.j@acme.com", phone: "+1 555-0101", badge: "VB-1042", dept: "Engineering" },
  { name: "Mike Chen", company: "TechFlow Inc", host: "Lisa Wang", status: "pending", time: "9:30 AM", type: "Interview", method: "---", zone: "---", email: "mike.c@techflow.io", phone: "+1 555-0202", badge: "---", dept: "HR" },
  { name: "Emma Davis", company: "BuildRight LLC", host: "Tom Brown", status: "checked-in", time: "9:45 AM", type: "Contractor", method: "RFID", zone: "Loading Bay", email: "emma.d@buildright.com", phone: "+1 555-0303", badge: "VB-1043", dept: "Facilities" },
  { name: "James Wilson", company: "DataVault", host: "Amy Lee", status: "approved", time: "10:00 AM", type: "Business", method: "---", zone: "---", email: "james.w@datavault.io", phone: "+1 555-0404", badge: "---", dept: "Sales" },
  { name: "Ana Garcia", company: "FreshDeli", host: "Reception", status: "checked-out", time: "10:10 AM", type: "Delivery", method: "QR Code", zone: "Lobby", email: "ana.g@freshdeli.com", phone: "+1 555-0505", badge: "VB-1041", dept: "Reception" },
  { name: "David Park", company: "Samsung", host: "Jennifer Lee", status: "pre-registered", time: "10:30 AM", type: "VIP", method: "---", zone: "---", email: "david.p@samsung.com", phone: "+1 555-0606", badge: "---", dept: "Executive" },
];

const statusColors = {
  "checked-in": "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
  "checked-out": "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  pending: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  approved: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  "pre-registered": "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
};

function KpiCard({ icon: Icon, title, value, change, changeType, iconColor }) {
  const changeColors = { positive: "text-emerald-500", negative: "text-red-500", neutral: "text-gray-400" };
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${iconColor || "text-primary"}`}><Icon className="w-4 h-4" /></div>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{title}</div>
      {change && <div className={`text-[10px] mt-1 ${changeColors[changeType] || "text-gray-400"}`}>{change}</div>}
    </div>
  );
}

function ProgressBar({ value, label, valueLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">{valueLabel || `${value}%`}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

const mockNotifications = [
  { id: 1, visitor: "Sarah Johnson", host: "John Smith", time: "9:15 AM", type: "arrival", message: "has arrived at reception" },
  { id: 2, visitor: "Emma Davis", host: "Tom Brown", time: "9:45 AM", type: "overstay", message: "has exceeded expected visit duration by 30min" },
  { id: 3, visitor: "Unknown Person", host: "Security", time: "10:20 AM", type: "alert", message: "unregistered visitor attempted entry at Gate B" },
];

const notifColors = {
  arrival: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10",
  overstay: "border-l-amber-500 bg-amber-50 dark:bg-amber-900/10",
  alert: "border-l-red-500 bg-red-50 dark:bg-red-900/10",
};

export default function VisitorDashboard() {
  const [weeklyChartType, setWeeklyChartType] = useState("bar");
  const [trafficChartType, setTrafficChartType] = useState("area");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [liveVisitors, setLiveVisitors] = useState([]);
  const [realHourlyData, setRealHourlyData] = useState([]);
  const [realWeeklyTrend, setRealWeeklyTrend] = useState([]);
  const [realTypeData, setRealTypeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = await buildQueryParams({});
      try {
        const { data } = await api.get("/visitor-management/dashboard", { params });
        setStats(data);
      } catch (e) { console.warn("Dashboard stats error", e); }
      try {
        const { data } = await api.get("/visitor-management/analytics", { params });
        if (data.hourly_data?.length) setRealHourlyData(data.hourly_data);
        if (data.weekly_trend?.length) setRealWeeklyTrend(data.weekly_trend);
        if (data.type_data?.length) setRealTypeData(data.type_data);
        if (data.notifications?.length) setNotifications(data.notifications);
      } catch (e) { console.warn("Analytics error", e); }
      try {
        const { data } = await api.get("/visitor-management/logs", { params: { ...params, per_page: 10 } });
        const items = (data?.data || []).map(l => ({
          name: l.visitor ? `${l.visitor.first_name} ${l.visitor.last_name || ""}`.trim() : `Visitor ${l.visitor_id}`,
          company: l.visitor?.visitor_company_name || "---",
          host: "---",
          status: l.out ? "checked-out" : "checked-in",
          time: l.in || "---",
          type: "Business",
          method: "---",
          zone: "---",
          email: "---",
          phone: "---",
          badge: "---",
          dept: "---",
        }));
        setLiveVisitors(items);
      } catch (e) {}
    };
    fetchData();
  }, []);

  const displayVisitors = liveVisitors;

  const filteredVisitors = displayVisitors.filter((v) => {
    const matchesSearch = !visitorSearch || [v.name, v.company, v.host].some(f => f.toLowerCase().includes(visitorSearch.toLowerCase()));
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesType = typeFilter === "all" || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const chartStyle = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' };
  const tickStyle = { fill: '#94a3b8', fontSize: 11 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Visitor Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Real-time overview across all sites</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational</span>
        </div>
      </div>

      {/* Host Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center justify-between rounded-lg border-l-4 px-4 py-3 ${notifColors[n.type] || ""}`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-sm ${n.type === "arrival" ? "text-emerald-500" : n.type === "overstay" ? "text-amber-500" : "text-red-500"}`}>
                  {n.type === "arrival" ? "login" : n.type === "overstay" ? "schedule" : "warning"}
                </span>
                <div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{n.visitor}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400"> {n.message}</span>
                  <span className="text-[10px] text-gray-400 ml-2">{n.time} &middot; Host: {n.host}</span>
                </div>
              </div>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                className="p-1 rounded hover:bg-black/10 text-gray-400 hover:text-gray-600 transition">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} title="Total Visitors Today" value={stats?.total_today ?? 0} change="" changeType="neutral" />
        <KpiCard icon={UserCheck} title="Currently Inside" value={stats?.checked_in ?? 0} change="" changeType="neutral" />
        <KpiCard icon={Clock} title="Pending Approvals" value={stats?.pending_approvals ?? 0} change="" changeType="negative" iconColor="text-amber-500" />
        <KpiCard icon={AlertTriangle} title="Blacklisted" value={stats?.blacklisted ?? 0} change="" changeType="negative" iconColor="text-red-500" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Pre-Registered", value: stats?.pre_registered ?? 0, icon: CalendarCheck, color: "text-purple-500" },
          { label: "Weekly Total", value: stats?.weekly_count ?? 0, icon: DoorOpen, color: "text-blue-500" },
          { label: "Overstayed", value: stats?.overstayed ?? 0, icon: UserX, color: "text-amber-500" },
          { label: "Badges Printed", value: stats?.total_today ?? 0, icon: BadgeCheck, color: "text-emerald-500" },
          { label: "Face Verifications", value: 0, icon: Fingerprint, color: "text-blue-400" },
          { label: "Avg Wait Time", value: "---", icon: Clock, color: "text-purple-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{kpi.label}</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Visitor Traffic — Today</h3>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              {[["area", "Area"], ["bar", "Bar"], ["line", "Line"]].map(([type, label]) => (
                <button key={type} onClick={() => setTrafficChartType(type)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${trafficChartType === type ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            {trafficChartType === "bar" ? (
              <BarChart data={realHourlyData.length ? realHourlyData : hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="hour" tick={tickStyle} /><YAxis tick={tickStyle} />
                <Tooltip contentStyle={chartStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="visitors" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} name="Visitors" />
                <Bar dataKey="expected" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Expected" opacity={0.6} />
              </BarChart>
            ) : trafficChartType === "line" ? (
              <LineChart data={realHourlyData.length ? realHourlyData : hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="hour" tick={tickStyle} /><YAxis tick={tickStyle} />
                <Tooltip contentStyle={chartStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="visitors" stroke="hsl(173, 58%, 39%)" strokeWidth={2.5} dot={{ r: 3 }} name="Visitors" />
                <Line type="monotone" dataKey="expected" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Expected" />
              </LineChart>
            ) : (
              <AreaChart data={realHourlyData.length ? realHourlyData : hourlyData}>
                <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.2} /><stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="hour" tick={tickStyle} /><YAxis tick={tickStyle} />
                <Tooltip contentStyle={chartStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="visitors" stroke="hsl(173, 58%, 39%)" fillOpacity={1} fill="url(#colorV)" strokeWidth={2} name="Visitors" />
                <Line type="monotone" dataKey="expected" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Expected" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Visitor Types */}
        <div className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-4">Visitor Types</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={realTypeData.length ? realTypeData : typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
              {(realTypeData.length ? realTypeData : typeData).map((e) => <Cell key={e.name} fill={e.color} />)}
            </Pie><Tooltip contentStyle={chartStyle} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {(realTypeData.length ? realTypeData : typeData).map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><div className="w-2 h-2 rounded-full" style={{ background: t.color }} />{t.name}</div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Access Methods */}
        <div className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-4">Access Methods</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={accessMethodData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
              {accessMethodData.map((e) => <Cell key={e.name} fill={e.color} />)}
            </Pie><Tooltip contentStyle={chartStyle} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {accessMethodData.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><div className="w-2 h-2 rounded-full" style={{ background: t.color }} />{t.name}</div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Weekly Trend</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">This week vs last week</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {[["bar", BarChart3, "Bar"], ["line", LineChartIcon, "Line"]].map(([type, Icon, label]) => (
              <button key={type} onClick={() => setWeeklyChartType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${weeklyChartType === type ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          {weeklyChartType === "bar" ? (
            <BarChart data={realWeeklyTrend.length ? realWeeklyTrend : weeklyTrend} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="day" tick={tickStyle} /><YAxis tick={tickStyle} />
              <Tooltip contentStyle={chartStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="thisWeek" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} name="This Week" />
              <Bar dataKey="lastWeek" fill="hsl(220, 13%, 85%)" radius={[4, 4, 0, 0]} name="Last Week" />
            </BarChart>
          ) : (
            <LineChart data={realWeeklyTrend.length ? realWeeklyTrend : weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="day" tick={tickStyle} /><YAxis tick={tickStyle} />
              <Tooltip contentStyle={chartStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="thisWeek" stroke="hsl(173, 58%, 39%)" strokeWidth={2.5} dot={{ r: 4 }} name="This Week" />
              <Line type="monotone" dataKey="lastWeek" stroke="hsl(220, 13%, 75%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Last Week" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Recent Visitors Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Recent Visitor Activity</h3>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500">{filteredVisitors.length}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input placeholder="Search by name, company, host..." value={visitorSearch} onChange={(e) => setVisitorSearch(e.target.value)}
                className="w-full pl-8 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300">
              <option value="all">All Statuses</option>
              <option value="checked-in">Checked In</option><option value="checked-out">Checked Out</option>
              <option value="pending">Pending</option><option value="approved">Approved</option><option value="pre-registered">Pre-registered</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300">
              <option value="all">All Types</option>
              <option value="Business">Business</option><option value="Contractor">Contractor</option>
              <option value="Delivery">Delivery</option><option value="Interview">Interview</option><option value="VIP">VIP</option>
            </select>
            {(visitorSearch || statusFilter !== "all" || typeFilter !== "all") && (
              <button onClick={() => { setVisitorSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"><X className="w-3 h-3" /> Clear</button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Visitor</th><th className="px-3 py-3">Host</th><th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Method</th><th className="px-3 py-3">Zone</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredVisitors.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-xs text-gray-400">No visitors match the current filters</td></tr>
              ) : filteredVisitors.map((v) => (
                <tr key={v.name} className="hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer text-xs text-gray-600 dark:text-gray-300"
                  onClick={() => setSelectedVisitor(v)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                        {v.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100 text-xs">{v.name}</div>
                        <div className="text-[10px] text-gray-400">{v.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{v.host}</td>
                  <td className="px-3 py-3"><span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">{v.type}</span></td>
                  <td className="px-3 py-3 font-mono text-[11px]">{v.method}</td>
                  <td className="px-3 py-3">{v.zone}</td>
                  <td className="px-3 py-3"><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${statusColors[v.status] || ""}`}>{v.status}</span></td>
                  <td className="px-3 py-3">{v.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Detail Dialog */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedVisitor(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Visitor Profile</h3>
              <button onClick={() => setSelectedVisitor(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-lg font-bold text-purple-700 dark:text-purple-400">
                  {selectedVisitor.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedVisitor.name}</div>
                  <div className="text-sm text-gray-500">{selectedVisitor.company}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${statusColors[selectedVisitor.status]}`}>{selectedVisitor.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2.5 text-sm"><Mail className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-700 dark:text-gray-300">{selectedVisitor.email}</span></div>
                <div className="flex items-center gap-2.5 text-sm"><Phone className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-700 dark:text-gray-300">{selectedVisitor.phone}</span></div>
                <div className="flex items-center gap-2.5 text-sm"><Briefcase className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-700 dark:text-gray-300">{selectedVisitor.type}</span></div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Visit Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Host", selectedVisitor.host], ["Department", selectedVisitor.dept],
                    ["Check-in", selectedVisitor.time], ["Badge", selectedVisitor.badge],
                    ["Access Method", selectedVisitor.method], ["Zone", selectedVisitor.zone],
                  ].map(([label, value]) => (
                    <div key={label}><div className="text-[10px] text-gray-400">{label}</div><div className="text-xs font-medium text-gray-800 dark:text-gray-200">{value}</div></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition">
                  <Shield className="w-3.5 h-3.5" /> Security Check
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <MapPin className="w-3.5 h-3.5" /> Track Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
