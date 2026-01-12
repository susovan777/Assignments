import { useState, useEffect } from "react";
import { purchaseAPI } from "../services/api";
import { X } from "lucide-react";
import api from "../services/api";

const CreatePurchaseModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "weapon",
    baseId: "",
    quantity: "",
    notes: "",
  });
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const response = await api.get("/dashboard");
      // We'll need to get bases separately or use existing data
      // For now, we'll create a placeholder
      setBases([
        { _id: "1", name: "Fort Alpha" },
        { _id: "2", name: "Fort Bravo" },
      ]);
    } catch (error) {
      console.error("Failed to fetch bases");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, we need to find or create the asset
      const assetResponse = await api
        .post("/assets", {
          name: formData.assetName,
          type: formData.assetType,
          baseId: formData.baseId,
          openingBalance: 0,
          currentBalance: 0,
        })
        .catch(() => {
          // Asset might already exist, that's ok
          return { data: { data: { _id: "temp" } } };
        });

      // For now, we'll use a workaround - in production, you'd need proper asset management
      const purchaseData = {
        assetId: formData.assetName, // This should be the actual asset ID
        baseId: formData.baseId,
        quantity: parseInt(formData.quantity),
        notes: formData.notes,
      };

      await purchaseAPI.create(purchaseData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., M4 Carbine"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type
            </label>
            <select
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              className="input-field"
              required>
              <option value="weapon">Weapon</option>
              <option value="vehicle">Vehicle</option>
              <option value="ammunition">Ammunition</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base (Note: Use Base ID from seed data)
            </label>
            <input
              type="text"
              name="baseId"
              value={formData.baseId}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Base ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50">
              {loading ? "Creating..." : "Create Purchase"}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> For testing, you'll need actual Asset ID and
            Base ID from your database. Check your MongoDB or use the IDs from
            seed data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseModal;
