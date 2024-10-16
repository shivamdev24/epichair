// "use client";

// import { useEffect, useState } from 'react';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";

// interface Service {
//     _id: string;
//     name: string;
//     description?: string;
//     price?: number; // Assuming the price field is available
//     duration?: number; // Assuming the duration field is available
// }

// interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void; // Function that takes no arguments and returns void
//     onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Function that takes a form event
//     newService: {
//         name: string;
//         description?: string;
//         price: number;
//         duration?: number;
//     };
//     setNewService: React.Dispatch<React.SetStateAction<{
//         name: string;
//         description?: string;
//         price: number;
//         duration?: number;
//     }>>;
// }


// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, newService, setNewService }) => {
//     const [services, setServices] = useState<any[]>([]);

//     const [fieldError, setFieldError] = useState<string | null>(null); // State for managing validation errors

//     const handleCreateService = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Validation: Check if required fields are present
//         if (!newService.name || !newService.duration || !newService.price) {
//             setFieldError("Name, price, and duration are required");
//             return;
//         }

//         try {
//             // Send POST request to create new service
//             const response = await fetch('/api/admin/service', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(newService),
//             });

//             if (response.ok) {
//                 const createdService = await response.json();
//                 console.log("Created service:", createdService);
//                 setServices((prevServices) => [...prevServices, createdService]); // Add new service to services state
//                 setNewService({ name: '', description: '', price: 0, duration: 0 }); // Reset form fields
//                 setFieldError(null); // Clear field error
//                 onClose(); // Close modal
//             } else {
//                 console.error('Failed to create service:', response.statusText);
//                 setFieldError('Failed to create service');
//             }
//         } catch (error) {
//             console.error('Error creating service:', error);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed w-screen inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="p-5 rounded-lg">
//                 <div className="w-full p-5 shadow-lg md:w-[50rem] relative bg-white rounded-lg">
//                     <button onClick={onClose} className="mt-2 absolute top-1 right-5 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
//                         Close
//                     </button>
//                     <div>
//                         <h2 className="text-xl font-bold">Create New Service</h2>
//                     </div>

//                     {fieldError && <span className="text-red-500 mb-2 block">{fieldError}</span>} {/* Display error if present */}

//                     <form onSubmit={handleCreateService} className="mb-4">
//                         {/* Service Name Field */}
//                         <div className='text-lg mb-3'>
//                             <label>Service Name: <span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 placeholder="Service Name"
//                                 value={newService.name}
//                                 onChange={(e) => setNewService({ ...newService, name: e.target.value })}
//                                 required
//                                 className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
//                             />
//                         </div>

//                         {/* Service Description Field */}
//                         <div className='text-lg mb-3'>
//                             <label>Description:</label>
//                             <input
//                                 type="text"
//                                 placeholder="Service Description"
//                                 value={newService.description}
//                                 onChange={(e) => setNewService({ ...newService, description: e.target.value })}
//                                 className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
//                             />
//                         </div>

//                         {/* Service Price Field */}
//                         <div className='text-lg mb-3'>
//                             <label>Price: <span className="text-red-500">*</span></label>
//                             <input
//                                 type="number"
//                                 placeholder="Price"
//                                 value={newService.price}
//                                 onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
//                                 required
//                                 className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
//                             />
//                         </div>

//                         {/* Service Duration Field */}
//                         <div className='text-lg mb-3'>
//                             <label>Duration (in minutes): <span className="text-red-500">*</span></label>
//                             <input
//                                 type="number"
//                                 placeholder="Duration"
//                                 value={newService.duration}
//                                 onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
//                                 required
//                                 className="border rounded border-gray-300 px-2 py-1 mr-2 w-full"
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <div className='text-lg'>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                             >
//                                 Add Service
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };



// const ServiceManagement = () => {
//     const [services, setServices] = useState<Service[]>([]);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [servicesPerPage] = useState<number>(10); // Number of services per page
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//     // Form state
//     const [newService, setNewService] = useState<{
//         name: string;
//         description?: string; // Optional
//         price: number;       
//         duration: number;    
//     }>({
//         name: '',
//         description: '', 
//         price: 0,
//         duration: 0,
//     });



//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await fetch('/api/admin/service');
//                 const data = await response.json();
//                 // console.log('API response:', data); // Log the entire response
// console.log(data)
//                 // Check if data is an array directly
//                 if (Array.isArray(data)) {
//                     setServices(data);
//                 } else {
//                     console.warn('Expected services to be an array but got: undefined');
//                 }
//             } catch (error) {
//                 console.error('Error fetching services:', error);
//             }
//         };

//         fetchServices();
//     }, []);

//     const handleDeleteService = async (serviceId: string) => {
//         try {
//             const response = await fetch(`/api/admin/service?id=${serviceId}`, {
//                 method: 'DELETE',
//             });
//             if (response.ok) {
//                 setServices(services.filter(service => service._id !== serviceId));
                
//             } else {
//                 console.error('Failed to delete service:', response.statusText);
//                 alert('Failed to delete service.');
//             }
//         } catch (error) {
//             console.error('Error deleting service:', error);
//             alert('Error deleting service.');
//         }

