"use client";

import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface User {
    _id: string;
    email: string;
    role: string;
    username: string; // Assuming you have a username field
}

const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(10); // Number of users per page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/user');
                const data = await response.json();
                if (data.User && Array.isArray(data.User)) {
                    setUsers(data.User);
                } else {
                    console.warn('Expected User to be an array but got:', data.User);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/admin/user?id=${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUsers(users.filter(user => user._id !== userId));
                    alert('User deleted successfully.');
                } else {
                    console.error('Failed to delete user:', response.statusText);
                    alert('Failed to delete user.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user.');
            }
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='px-5'>
            <section className='py-10 flex justify-evenly'>
                <Card className='w-72'>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent className='text-lg'>
                        {users.length}
                    </CardContent>
                </Card>
            </section>

            <section className='pb-10'>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">User ID</th>
                            <th className="border border-gray-300 px-4 py-2">Username</th> {/* Added Username */}
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user._id}>
                                <td className="border border-gray-300 px-4 py-4 text-center">{user._id}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{user.username}</td> {/* Display Username */}
                                <td className="border border-gray-300 px-4 py-4 text-center">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{user.role}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;