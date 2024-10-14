"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CreateStaffForm: React.FC = () => {

    const router = useRouter();


    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [rating, setRating] = useState<number | "">("");
    const [services, setServices] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedServices = [...services];
        updatedServices[index] = e.target.value;
        setServices(updatedServices);
    };

    const addService = () => {
        setServices((prevServices) => [...prevServices, ""]);
    };

    const removeService = (index: number) => {
        setServices((prevServices) => prevServices.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        // Ensure optional fields are not undefined
        const newStaff = {
            username: username.trim() || "",  // Ensure it's not just whitespace
            email: email.trim() || "",  // Ensure it's not just whitespace
             // Default to 'user' if role is undefined
            feedback: feedback.trim() ?? "",  // Trim feedback
            rating: rating !== undefined ? parseFloat(rating as string) : null,  // Parse rating or set to null if undefined
            services: services.filter(service => service.trim() !== "")  // Remove empty services
        };

        // Log data being submitted
        console.log("Submitting new staff data:", newStaff);

        // Check required fields
        if (!newStaff.username || !newStaff.email || newStaff.services.length === 0) {
            setErrorMessage("Email, username, and at least one service are required.");
            return; // Prevent submission if required fields are missing
        }

        try {
            const response = await fetch(`/api/admin/staff`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStaff),
            });

            const responseData = await response.json();
            console.log("API Response Data:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to create staff");
            }

            router.push('/dashboard/staff')
        } catch (error) {
            console.error("Error creating staff:", error);
            setErrorMessage("Could not create staff. Please try again later.");
        }
    };


    return (
        <>
            <div className="px-5 py-5">
                <Link
                    href="/dashboard/staff"
                    className="px-6 hover:bg-gray-900 p-2 bg-black text-white rounded"
                >
                    Back
                </Link>
                
                <Card className="m-4 w-full md:max-w-4xl mx-auto mt-12">
                    <CardHeader>
                        <CardTitle>Create Staff</CardTitle>
                    </CardHeader>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>

                    
                    <CardContent>
                        <label>Username:</label>
                        <Input
                            type="text"
                            value={username} id="userId"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </CardContent>
                    <CardContent>
                        <label>Email:</label>
                        <Input
                            type="email"
                            id="userId"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </CardContent>

                    <CardContent>
                        <label>Role:</label>
                        <Input type="text" id="userId" placeholder="Staff" disabled />

                    </CardContent>
                    <CardContent>
                        <label>Feedback (Optional):</label>
                        <Input
                            type="text"
                            id="userId"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </CardContent>
                    <CardContent>
                        <label>Rating (Optional):</label>
                        <Input
                            type="number"
                            id="userId"
                            value={rating !== "" ? rating : ""}
                            onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
                            min="1"
                            max="5"
                        />
                    </CardContent>
                    <CardContent>
                        <label>Services:</label>
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center">
                                <Input
                                    id="userId"
                                    type="text"
                                    value={service}
                                    required
                                    onChange={(e) => handleServicesChange(e, index)}
                                />
                                <Button type="button" onClick={() => removeService(index)} className="ml-2 bg-red-600 hover:bg-red-500">
                                    Remove
                                </Button>
                            </div>
                        ))}
                            <Button type="button" onClick={addService} className="mt-2  bg-green-600 hover:bg-green-500">
                            Add Service
                        </Button>
                    </CardContent>
                    <CardContent className="form-actions mt-4 flex justify-end">
                            <Button type="submit" className="mr-2 w-full ml-2 bg-blue-600 hover:bg-blue-500">Create Staff</Button>
                    </CardContent>
                </form>
                </Card>
            </div>
            
        </>
    );
};

export default CreateStaffForm;
