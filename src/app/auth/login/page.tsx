// "use client";

// import { ReactNode, useEffect, useState } from 'react';
// import {
//   Card,
//   CardContent,
 
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// // import StackedLineChart from '@/components/dashboard/StackedLineChart';


// interface Appointment {
//   appointmentTime: string;
//   status: string;
//   appointmentType: ReactNode;
//   _id: string;
//   service: {name: string};
//   appointmentDate: string | number | Date;
//   barber: {
//     username: string;
//     email: string;
//   };
//   user: {
//     username: string;
//     email: string;
//   };
// }

// const Dashboard = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [user, setUser] = useState(0);
//   const [staff, setStaff] = useState(0);
//   const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   // const [currentTodayAppointments, setcurrentTodayAppointments] = useState(1);
//   const [appointmentsPerPage] = useState(10); // Number of appointments per page

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await fetch('/api/admin/appointment');
//         const data = await response.json();
//         // console.log(data)
//         if (Array.isArray(data)) {
//           setAppointments(data);
//         } else {
//           console.error("Unexpected response format");
//         }

//         // Get today's date
//         const today = new Date();
//         const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//         const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

//         // Filter today's appointments
//         const filteredTodayAppointments = data.filter((appointment: Appointment) => {
//           const appointmentDate = new Date(appointment.appointmentDate);
//           return appointmentDate >= startOfToday && appointmentDate < endOfToday;
//         });

//         setTodayAppointments(filteredTodayAppointments);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       }
//     };
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('/api/admin/user');
//         const data = await response.json();

//         // Log the entire data object
//         // console.log('Fetched User Data:', data);

//         // Access the User key to get the array of users
//         if (data.User && Array.isArray(data.User)) {
//           setUser(data.User.length);
//         } else {
//           // console.warn('Expected User to be an array but got:', data.User);
//           console.log('Expected User to be an array but got: something else');
//           setUser(0); // Or handle as needed
//         }

//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
  //   const fetchStaff = async () => {
  //     try {
  //       const response = await fetch('/api/admin/staff');
  //       const data = await response.json();

  //       // Log the entire data object
  //       // console.log('Fetched Staff Data:', data);

  //       // Correctly access the staff property
  //       if (data.staff && Array.isArray(data.staff)) {
  //         setStaff(data.staff.length); // Or rename this to something like setStaffCount
  //       } else {
  //         // console.warn('Expected staff to be an array but got:', data.staff);
  //         setStaff(0); // Handle as needed
  //       }

  //     } catch (error) {
  //       console.error('Error fetching staff:', error);
  //     }
  //   };
  //   const callservice = async () => {
  //     const response = await fetch('/api/admin/service');
  //     //  await response.json();
  //     const data = await response.json();

  //     // Log the entire data object
  //     console.log('Fetched Service Data:', data);
      
  //   };


  //   fetchAppointments();
  //   fetchUser();
  //   fetchStaff();
  //   callservice();
  // }, []);

//   const deleteAppointment = async (appointmentId: string) => {
//     try {
//       const response = await fetch(`/api/admin/appointment?id=${appointmentId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         // console.log(`Error deleting appointment. Status: ${response.status}`);
//         const errorMessage = await response.text();
//         console.error(`Error message from server: ${errorMessage}`);
//         throw new Error(`Failed to delete appointment: ${errorMessage}`);
//       }

//       setAppointments((prevAppointments) =>
//         prevAppointments.filter((appointment) => appointment._id !== appointmentId)
//       );

//       console.log("Appointment deleted successfully");
//     } catch (err) {
//       console.error("Error deleting appointment:", err);
//       console.warn("An error occurred while deleting the appointment");
//     }
//   };
  
//   const formatTime = (timeString: string) => {
//     const [hours, minutes] = timeString.split(':');
//     let hour = parseInt(hours, 10);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     hour = hour % 12 || 12; // Convert to 12-hour format, handle '0' as '12'
//     return `${hour}:${minutes} ${ampm}`;
//   };
//   // Calculate the total number of pages
//   const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

//   // Calculate the start and end index for slicing the appointments array
//   const startIndex = (currentPage - 1) * appointmentsPerPage;
//   const endIndex = startIndex + appointmentsPerPage;
//   const currentAppointments = Array.isArray(appointments)
//     ? appointments.slice(startIndex, endIndex)
//     : [];
//   const TodayAppoints = Array.isArray(todayAppointments)
//     ? todayAppointments.slice(startIndex, endIndex)
//     : [];


//   return (
//     <div className='px-5'>


