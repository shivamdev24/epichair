


"use client";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type

import {  useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import HashLoader from "react-spinners/HashLoader";

export default function SignInPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

 

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await Axios.post("/api/auth/signup/admin", user);
      console.log("Sent verification Otp Successfully.", response.data);
      router.push(`/auth/signup/verifyotp?email=${encodeURIComponent(user.email)}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signup failed:", error); // Log the error for debugging
      setErrorMessage(
        error.response?.data?.message || "An error occurred during Signup." // Display error message
      );
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  

  return (
    <div className="flex mx-auto flex-col justify-center items-center h-screen relative px-5">
      <div>
        {loading ? (
          <p className="flex mx-auto h-screen w-screen absolute top-0 left-0 bg-white justify-center items-center text-6xl">
            <HashLoader
              color="#000"
              loading={loading}
              size={80}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </p>
        ) : ""}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Card className="w-full p-8 flex mx-auto flex-col justify-center items-center ">
          <CardHeader>
            <CardTitle>Login Into Account</CardTitle>
          </CardHeader>
          <form onSubmit={onSignIn}>
            <CardContent>
              <Input
                placeholder="Email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </CardContent>
            <CardContent>
              <Input
                placeholder="Password"
                autoComplete="current-password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </CardContent>
            <CardContent>
              <Button
                className="w-full"
                type="submit"
                
              >
                Signup
              </Button>
            </CardContent>
           
          </form>
          <Separator />
          <CardFooter className="mt-4 flex gap-3">

            <p>Already have an account? </p>
            <Link
              className="text-blue-500 hover:text-gray-900 duration-500"
              href="/"
            >
              Login here.
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}