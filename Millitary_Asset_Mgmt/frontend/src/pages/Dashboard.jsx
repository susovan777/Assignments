import { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";
import {
  TrendingUp,
  Package,
  Send,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    baseId: "",
    equipmentType: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await dashboardAPI.getMetrics(cleanFilters);
      setMetrics(response.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const metricCards = [
    {
      title: "Opening Balance",
      value: metrics?.openingBalance || 0,
      icon: Package,
      color: "blue",
    },
    {
      title: "Closing Balance",
      value: metrics?.closingBalance || 0,
      icon: Package,
      color: "green",
    },
    {
      title: "Net Movement",
      value: metrics?.netMovement || 0,
      icon: TrendingUp,
      color: metrics?.netMovement >= 0 ? "green" : "red",
    },
    {
      title: "Assigned",
      value: metrics?.assigned || 0,
      icon: UserCheck,
      color: "purple",
    },
    {
      title: "Expended",
      value: metrics?.expended || 0,
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const chartData = [
    {
      name: "Purchases",
      value: metrics?.purchases || 0,
    },
    {
      name: "Transfer In",
      value: metrics?.transfersIn || 0,
    },
    {
      name: "Transfer Out",
      value: metrics?.transfersOut || 0,
    },
    {
      name: "Assigned",
      value: metrics?.assigned || 0,
    },
    {
      name: "Expended",
      value: metrics?.expended || 0,
    },
  ];

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Type
            </label>
            <select
              name="equipmentType"
              value={filters.equipmentType}
              onChange={handleFilterChange}
              className="input-field">
              <option value="">All Types</option>
              <option value="weapon">Weapon</option>
              <option value="vehicle">Vehicle</option>
              <option value="ammunition">Ammunition</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  baseId: "",
                  equipmentType: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="btn-secondary w-full">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            red: "bg-red-100 text-red-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
          };

          return (
            <div key={metric.title} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                {metric.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metric.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Asset Movement Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
