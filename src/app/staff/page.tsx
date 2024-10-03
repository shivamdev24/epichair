"use client"


import React from 'react'

function page() {
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Redirect the user to the login page after successful logout
                window.location.href = '/login'; // Adjust the path as needed
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
  return (
      <div><p>welcome to staff section</p>



          <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default page