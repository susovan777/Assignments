import { useState, useEffect } from "react";
import { assignmentAPI, expenditureAPI } from "../services/api";
import { Plus, User, AlertTriangle } from "lucide-react";

const Assignments = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "assignments") {
        const response = await assignmentAPI.getAll();
        setAssignments(response.data.data);
      } else {
        const response = await expenditureAPI.getAll();
        setExpenditures(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await assignmentAPI.return(id);
      fetchData();
    } catch (error) {
      console.error("Failed to return assignment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Assignments & Expenditures
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>
            New {activeTab === "assignments" ? "Assignment" : "Expenditure"}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assignments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Assignments</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("expenditures")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "expenditures"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Expenditures</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="card">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assignments found
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
                      Personnel
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      ID
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment._id}
                      className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {assignment.assetId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">{assignment.personnelName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {assignment.personnelId}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {assignment.quantity}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assignment.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(
                          assignment.assignmentDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {assignment.status === "active" && (
                          <button
                            onClick={() => handleReturn(assignment._id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Expenditures Tab */}
      {activeTab === "expenditures" && (
        <div className="card">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading expenditures...
            </div>
          ) : expenditures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenditures found
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
                      Base
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Recorded By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenditures.map((expenditure) => (
                    <tr
                      key={expenditure._id}
                      className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {expenditure.assetId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {expenditure.baseId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {expenditure.quantity}
                      </td>
                      <td className="py-3 px-4">{expenditure.reason}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(
                          expenditure.expenditureDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {expenditure.recordedBy?.username || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;
