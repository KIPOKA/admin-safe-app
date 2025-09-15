import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { Activity, AlertTriangle, CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

interface AnalyticsData {
  totalNotifications: number;
  statusCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  userCounts: Record<string, number>;
  resolutionStats: {
    resolved: number;
    unresolved: number;
  };
}

// Modern color palette
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const jsonData: AnalyticsData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">No analytics data available</p>
        </div>
      </div>
    );
  }

  const resolutionRate = ((data.resolutionStats.resolved / data.totalNotifications) * 100).toFixed(1);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-medium text-slate-700">{`${label}`}</p>
          <p className="text-indigo-600 font-semibold">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Emergency Analytics Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Real-time emergency response analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Notifications</p>
            <p className="text-3xl font-bold text-slate-800">{data.totalNotifications.toLocaleString()}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Resolved Cases</p>
            <p className="text-3xl font-bold text-slate-800">{data.resolutionStats.resolved.toLocaleString()}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Unresolved Cases</p>
            <p className="text-3xl font-bold text-slate-800">{data.resolutionStats.unresolved.toLocaleString()}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Resolution Rate</p>
            <p className="text-3xl font-bold text-slate-800">{resolutionRate}%</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Status Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                    data={Object.entries(data.statusCounts).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={2}
                    label={(props) => {
                      const { name, percent } = props as { name?: string; percent?: number };
                      return `${name ?? "Unknown"}: ${((percent ?? 0) * 100).toFixed(1)}%`;
                    }}
                    labelLine={false}
                  >
                    {Object.entries(data.statusCounts).map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>

                <Tooltip content={CustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Emergency Types */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Emergency Types</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={Object.entries(data.typeCounts).map(([name, value]) => ({ name, value }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip content={CustomTooltip} />
                <Bar
                  dataKey="value"
                  fill="url(#emergencyGradient)"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
                <defs>
                  <linearGradient id="emergencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Responders */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Top Responders</h2>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={Object.entries(data.userCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" tick={{ fill: "#64748b" }} />
              <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip content={CustomTooltip} />
              <Bar
                dataKey="value"
                fill="url(#respondersGradient)"
                radius={[0, 8, 8, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
              <defs>
                <linearGradient id="respondersGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
