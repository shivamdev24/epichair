"use client";

import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Service {
    _id: string;
    name: string;
    description?: string;
    price?: number; // Assuming the price field is available
    duration?: number; // Assuming the duration field is available
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void; // Function that takes no arguments and returns void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Function that takes a form event
    newService: {
        name: string;
        description?: string;
        price?: number;
        duration?: number;
    };
    setNewService: React.Dispatch<React.SetStateAction<{
        name: string;
        description?: string;
        price?: number;
        duration?: number;
    }>>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, newService, setNewService }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <Card className='w-[50rem] relative'>
                    <button onClick={onClose} className="mt-2 absolute top-1 right-5  px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Close</button>
                    <CardHeader>
                        <CardTitle>Create New Services</CardTitle>
                        
                    </CardHeader>
                    
                    
                    <form onSubmit={onSubmit} className="mb-4">
                        <CardContent className='text-lg'>
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                required
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </CardContent>
                        <CardContent className='text-lg'>
                            <input
                                type="text"
                                placeholder="Description"
                                value={newService.description}
                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </CardContent>
                        <CardContent className='text-lg'>
                            <input
                                type="number"
                                placeholder="Price"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </CardContent>
                        <CardContent className='text-lg'>
                            <input
                                type="number"
                                placeholder="Duration (min)"
                                value={newService.duration}
                                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </CardContent>
                        
                        
                        
                        <CardContent className='text-lg'>
                            
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Add Service
                        </button>
                        </CardContent>
                    </form>
                </Card>
                
            </div>
        </div>
    );
};

const ServiceManagement = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [servicesPerPage] = useState<number>(10); // Number of services per page
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // Form state
    const [newService, setNewService] = useState<{
        name: string;
        description?: string; // Optional
        price?: number;       // Optional
        duration?: number;    // Optional
    }>({
        name: '',
        description: '', // Still can be used but as optional
        price: 0,
        duration: 0,
    });



    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/admin/service');
                const data = await response.json();
                console.log('API response:', data); // Log the entire response

                // Check if data is an array directly
                if (Array.isArray(data)) {
                    setServices(data);
                } else {
                    console.warn('Expected services to be an array but got:', data);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const handleDeleteService = async (serviceId: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            try {
                const response = await fetch(`/api/admin/service?id=${serviceId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setServices(services.filter(service => service._id !== serviceId));
                    
                } else {
                    console.error('Failed to delete service:', response.statusText);
                    alert('Failed to delete service.');
                }
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Error deleting service.');
            }
        }
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newService),
            });

            if (response.ok) {
                const createdService = await response.json();
                setServices([...services, createdService]); // Add new service to state
                // Indicate success
                setNewService({ name: '', description: '', price: 0, duration: 0 }); // Reset form
                setIsModalOpen(false);
            } else {
                console.error('Failed to create service:', response.statusText);
                alert('Failed to create service.');
            }
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Error creating service.');
        }
    };

    // Pagination logic
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(services.length / servicesPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='px-5'>
            <section className='py-10 flex justify-between'>
                <Card className='w-72'>
                    <CardHeader>
                        <CardTitle>Total Services</CardTitle>
                    </CardHeader>
                    <CardContent className='text-lg'>
                        {services.length}
                    </CardContent>
                </Card>
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)} // Open modal
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create New Service
                    </button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleCreateService}
                        newService={newService}
                        setNewService={setNewService}
                    />
                </div>
            </section>

            <section className='pb-10'>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Service ID</th>
                            <th className="border border-gray-300 px-4 py-2">Service Name</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Duration (min)</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices.map(service => (
                            <tr key={service._id}>
                                <td className="border border-gray-300 px-4 py-4 text-center">{service._id}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{service.name}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{service.description}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{service.price ?? 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">{service.duration ?? 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-4 text-center">
                                    <button
                                        onClick={() => handleDeleteService(service._id)}
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

export default ServiceManagement;