// <section className='py-10 flex flex-col md:flex-row items-center gap-4 justify-evenly'>
//         <Card className='w-full text-center md:w-72'>
//           <CardHeader>
//             <CardTitle>Today&apos;s Appointment</CardTitle>
            
//           </CardHeader>
//           <CardContent className='text-xl font-bold text-blue-500'>
//             {todayAppointments.length}
//           </CardContent>
          
//         </Card>
        
//         <Card className='w-full text-center md:w-72'>
//           <CardHeader>
//             <CardTitle>Total Appointment</CardTitle>
            
//           </CardHeader>
//           <CardContent className='text-xl font-bold text-blue-500'>
//             {appointments.length}
//           </CardContent>
          
//         </Card>
//         <Card className='w-full text-center md:w-72'>
//           <CardHeader>
//             <CardTitle>Total Users</CardTitle>
            
//           </CardHeader>
//           <CardContent className='text-xl font-bold text-blue-500'>
//             {user}
//           </CardContent>
          
//         </Card>
//         <Card className='w-full text-center md:w-72'>
//           <CardHeader>
//             <CardTitle>Total Staff</CardTitle>
            
//           </CardHeader>
//           <CardContent className='text-xl font-bold text-blue-500'>
//             {staff}
//           </CardContent>
          
//         </Card>


// </section>



     

//       <Card className='overflow-hidden overflow-x-auto overflow-y-auto'>
        
//         <h2 className='text-lg p-3 font-bold text-blue-800'>Today&apos;s Appointments </h2>
//         <table className="min-w-full border-collapse border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 px-4 py-2">Barber</th>
//               <th className="border border-gray-300 px-4 py-2">Barber Email</th>
//               <th className="border border-gray-300 px-4 py-2">User</th>
//               <th className="border border-gray-300 px-4 py-2">User Email</th>
//               <th className="border border-gray-300 px-4 py-2">Service</th>
//               <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
//               <th className="border border-gray-300 px-4 py-2">Appointment Time</th>
//               <th className="border border-gray-300 px-4 py-2">Status</th>
//               <th className="border border-gray-300 px-2 py-2">Appointment Type</th>
//               <th className="px-6 py-3 border border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {TodayAppoints.map((appointment) => (
//               <tr key={appointment._id}>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.username || 'Unknown Barber'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.email || 'Unknown Barber'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.username || 'Unknown User'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.email || 'Unknown User'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.service?.name || "No Services"}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
//                 {/* <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentTime}</td> */}
//                 <td className="border border-gray-300 px-4 py-4 text-center">
//                   {formatTime(appointment.appointmentTime)}
//                 </td>
//                 <td className={`border border-gray-300 px-4 py-4 text-white font-bold text-center ${appointment.status === "pending" ? "bg-yellow-600" :
//                   appointment.status === "confirmed" ? "bg-green-500" :
//                     appointment.status === "completed" ? "bg-blue-500" :
//                       appointment.status === "cancelled" ? "bg-red-500" :
//                         "text-gray-500" // Fallback color for undefined status
//                   }`}>
//                   {appointment.status}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentType}</td>

//                 <td className=" px-7 py-4 border gap-3 border-gray-300 text-gray-300 flex items-center justify-center ">
//                   <Link
//                     href={`/dashboard/appointments/${appointment._id}`}
                    
//                   >
//                     <Button className=" bg-yellow-500 text-white rounded">
//                       Edit
//                     </Button>
//                   </Link>
//                   <Button
//                     onClick={() => deleteAppointment(appointment._id)}
//                     className="px-2 py-1 bg-red-500 text-white rounded"
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//      </Card>
//       {/* <div className="flex items-center justify-center space-x-4 mt-4">
//         <button
//           onClick={() => setcurrentTodayAppointments(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Previous
//         </button>
//         <span> Page : {currentPage} of {totalPages} </span>
//         <button
//           onClick={() => setcurrentTodayAppointments(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentTodayAppointments === totalPages}
//           className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Next
//         </button>
//       </div> */}
//       <Card className='overflow-hidden overflow-x-auto mt-10'>
//         <h2 className='text-lg p-3 font-bold text-blue-800'>Total Appointments </h2>

