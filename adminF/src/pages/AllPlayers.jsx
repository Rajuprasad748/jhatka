import React, { useEffect, useState } from "react";
import axios from "axios";

const AllPlayers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/all-users`
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Skeleton component (consistent style)
  const SkeletonCard = () => (
    <div className="border rounded-lg p-4 bg-gray-800 animate-pulse">
      <div className="h-4 bg-gray-700 w-20 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-32 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-40 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-24 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-36 mb-2 rounded"></div>
    </div>
  );

  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="border px-4 py-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-800">
        All Users
      </h2>

      {!loading && (
        <p className="text-center text-sm text-gray-600 mb-4">
          Total Users: <span className="font-bold">{users.length}</span>
        </p>
      )}

      {/* ✅ Skeleton Loading View */}
      {loading && (
        <>
          {/* Mobile Skeleton */}
          <div className="block md:hidden space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Wallet Balance</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ✅ Mobile View */}
      {!loading && (
        <div className="block md:hidden space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-sm font-medium">#{index + 1}</p>
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {user._id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Wallet Balance:</span> ₹
                  {user.walletBalance ?? 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <img
                src="https://cdn.dribbble.com/users/2131993/screenshots/6007793/no_result.gif"
                alt="No Users"
                className="w-60"
              />
            </div>
          )}
        </div>
      )}

      {/* ✅ Desktop View */}
      {!loading && (
        <div className="hidden md:block overflow-x-auto">
          {users.length > 0 ? (
            <table className="w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Wallet Balance</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user._id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      ₹{user.walletBalance ?? 0}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center py-10">
              <img
                src="https://cdn.dribbble.com/users/2131993/screenshots/6007793/no_result.gif"
                alt="No Users"
                className="w-60"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPlayers;
