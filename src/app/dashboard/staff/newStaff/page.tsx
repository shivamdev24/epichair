"use client";

import React, {useEffect, useState } from "react";
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





interface ServiceType {
    length: number;
    _id: string;
    name: string;
}



const CreateStaffForm: React.FC = () => {

    const router = useRouter();


    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [rating, setRating] = useState<number | "">("");
    const [services, setServices] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
const [availableServices, setAvailableServices] = useState<ServiceType[]>([]);




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
                            <label>Username : <span className="text-red-500">*</span></label>
                        <Input
                            type="text"
                            value={username} id="userId"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </CardContent>
                    <CardContent>
                            <label>Email : <span className="text-red-500">*</span></label>
                        <Input
                            type="email"
                            id="userId"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </CardContent>

                    <CardContent>
                            <label>Role : <span className="text-red-500">*</span></label>
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


// "use client"


// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useRouter } from "next/navigation";


// interface ServiceType  {
//     length: number;
//     _id:string;
//     name:string;
// }



// const CreateStaffForm: React.FC = () => {
//     const router = useRouter();

//     const [username, setUsername] = useState<string>("");
//     const [email, setEmail] = useState<string>("");
//     const [feedback, setFeedback] = useState<string>("");
//     const [rating, setRating] = useState<number | "">("");
//     const [services, setServices] = useState<string[]>([]);
//     const [availableServices, setAvailableServices] = useState<ServiceType>([]);
//     const [errorMessage, setErrorMessage] = useState<string>("");

//     // Fetch available services from API
//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await fetch('/api/service'); // Adjust the endpoint as necessary
//                 const data = await response.json();

//                 // Log the entire response to verify what you're receiving
//                 console.log("Fetched Services Data:", data);

//                 // Assuming data is the array of services
//                 if (Array.isArray(data)) {
//                     setAvailableServices(data);
//                     console.log("availableServices", data); // Check what you're receiving
//                 } else {
//                     console.error("Services data is not in the expected format:", data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching services:", error);
//             }
//         };

//         fetchServices();
//     }, []);





//     // Handle checkbox change for services
//     const handleServiceChange = (service: string) => {
//         if (services.includes(service)) {
//             setServices(services.filter((s) => s !== service));
//         } else {
//             setServices([...services, service]);
//         }
//     };

//     const handleSubmit = async (e: { preventDefault: () => void }) => {
//         e.preventDefault();

//         const newStaff = {
//             username: username.trim() || "",
//             email: email.trim() || "",
//             feedback: feedback.trim() ?? "",
//             rating: rating !== undefined ? parseFloat(rating as string) : null,
//             services,
//         };

//         if (!newStaff.username || !newStaff.email || newStaff.services.length === 0) {
//             setErrorMessage("Email, username, and at least one service are required.");
//             return;
//         }

//         try {
//             const response = await fetch(`/api/admin/staff`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newStaff),
//             });

//             if (response.ok) {
//                 router.push('/dashboard/staff');
//             } else {
//                 setErrorMessage("Could not create staff. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error creating staff:", error);
//             setErrorMessage("Could not create staff. Please try again later.");
//         }
//     };

//     return (
//         <div className="px-5 py-5">
//             <Link href="/dashboard/staff" className="px-6 hover:bg-gray-900 p-2 bg-black text-white rounded">
//                 Back
//             </Link>

//             <Card className="m-4 w-full md:max-w-4xl mx-auto mt-12">
//                 <CardHeader>
//                     <CardTitle>Create Staff</CardTitle>
//                 </CardHeader>
//                 {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <CardContent>
//                         <label>Username:</label>
//                         <Input
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </CardContent>
//                     <CardContent>
//                         <label>Email:</label>
//                         <Input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </CardContent>
//                     <CardContent>
//                         <label>Feedback (Optional):</label>
//                         <Input
//                             type="text"
//                             value={feedback}
//                             onChange={(e) => setFeedback(e.target.value)}
//                         />
//                     </CardContent>
//                     <CardContent>
//                         <label>Rating (Optional):</label>
//                         <Input
//                             type="number"
//                             value={rating !== "" ? rating : ""}
//                             onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
//                             min="1"
//                             max="5"
//                         />
//                     </CardContent>
//                     <CardContent>
//                         <label>Services:</label>
//                         {availableServices.length > 0 ? (
//                             availableServices.map((service) => (
//                                 <div key={service._id} className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         id={service._id} // Using service._id for the checkbox id
//                                         checked={services.includes(service.name)}
//                                         onChange={() => handleServiceChange(service.name)} // Using service._id in the handle function
//                                         className="mr-2"
//                                     />
//                                     <label htmlFor={service._id}>{service.name}</label> {/* Rendering service name */}
//                                 </div>
//                             ))
//                         ) : (
//                             <p>No services available.</p>
//                         )}
//                     </CardContent>

//                     <CardContent className="form-actions mt-4 flex justify-end">
//                         <Button type="submit" className="mr-2 w-full ml-2 bg-blue-600 hover:bg-blue-500">
//                             Create Staff
//                         </Button>
//                     </CardContent>
//                 </form>
//             </Card>
//         </div>
//     );
// };

// export default CreateStaffForm;