//         <table className="min-w-full border-collapse border border-gray-300 mt-2 rounded-lg">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 px-4 py-2">Barber</th>
//               <th className="border border-gray-300 px-4 py-2">Barber Email</th>
//               <th className="border border-gray-300 px-4 py-2">User</th>
//               <th className="border border-gray-300 px-4 py-2">User Email</th>
//               <th className="border border-gray-300 px-4 py-2">Service</th>
//               <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
//               <th className="border border-gray-300 px-4 py-2">Appointment Time</th>
//               <th className="border border-gray-300 px-4 py-2">Status</th>
//               <th className="border border-gray-300 px-4 py-2">Appointment Type</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentAppointments.map((appointment) => (
//               <tr key={appointment._id}>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.username || 'Unknown Barber'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.email || 'Unknown Barber'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.username || 'Unknown User'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.email || 'Unknown User'}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.service?.name || "No Services"}</td>
//                 <td className="border border-gray-300 px-4 py-4 text-center">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
//                 {/* <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentTime}</td> */}
//                 <td className="border border-gray-300 px-4 py-4 text-center">
//                   {formatTime(appointment.appointmentTime)}
//                 </td>
//                 <td className={`border border-gray-300 px-4 py-4 text-white font-bold text-center ${appointment.status === "pending" ? "bg-yellow-600" :
//                     appointment.status === "confirmed" ? "bg-green-500" :
//                       appointment.status === "completed" ? "bg-blue-500" :
//                         appointment.status === "cancelled" ? "bg-red-500" :
//                           "text-gray-500" // Fallback color for undefined status
//                   }`}>
//                   {appointment.status}
//                 </td>

//                 <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentType}</td>
               
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Pagination Controls */}
//         <div className="flex items-center justify-center space-x-4 mt-4">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             Previous
//           </button>
//           <span> Page : {currentPage} of {totalPages} </span>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             Next
//           </button>
//         </div>

//       </Card>




      
      
//     </div>
//   );
// };

// export default Dashboard;


