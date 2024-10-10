"use client";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import HashLoader from "react-spinners/HashLoader";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState({
    login: true,
    otp: true,
  });
  const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setButtonDisabled({ login: false, otp: false }); // Enable both buttons
    } else if (email.length > 0 && password.length === 0) {
      setButtonDisabled({ login: true, otp: false }); // Enable only OTP button
    } else {
      setButtonDisabled({ login: true, otp: true }); // Disable both buttons
    }
  }, [email, password]);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    setLoading(true);
    // setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await Axios.post("/api/admin/auth/loginwithPassword", { email, password });
      console.log("Sent verification Otp Successfully.", response.data);
      router.push(`/dashboard`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error); // Log the error for debugging
      // setErrorMessage(
      //   error.response?.data?.message || "An error occurred during login." // Display error message
      // );
    } 
  };

  const onOtpLogin = async () => {
    // Redirect to the OTP verification route
    const response = await Axios.post("/api/auth/login", { email });
    console.log("Sent verification Otp Successfully.", response.data);
    router.push(`/auth/login/verifyotp?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex mx-auto flex-col justify-center items-center h-screen relative px-5">
      <div >
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
        {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */}
        <Card className="w-full p-8 flex mx-auto flex-col justify-center items-center ">
          <CardHeader>
            <CardTitle>Login Into Account</CardTitle>
          </CardHeader>
          <form onSubmit={onSignIn}>
            <CardContent>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CardContent>
            <CardContent>
              <Input
                placeholder="Password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CardContent>
            <CardContent>
              <Button
                className="w-full"
                type="submit"
                disabled={buttonDisabled.login}
              >
                {buttonDisabled.login ? "Required Field" : "Login"}
              </Button>
            </CardContent>
          </form>
            <CardContent>
              <Button
                disabled={buttonDisabled.otp}
                className="w-full"
                onClick={onOtpLogin}
              >
                {buttonDisabled.otp ? "Required Field" : "Login With OTP"}
              </Button>
            </CardContent>
          <Separator />
          <CardFooter className="mt-4 flex gap-3">

            <p>Don&apos;t have an account? </p>
            <Link
              className="text-blue-500 hover:text-gray-900 duration-500"
              href="/auth/signup"
            >
              Signup here.
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
