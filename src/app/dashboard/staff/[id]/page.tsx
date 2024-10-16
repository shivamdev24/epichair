// EditStaffForm.tsx

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import HashLoader from "react-spinners/HashLoader";

interface EditStaffFormProps {
    params: {
        id: string;
    };
}


interface ServiceType {
    length: number;
    _id: string;
    name: string;
}


const EditStaffForm: React.FC<EditStaffFormProps> = ({ params }) => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("user");
    const [feedback, setFeedback] = useState<string>("");
    const [rating, setRating] = useState<number | "">("");
    const [services, setServices] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [availableServices, setAvailableServices] = useState<ServiceType[]>([]);

    const id = params.id;


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/service'); // Adjust the endpoint as necessary
                const data = await response.json();

                // Log the entire response to verify what you're receiving
                console.log("Fetched Services Data:", data);

                // Assuming data is the array of services
                if (Array.isArray(data)) {
                    setAvailableServices(data);
                    console.log("availableServices", data); // Check what you're receiving
                } else {
                    console.error("Services data is not in the expected format:", data);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);



    useEffect(() => {
        if (id) {
            const fetchStaffData = async () => {
                try {
                    const response = await fetch(`/api/admin/staff/specificId?id=${id}`);
                    if (!response.ok) throw new Error("Failed to fetch staff data");
                    const data = await response.json();
                    setUsername(data.staff.username);
                    setEmail(data.staff.email);
                    setRole(data.staff.role);
                    setFeedback(data.staff.feedback);
                    setRating(data.staff.rating !== null ? data.staff.rating : "");
                    setServices(data.staff.services || []);
                    // console.log(data)
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching staff data:", error);
                    setErrorMessage("Could not fetch staff data. Please try again later.");
                }
            };
            fetchStaffData();
        }
    }, [id]);

    // Handle checkbox change for services
    const handleServiceChange = (service: string) => {
        if (services.includes(service)) {
            setServices(services.filter((s) => s !== service));
        } else {
            setServices([...services, service]);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true);
        // Ensure optional fields are not undefined
        const updatedUser = {
            id,
            username: username ,  // Default to empty string if username is undefined
            email: email ,  // Default to empty string if email is undefined
            role: role || "user",  // Default to 'user' if role is undefined
            feedback: feedback ?? "",  // Set feedback to empty string if undefined
            rating: rating !== undefined ? parseFloat(rating as string) : null,  // Parse rating or set to null if undefined
            services: services.length ? services : []  // Ensure services is an array
        };

        // Log data being submitted
        // console.log("Submitting user data:", updatedUser);

        try {
            const response = await fetch(`/api/admin/staff?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            const responseData = await response.json();
            // console.log("API Response Data:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to update user");
            }
            router.push("/dashboard/staff");
        } catch (error) {
            console.error("Error updating user:", error);
            setErrorMessage("Could not update user. Please try again later.");
        }
    };

    if (loading) {
        return (
            <p className="flex mx-auto h-screen w-screen justify-center items-center text-6xl">
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
        <div className="px-5 py-5">
            <Link
                href="/dashboard/staff"
                className="px-6 hover:bg-gray-900 p-2 bg-black text-white rounded"
            >
                Back
            </Link>



            <Card className="m-4 w-full md:max-w-4xl mx-auto mt-12">

                <CardHeader>
                    <CardTitle>Edit Staff</CardTitle>
                </CardHeader>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <label>Username:</label>
                        <Input
                            id="userId"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </CardContent>
                    <CardContent>
                        <label>Email:</label>
                        <Input
                            id="userId"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled
                        />
                    </CardContent>
                    <CardContent>
                        <label>Role:</label>
                        <input type="text" placeholder="Staff" disabled />
                    </CardContent>
                    <CardContent>
                        <label>Feedback:</label>
                        <Input
                            id="userId"
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </CardContent>
                    <CardContent>
                        <label>Rating:</label>
                        <Input
                            id="userId"
                            type="number"
                            value={rating !== "" ? rating : ""}
                            onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
                            min="1"
                            max="5"
                        />
                    </CardContent>
                    <CardContent>
                        <label>Services List : ( select services ) <span className="text-red-500">*</span></label>
                        <div className="flex gap-4 flex-col md:flex-row">
                            {
                                availableServices.length > 0 ? (
                                    availableServices.map((service) => (
                                        <div key={service._id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={service._id} // Using service._id for the checkbox id
                                                checked={services.includes(service.name)}
                                                onChange={() => handleServiceChange(service.name)} // Using service._id in the handle function
                                                className="mr-2"
                                            />
                                            <label htmlFor={service._id}>{service.name}</label> {/* Rendering service name */}
                                        </div>
                                    ))
                                ) : (
                                    <p>No services available.</p>
                                )
                            }
                        </div>
                    </CardContent >
                    <CardContent>

                        <Button type="submit" className="mr-2 w-full bg-blue-500 hover:bg-blue-600">Update User</Button>
                    </CardContent>
                </form>
               
            </Card>
            


           
        </div>
    );
};

export default EditStaffForm;
