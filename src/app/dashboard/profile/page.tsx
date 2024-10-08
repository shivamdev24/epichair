
"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/admin/delete-account`);

        if (response.ok) {
          alert('Account deleted successfully.');
          router.push("/login"); // Adjust the route as necessary
        } else {
          console.error('Failed to delete account:', response.statusText);
          alert('Failed to delete account.');
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Error deleting account. Please try again later.", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetch("/api/admin/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []); // No need to include user in the dependency array here.

  const handleClick = async () => {
    if (user) {
      router.push(`/dashboard/profile/${user.id}`);
    } else {
      console.error("User object is null");
    }
  };

  if (loading) {
    return (
      <p className="flex mx-auto h-screen justify-center items-center text-6xl">
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Failed to load user details.</div>;
  }

  return (
    <div className="px-5 py-5">
      <Link
        href="/dashboard"
        className="px-6 hover:bg-gray-900 p-2 bg-black text-white rounded"
      >
        Back
      </Link>
      <Card className="m-4 w-full md:max-w-4xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Input id="userId" readOnly value={user.id} placeholder="UserId" />
        </CardContent>
        <CardContent>
          <Input id="username" readOnly value={user.name} placeholder="Username" />
        </CardContent>
        <CardContent>
          <Input id="email" readOnly value={user.email} placeholder="Email" />
        </CardContent>

        <CardFooter className="flex w-full flex-col md:flex-row justify-between px-5">
          <p>Want to update?
            <Button onClick={handleClick} className="w-full md:w-32 bg-green-500 mt-4 md:mt-0">
              Update User
            </Button>
          </p>

          <Button onClick={handleDelete} className="w-full md:w-40 bg-red-500 hover:bg-red-600 mt-4 md:mt-0">
            Account Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
