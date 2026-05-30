import { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
}  from 'recharts';
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#ef4444"];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  

  useEffect(() => {
    document.title = "Statistics | Admin Dashboard";
  }, []);

  useEffect(() => {
    axiosSecure.get("/admin/statistics").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  const barData = [
    { name: "Total Users", value: stats.totalUsers },
    { name: "Total Orders", value: stats.totalOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "Delivered", value: stats.deliveredOrders },
  ];

  const pieData = [
    { name: "Pending Orders", value: stats.pendingOrders },
    { name: "Delivered Orders", value: stats.deliveredOrders },
    { name: "Cancelled Orders", value: stats.cancelledOrders },
    { name: "Accepted Orders", value: stats.acceptedOrders },
  ];

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Platform Statistics
      </h2>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-600"
        />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`৳${stats.totalPayment}`}
          color="bg-green-50 border-green-200"
          textColor="text-green-600"
        />
        <StatCard
          icon="⏳"
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-yellow-50 border-yellow-200"
          textColor="text-yellow-600"
        />
        <StatCard
          icon="✅"
          label="Delivered Orders"
          value={stats.deliveredOrders}
          color="bg-orange-50 border-orange-200"
          textColor="text-orange-600"
        />
      </div>

      {/* ===== Charts ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📊 Platform Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🥧 Order Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ icon, label, value, color, textColor }) => (
  <div className={`rounded-2xl border p-4 ${color}`}>
    <p className="text-2xl mb-1">{icon}</p>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
  </div>
);

export default Statistics;