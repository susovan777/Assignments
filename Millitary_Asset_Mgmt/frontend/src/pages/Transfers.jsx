import { useState, useEffect } from "react";
import { transferAPI } from "../services/api";
import { Plus, ArrowRight, Calendar } from "lucide-react";

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await transferAPI.getAll();
      setTransfers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Transfer</span>
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transfers found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Asset
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Route
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Initiated By
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr
                    key={transfer._id}
                    className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {transfer.assetId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {transfer.fromBase?.name || "N/A"}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {transfer.toBase?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {transfer.quantity}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          transfer.status
                        )}`}>
                        {transfer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(transfer.transferDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {transfer.initiatedBy?.username || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfers;
