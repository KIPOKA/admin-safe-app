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
} from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

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

  if (loading) return <div>Loading analytics...</div>;
  if (!data) return <div>No analytics data available</div>;

  const resolutionRate = ((data.resolutionStats.resolved / data.totalNotifications) * 100).toFixed(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Emergency Notifications Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Notifications</p>
          <p className="text-2xl font-bold">{data.totalNotifications}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Resolved Cases</p>
          <p className="text-2xl font-bold">{data.resolutionStats.resolved}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Unresolved Cases</p>
          <p className="text-2xl font-bold">{data.resolutionStats.unresolved}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Resolution Rate</p>
          <p className="text-2xl font-bold">{resolutionRate}%</p>
        </div>
      </div>

    {/* Status PieChart */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={Object.entries(data.statusCounts).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(2)}%`}
                >
                    {Object.entries(data.statusCounts).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Count"]} />
                </PieChart>
            </ResponsiveContainer>
            </div>


      {/* Emergency Types BarChart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Emergency Types</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(data.typeCounts).map(([name, value]) => ({ name, value }))}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Users BarChart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Top Responders</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Object.entries(data.userCounts)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