//     };

    

//     // Pagination logic
//     const indexOfLastService = currentPage * servicesPerPage;
//     const indexOfFirstService = indexOfLastService - servicesPerPage;
//     const currentServices = services.slice(indexOfFirstService, indexOfLastService);
//     const totalPages = Math.ceil(services.length / servicesPerPage);

//     const handlePageChange = (pageNumber: number) => {
//         setCurrentPage(pageNumber);
//     };




//     return (
//         <div className='px-5'>
//             <section className='py-10 flex gap-4 flex-col-reverse md:flex-row justify-between'>
//                 <Card className='w-72'>
//                     <CardHeader>
//                         <CardTitle>Total Services</CardTitle>
//                     </CardHeader>
//                     <CardContent className='text-xl font-bold text-blue-500'>
//                         {services.length}
//                     </CardContent>
//                 </Card>
//                 <div>
//                     <button
//                         onClick={() => setIsModalOpen(true)} // Open modal
//                         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                     >
//                         Create New Service
//                     </button>
//                     <Modal
//                         isOpen={isModalOpen}
//                         onClose={() => setIsModalOpen(false)}
//                         newService={newService}
//                         setNewService={setNewService}
//                     />
//                 </div>
//             </section>

//             <Card className=' overflow-hidden overflow-x-auto'>
//                 <table className="min-w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr>
//                             <th className="border border-gray-300 px-4 py-2">Service ID</th>
//                             <th className="border border-gray-300 px-4 py-2">Service Name</th>
//                             <th className="border border-gray-300 px-4 py-2">Description</th>
//                             <th className="border border-gray-300 px-4 py-2">Price</th>
//                             <th className="border border-gray-300 px-4 py-2">Duration (min)</th>
//                             <th className="border border-gray-300 px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentServices.map(service => (
//                             <tr key={service._id}>
//                                 <td className="border border-gray-300 px-4 py-4 text-center">{service._id}</td>
//                                 <td className="border border-gray-300 px-4 py-4 text-center">{service.name}</td>
//                                 <td className="border border-gray-300 px-4 py-4 text-center">
//                                     {service.description && service.description.trim() !== '' ? service.description : 'N/A'}
//                                 </td>

//                                 <td className="border border-gray-300 px-4 py-4 text-center">
//                                     {service.price && service.price > 0 ? service.price : 'N/A'}
//                                 </td>
//                                 <td className="border border-gray-300 px-4 py-4 text-center">
//                                     {service.duration && service.duration > 0 ? service.duration : 'N/A'}
//                                 </td>

//                                 <td className="border border-gray-300 px-4 py-4 text-center">
//                                     <button
//                                         onClick={() => handleDeleteService(service._id)}
//                                         className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {/* Pagination Controls */}
//             </Card>
//                 <div className="flex justify-center mt-4">
//                     {Array.from({ length: totalPages }, (_, index) => (
//                         <button
//                             key={index + 1}
//                             onClick={() => handlePageChange(index + 1)}
//                             className={`mx-1 px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                         >
//                             {index + 1}
//                         </button>
//                     ))}
//                 </div>
//         </div>
//     );
// };




// export default ServiceManagement;


"use client";

import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Modal from '@/components/dashboard/NewService'; // Import the Modal component

interface Service {
    _id: string;
    name: string;
    description?: string;
    price?: number;
    duration: number;
}

const ServiceManagement = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [servicesPerPage] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [newService, setNewService] = useState<{
        name: string;
        description?: string;
        price: number;
        duration: number;
    }>({
        name: '',
        description: '',
        price: 0,
        duration: 0,
    });




  




    const fetchServices = async () => {
        try {
            const response = await fetch('/api/admin/service');
            const data = await response.json();
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.warn('Expected services to be an array but got: undefined');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    useEffect(() => {

        fetchServices();
    }, []);

    const handleDeleteService = async (serviceId: string) => {
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
    };

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(services.length / servicesPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='px-5'>
            <section className='py-10 flex gap-4 flex-col-reverse md:flex-row justify-between'>
                <Card className='w-72'>
                    <CardHeader>
                        <CardTitle>Total Services</CardTitle>
                    </CardHeader>
                    <CardContent className='text-xl font-bold text-blue-500'>
                        {services.length}
                    </CardContent>
                </Card>
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create New Service
                    </button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        newService={newService}
                        setNewService={setNewService}
                        onServiceCreated={fetchServices} onSubmit={function (): void {
                            throw new Error('Function not implemented.');
                        } }                    />
                </div>
            </section>

            <Card className='overflow-hidden overflow-x-auto'>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Service ID</th>
                            <th className="border border-gray-300 px-4 py-2">Service Name</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Duration</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices.map((service) => (
                            <tr key={service._id}>
                                <td className="border border-gray-300 px-4 py-2">{service._id}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.description}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.duration}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteService(service._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className="flex justify-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 border border-gray-300 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-blue-500'} hover:bg-blue-600 hover:text-white`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceManagement;


