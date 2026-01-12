import { useState, useEffect } from "react";
import { purchaseAPI } from "../services/api";
import { Plus, Calendar, Package } from "lucide-react";
import CreatePurchaseModal from "../components/CreatePurchaseModel.jsx";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    equipmentType: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await purchaseAPI.getAll(cleanFilters);
      setPurchases(response.data.data);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePurchaseCreated = () => {
    setShowModal(false);
    fetchPurchases();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Purchase</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* Purchases List */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading purchases...
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No purchases found
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
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Base
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Created By
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase._id}
                    className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {purchase.assetId?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {purchase.assetId?.type || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {purchase.baseId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {purchase.quantity}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {purchase.createdBy?.username || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {purchase.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CreatePurchaseModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePurchaseCreated}
        />
      )}
    </div>
  );
};

export default Purchases;
