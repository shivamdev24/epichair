"use client";

import { ReactNode, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import StackedLineChart from '@/components/dashboard/StackedLineChart';


interface Appointment {
  appointmentTime: ReactNode;
  status: string;
  appointmentType: ReactNode;
  _id: string;
  service: {name: string};
  appointmentDate: string | number | Date;
  barber: {
    username: string;
  };
  user: {
    username: string;
  };
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState(0);
  const [staff, setStaff] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); // Number of appointments per page

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/admin/appointment');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Unexpected response format");
        }

        // Get today's date
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Filter today's appointments
        const filteredTodayAppointments = data.filter((appointment: Appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= startOfToday && appointmentDate < endOfToday;
        });

        setTodayAppointments(filteredTodayAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/admin/user');
        const data = await response.json();

        // Log the entire data object
        console.log('Fetched User Data:', data);

        // Access the User key to get the array of users
        if (data.User && Array.isArray(data.User)) {
          setUser(data.User.length);
        } else {
          console.warn('Expected User to be an array but got:', data.User);
          setUser(0); // Or handle as needed
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/admin/staff');
        const data = await response.json();

        // Log the entire data object
        console.log('Fetched Staff Data:', data);

        // Correctly access the staff property
        if (data.staff && Array.isArray(data.staff)) {
          setStaff(data.staff.length); // Or rename this to something like setStaffCount
        } else {
          console.warn('Expected staff to be an array but got:', data.staff);
          setStaff(0); // Handle as needed
        }

      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };


    fetchAppointments();
    fetchUser();
    fetchStaff();
  }, []);
  

  // Calculate the total number of pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  // Calculate the start and end index for slicing the appointments array
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  const currentAppointments = Array.isArray(appointments)
    ? appointments.slice(startIndex, endIndex)
    : [];

  // Get the appointments for the current page

  return (
    <div className='px-5'>


<section className='py-10 flex justify-evenly'>
        <Card className='w-72'>
          <CardHeader>
            <CardTitle>Today&apos;s Appointment</CardTitle>
            
          </CardHeader>
          <CardContent className='text-lg'>
            {todayAppointments.length}
          </CardContent>
          
        </Card>
        
        <Card className='w-72'>
          <CardHeader>
            <CardTitle>Total Appointment</CardTitle>
            
          </CardHeader>
          <CardContent className='text-lg'>
            {appointments.length}
          </CardContent>
          
        </Card>
        <Card className='w-72'>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            
          </CardHeader>
          <CardContent className='text-lg'>
            {user}
          </CardContent>
          
        </Card>
        <Card className='w-72'>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
            
          </CardHeader>
          <CardContent className='text-lg'>
            {staff}
          </CardContent>
          
        </Card>


</section>

{/* 
<section>
        <StackedLineChart />
</section>
  */}

     

     <section className='pb-10'>
        
      <h2>Today&apos;s Appointments: </h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Barber</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Service</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Type</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.username || 'Unknown Barber'}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.username || 'Unknown User'}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.service?.name || "Unknown"}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentTime}</td>
                <td className={`border border-gray-300 px-4 py-4 text-white font-bold text-center ${appointment.status === "pending" ? "bg-yellow-600" :
                  appointment.status === "confirmed" ? "bg-green-500" :
                    appointment.status === "completed" ? "bg-blue-500" :
                      appointment.status === "cancelled" ? "bg-red-500" :
                        "text-gray-500" // Fallback color for undefined status
                  }`}>
                  {appointment.status}
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentType}</td>
              </tr>
            ))}
          </tbody>
        </table>

     </section>
     <section>

        <h2 className='text-lg font-bold text-blue-800'>Total Appointments </h2>
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Barber</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Service</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Type</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.barber?.username || 'Unknown Barber'}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.user?.username || 'Unknown User'}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.service?.name}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentTime}</td>
                <td className={`border border-gray-300 px-4 py-4 text-white font-bold text-center ${appointment.status === "pending" ? "bg-yellow-600" :
                    appointment.status === "confirmed" ? "bg-green-500" :
                      appointment.status === "completed" ? "bg-blue-500" :
                        appointment.status === "cancelled" ? "bg-red-500" :
                          "text-gray-500" // Fallback color for undefined status
                  }`}>
                  {appointment.status}
                </td>

                <td className="border border-gray-300 px-4 py-4 text-center">{appointment.appointmentType}</td>
              </tr>
            ))}
          </tbody>
        </table>

     </section>




      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-4 mt-4"> 
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <span> Page : {currentPage} of {totalPages} </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;


