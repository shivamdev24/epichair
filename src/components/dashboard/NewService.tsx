"use client";

import { useState } from 'react';




interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    newService: {
        name: string;
        description?: string;
        price: number;
        duration: number;
    };
    setNewService: React.Dispatch<React.SetStateAction<{
        name: string;
        description?: string;
        price: number;
        duration: number;
    }>>;
    onServiceCreated: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose,  newService, setNewService, onServiceCreated }) => {
    const [fieldError, setFieldError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newService.name || !newService.duration || !newService.price) {
            setFieldError("Name, price, and duration are required");
            return;
        }

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
                console.log("Created service:", createdService);
                setNewService({ name: '', description: '', price: 0, duration: 0 });
                onServiceCreated(); // Call onServiceCreated here
                setFieldError(null);
                onClose();
            } else {
                console.error('Failed to create service:', response.statusText);
                setFieldError('Failed to create service');
            }
        } catch (error) {
            console.error('Error creating service:', error);
        }
    };

    return (
        <div className="fixed w-screen inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-5 rounded-lg">
                <div className="w-full p-5 shadow-lg md:w-[50rem] relative bg-white rounded-lg">
                    <button onClick={onClose} className="mt-2 absolute top-1 right-5 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Close
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">Create New Service</h2>
                    </div>
                    {fieldError && <span className="text-red-500 mb-2 block">{fieldError}</span>}

                    <form onSubmit={handleCreateService} className="mb-4">
                        <div className='text-lg mb-3'>
                            <label>Service Name: <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                required
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </div>

                        <div className='text-lg mb-3'>
                            <label>Description:</label>
                            <input
                                type="text"
                                placeholder="Service Description"
                                value={newService.description}
                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </div>

                        <div className='text-lg mb-3'>
                            <label>Price: <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                placeholder="Price"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                                required
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </div>

                        <div className='text-lg mb-3'>
                            <label>Duration (in minutes): <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                placeholder="Duration"
                                value={newService.duration}
                                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                                required
                                className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
                            />
                        </div>

                        <div className='text-lg'>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Add Service
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Modal;
