"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    console.log(email)

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (otp.length === 6) { // Assuming OTP is 6 digits
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [otp]);

    const onVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission

        setLoading(true);
        setErrorMessage(""); // Clear any previous error messages

        try {
            // Send OTP verification request to the server
            const response = await axios.post("/api/auth/login/verifyOtp", { email, otp });
            console.log("OTP verification successful", response); // Replace with actual response handling
            // Redirect or handle success as needed
            router.push("/dashboard"); // Redirect to a success page after verification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("OTP verification failed:", error);
            setErrorMessage(
                error.response?.data?.message || "An error occurred during OTP verification." // Display error message
            );
        } finally {
            setLoading(false); // Ensure loading state is reset
        }
    };

    return (
        <Suspense fallback={<HashLoader />}>
        <div className="flex mx-auto flex-col justify-center items-center h-screen relative px-5">
            <div>
                <h1>
                    {loading ? (
                            <p className="flex mx-auto h-screen w-screen absolute top-0 left-0 bg-white justify-center items-center text-6xl z-50">
                                <HashLoader
                                    color="#000"
                                    loading={loading}
                                    size={80}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </p>
                    ) : (
                        ""
                    )}
                </h1>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <Card className="w-full p-8 flex mx-auto flex-col justify-center items-center ">
                    <CardHeader>
                        <CardTitle>Verify OTP</CardTitle>
                    </CardHeader>
                    <form onSubmit={onVerifyOtp}>
                        <CardContent>
                            {/* Disabled email input */}
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email || ""} // Ensure value is never null
                                disabled // Make the input disabled
                            />
                        </CardContent>
                        <CardContent>
                            <Input
                                placeholder="Enter OTP"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6} // Assuming OTP is 6 digits
                            />
                        </CardContent>
                        <CardContent>
                            <Button
                                className="w-full"
                                type="submit"
                                disabled={buttonDisabled}
                            >
                                {buttonDisabled ? "Enter OTP" : "Verify OTP"}
                            </Button>
                        </CardContent>
                    </form>
                    {/* Uncomment if you want to include the resend OTP option */}
                    {/* <Separator />
                    <CardFooter className="mt-4 flex gap-3">
                        <p>Didn't receive the OTP? </p>
                        <Link
                            className="text-blue-500 hover:text-gray-900 duration-500"
                            href="/auth/resend-otp" // Add link to resend OTP
                        >
                            Resend OTP.
                        </Link>
                    </CardFooter> */}
                </Card>
            </div>
        </div>
        </Suspense>
    );
}
