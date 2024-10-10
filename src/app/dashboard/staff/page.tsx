"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// Sample User interface (define it according to your needs)
interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    services: string;
}

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/staff");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            console.log(data)
            if (Array.isArray(data.staff)) {
                setUsers(data.staff);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log(error)
            handleError("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

   

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/admin/staff?id=${userId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete user");
            fetchUsers();
        } catch (error) {
            console.log(error)
            handleError("Error deleting user");
        }
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setTimeout(() => setError(""), 3000); // Show error for 3 seconds
    };

    const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="p-6">
            <Link href={`/dashboard/staff/newStaff`}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                
            >
                Create User
            </Link>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <section className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Username</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">service</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user?.services}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                <td className="border border-gray-300 px-4 py-2 flex justify-center items-center space-x-2">
                                    <Link href={`/dashboard/staff/${user._id}`} className="px-2 py-1 bg-yellow-500 text-white rounded">
                                        Edit
                                    </Link>
                                    <button className="text-white bg-red-500 px-2 py-1 rounded" onClick={() => handleDeleteUser(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <div className="mt-4 justify-center flex ">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
