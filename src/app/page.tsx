// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// function OtpForm() {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const router = useRouter();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send OTP');
//       }

//       const data = await response.json();
//       console.log('OTP sent to:', email);
//       console.log(data);
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//     }
//   };

  


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Submitting OTP verification:', { email, otp }); // Log request data for debugging

//       const response = await fetch('/api/auth/login/verifyOtp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }), // Send email and OTP in the body
//       });

//       // Log the response to understand any errors
//       console.log('Response:', response);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`OTP verification failed: ${errorData.message || 'Unknown error'}`);
//       }

//       const data = await response.json();
//       console.log('Verify OTP:', otp);
//       console.log(data);

//       // Check if the role is 'user'
//       if (data.role === 'user') {
//         router.push('/user'); // Redirect to user page
//       } if (data.role === 'staff') {
//         router.push('/staff'); // Redirect to user page
//       }      
//       else {
//         console.log('User role is not user:', data.role);
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };







//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="button" onClick={handleSendOtp}>Send OTP</button>
//         <input
//           type="text"
//           placeholder="OTP verification"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default OtpForm;

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page