/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HashLoader from "react-spinners/HashLoader";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Service {
    _id: string;
    name: string; // Update according to your service structure
}

interface Barber {
    _id: string;
    username: string; // Barber name
    services: string[]; // Skills array
}

const NewAppointment = () => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedBarber, setSelectedBarber] = useState<string>("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [status, setStatus] = useState<"pending" | "confirmed" | "completed" | "cancelled">("pending");
    const [appointmentType, setAppointmentType] = useState<"inApp" | "WalkIn">("inApp");
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState<number | null>(null);

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesResponse = await axios.get("/api/admin/service");
                setServices(servicesResponse.data); // Assuming your API returns an array of services
                setLoading(false); // Set loading to false after fetching services
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching services");
                setLoading(false); // Also set loading to false on error
            }
        };

        fetchServices();
    }, []);

    // Fetch barbers based on selected service

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const response = await axios.get(`/api/admin/staff`);
                const data = response.data.staff; // Assuming your API returns an object with 'staff' array

                // Ensure data is an array before setting state
                if (Array.isArray(data)) {
                    setFilteredBarbers(data);
                } else {
                    setFilteredBarbers([]); // Fallback in case data is not an array
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching barbers');
            }
        };

        fetchBarbers();
    }, []); 


    const createAppointment = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(`/api/admin/appointment`, {
                barber: selectedBarber,
                service: selectedService,
                appointmentDate,
                appointmentTime,
                status,
                appointmentType,
                feedback,
                rating,
            });

            console.log("Appointment created successfully", response);
            router.push("/dashboard/appointments"); // Redirect to dashboard or appropriate page after successful creation
        } catch (err) {
            console.error("Error creating appointment:", err);
            setError("An error occurred while creating the appointment");
        }
    };

    if (loading) {
        return (
            <p className="flex mx-auto h-screen justify-center items-center text-6xl">
                <HashLoader
                    color="#000"
                    loading={loading}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </p>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <Link
                    href="/dashboard"
                    className="px-6 hover:bg-gray-900 p-2 bg-black text-white rounded"
                >
                    Back
                </Link>
            </div>
            {error ? <div className="text-red-500">{error}</div> : ""}
            <Card className="w-full mt-4">
                <CardHeader>
                    <CardTitle>Create New Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={createAppointment}>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Service
                                </label>
                                <select
                                    value={selectedService}
                                    onChange={(event) => {
                                        setSelectedService(event.target.value);
                                    }}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="" disabled>Select a service</option>
                                    {services.map((service) => (
                                        <option key={service._id} value={service._id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Barber
                                </label>
                                <select
                                    value={selectedBarber}
                                    onChange={(event) => setSelectedBarber(event.target.value)}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="" disabled>Select a barber</option>
                                    {/* Check if filteredBarbers is an array before mapping */}
                                    {Array.isArray(filteredBarbers) && filteredBarbers.length > 0 ? (
                                        filteredBarbers.map((barber) => (
                                            <option key={barber._id} value={barber._id}>
                                                {barber.username} - Services: {barber.services.join(', ')}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No barbers available</option>
                                    )}
                                </select>
                            </div>
                            
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(event) => setAppointmentDate(event.target.value)}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Appointment Time
                                </label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(event) => setAppointmentTime(event.target.value)}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value as "pending" | "confirmed" | "completed" | "cancelled")}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Appointment Type
                                </label>
                                <select
                                    value={appointmentType}
                                    onChange={(event) => setAppointmentType(event.target.value as "inApp" | "WalkIn")}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="inApp">In-App</option>
                                    <option value="WalkIn">Walk-In</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Feedback
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(event) => setFeedback(event.target.value)}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rating
                                </label>
                                <input
                                    type="number"
                                    value={rating ?? ""}
                                    onChange={(event) => setRating(event.target.value ? Number(event.target.value) : null)}
                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    min="0"
                                    max="5"
                                />
                            </div>
                          
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create Appointment
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewAppointment;