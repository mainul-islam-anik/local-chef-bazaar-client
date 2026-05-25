import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure =useAxiosSecure();

  useEffect(() => {
    document.title = "Manage Requests | Admin Dashboard";
  }, []);

  useEffect(() => {
    axiosSecure.get("/requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  }, []);

  const handleAccept = async (request) => {
    try {
      await axiosSecure.patch(
        `/requests/accept/${request._id}`,
        {
          userEmail: request.userEmail,
          requestType: request.requestType,
        }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === request._id
            ? { ...r, requestStatus: "approved" }
            : r
        )
      );

      toast.success(
        `Request approved! User is now a ${request.requestType}.`
      );
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosSecure.patch(
        `/requests/reject/${requestId}`
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId
            ? { ...r, requestStatus: "rejected" }
            : r
        )
      );

      toast.error("Request rejected!");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📩 Manage Requests ({requests.length})
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No requests yet!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Request Type</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={req._id}
                    className="border-b border-gray-100 hover:bg-orange-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {req.userName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{req.userEmail}</td>

                    {/* Request Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          req.requestType === "chef"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {req.requestType === "chef" ? "👨‍🍳" : "🛡"}{" "}
                        {req.requestType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(
                          req.requestStatus
                        )}`}
                      >
                        {req.requestStatus}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(req.requestTime).toLocaleDateString()}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4">
                      {req.requestStatus === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          {req.requestStatus === "approved"
                            ? "✅ Approved"
                            : "❌ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;