"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Appointment {
  _id: string;
  barber: { username: string, email: string } | null;
  user: { email: string, username: string };
  service: { _id: string; name: string } | null;
  appointmentDate: string;
  appointmentTime?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  appointmentType: "inApp" | "WalkIn";
  feedback?: string;
  rating?: number;
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState(0);
    const [staff, setStaff] = useState(0);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10; // Number of appointments per page

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/admin/appointment');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAppointments(data);
        }

        // Filter today's appointments
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const filteredTodayAppointments = data.filter((appointment: Appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= startOfToday && appointmentDate < endOfToday;
        });

        setTodayAppointments(filteredTodayAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/admin/staff');
        const data = await response.json();

        // Log the entire data object
        // console.log('Fetched Staff Data:', data);

        // Correctly access the staff property
        if (data.staff && Array.isArray(data.staff)) {
          setStaff(data.staff.length); // Or rename this to something like setStaffCount
        } else {
          // console.warn('Expected staff to be an array but got:', data.staff);
          setStaff(0); // Handle as needed
        }
       

      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    const fetchUser = async () => {
      const response = await fetch('/api/admin/user');
      //  await response.json();
      const data = await response.json();
      console.log('Fetched user Data:', data);
      if (data.User && Array.isArray(data.User)) {
        setUser(data.User.length); // Or rename this to something like setStaffCount
      } else {
        // console.warn('Expected staff to be an array but got:', data.staff);
        setUser(0); // Handle as needed
      }
      // Log the entire data object

    };


    fetchUser();
    fetchStaff();
    fetchAppointments();
  }, []);
 



  



  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert to 12-hour format, handle '0' as '12'
    return `${hour}:${minutes} ${ampm}`;
  };

  // Pagination calculations for general appointments
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  return (
    <div className='px-5 py-10'>




 <section className='py-10 flex flex-col md:flex-row items-center gap-4 justify-evenly'>
         <Card className='w-full text-center md:w-72'>
           <CardHeader>
             <CardTitle>Today&apos;s Appointment</CardTitle>          
           </CardHeader>
           <CardContent className='text-xl font-bold text-blue-500'>
             {todayAppointments.length}
           </CardContent>        
         </Card>      
         <Card className='w-full text-center md:w-72'>
           <CardHeader>
             <CardTitle>Total Appointment</CardTitle>          
           </CardHeader>
           <CardContent className='text-xl font-bold text-blue-500'>
             {appointments.length}
           </CardContent>        
         </Card>
         <Card className='w-full text-center md:w-72'>
           <CardHeader>
             <CardTitle>Total Users</CardTitle>          
           </CardHeader>
           <CardContent className='text-xl font-bold text-blue-500'>
             {user}
           </CardContent>        
         </Card>
         <Card className='w-full text-center md:w-72'>
           <CardHeader>
             <CardTitle>Total Staff</CardTitle>          
           </CardHeader>
           <CardContent className='text-xl font-bold text-blue-500'>
             {staff}
           </CardContent>        
         </Card>


 </section>





      {/* Today's Appointments - No Pagination */}
      <Card className='overflow-hidden overflow-x-auto '>
        <h2 className='text-lg p-3 font-bold text-blue-800'>Today&apos;s Appointments</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Barber Name</th>
              <th className="border border-gray-300 px-4 py-2">User Name</th>
              <th className="border border-gray-300 px-4 py-2">Service</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="px-6 py-3 border border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {appointment.barber?.username || 'Unknown Barber'}
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {appointment.user?.username || 'Unknown User'}
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {appointment.service?.name || 'No Service'}
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {appointment.appointmentTime ? formatTime(appointment.appointmentTime as string) : 'N/A'}
                </td>
                <td className={`border border-gray-300 px-4 py-4 text-white text-center ${appointment.status === "pending" ? "bg-yellow-600" :
                  appointment.status === "confirmed" ? "bg-green-500" :
                    appointment.status === "completed" ? "bg-blue-500" :
                      appointment.status === "cancelled" ? "bg-red-500" :
                        "text-gray-500"
                  }`}>
                  {appointment.status}
                </td>
                
                <td className=" px-7 py-4 border gap-3 border-gray-300 text-gray-300 flex items-center justify-center ">
                               <Link
                                href={`/dashboard/appointments/${appointment._id}`}

                              >
                                <Button className=" bg-yellow-500 text-white rounded">
                                  Edit
                                </Button>
                              </Link>
                             
                             </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Paginated Appointments */}
      <Card className='overflow-hidden overflow-x-auto mt-8'>
        <h2 className='text-lg p-3 font-bold text-blue-800'>All Appointments</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-3 border-2 border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">User</th>
              <th className="px-4 py-3 border-2 border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">User Email</th>
              <th className="px-4 py-3 border-2 border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">Barber</th>
              <th className="px-4 py-3 border-2 border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">Barber Email</th>
              <th className="px-4 py-3 border-2 border-gray-300 text-center text-sm leading-4 text-gray-600 tracking-wider">Service</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Appointment Date</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Appointment Time</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Status</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Type</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Feedback</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Rating</th>
              <th className="px-4 py-3 border-2 border-gray-300  text-center text-sm leading-4 text-gray-600 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody >
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id} >
                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">
                  {appointment.user?.username || "No User"}
                </td>
                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">
                  {appointment.user?.email || "No User"}
                </td>
                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">
                  {appointment.barber?.username || "Unknown Barber"}
                </td>
                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">
                  {appointment.barber?.email || "Unknown Barber"}
                </td>
                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">{appointment.service?.name || "No Services"}</td>
                {/* <td className="px-6 text-center py-4 whitespace-no-wrap border border-gray-300">
                      {typeof appointment.service === "object" ? appointment.service?.name : appointment.service || "No Services"}
                    </td> */}

                <td className="px-4 text-center  py-4 whitespace-no-wrap border border-gray-300">
                  {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                {/* <td className="px-6 text-center py-4 whitespace-no-wrap border border-gray-300">{appointment.appointmentTime || "Not Set"}</td> */}
                <td className="border border-gray-300 px-4 py-4 text-center">
                  {appointment.appointmentTime ? formatTime(appointment.appointmentTime as string) : 'N/A'}
                </td>
                <td className={`border border-gray-300 px-4 py-4 text-white font-bold text-center ${appointment.status === "pending" ? "bg-yellow-600" :
                  appointment.status === "confirmed" ? "bg-green-500" :
                    appointment.status === "completed" ? "bg-blue-500" :
                      appointment.status === "cancelled" ? "bg-red-500" :
                        "text-gray-500" // Fallback color for undefined status
                  }`}>
                  {appointment.status}
                </td>
                <td className="px-4 text-center py-4 whitespace-no-wrap border border-gray-300">{appointment.appointmentType}</td>
                <td className="px-4 text-center py-4 whitespace-no-wrap border border-gray-300">{appointment.feedback || "No Feedback"}</td>
                <td className="px-4 text-center py-4 whitespace-no-wrap border border-gray-300">
                  {appointment.rating != null && !isNaN(appointment.rating) ? appointment.rating : "Not Rated"}
                </td>

                <td className=" px-4 py-5 border-b border-r  gap-3 border-gray-300 text-gray-600 flex items-center justify-center  ">
                  <Link
                    href={`/dashboard/appointments/${appointment._id}`}

                  >
                    <Button className=" bg-yellow-500 text-white rounded">Edit</Button>
                  </Link>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
