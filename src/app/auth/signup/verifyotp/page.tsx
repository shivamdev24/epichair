// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import HashLoader from "react-spinners/HashLoader";

// export default function VerifyOtpPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams(); // Hook to get search params
//     const email = searchParams.get("email"); 
//         console.log(email);
//     const [otp, setOtp] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [buttonDisabled, setButtonDisabled] = useState(true);

//     useEffect(() => {
//         if (otp.length === 6) { // Assuming OTP is 6 digits
//             setButtonDisabled(false);
//         } else {
//             setButtonDisabled(true);
//         }
//     }, [otp]);

//     const onVerifyOtp = async (e: React.FormEvent) => {
//         e.preventDefault(); // Prevent the default form submission

//         setLoading(true);
//         setErrorMessage(""); // Clear any previous error messages

//         try {
//             // Send OTP verification request to the server using fetch
//             const response = await fetch("/api/auth/verify-otp", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email, otp }), // Send email and OTP
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 console.log("OTP verification successful", data);
//                 router.push("/dashboard"); // Redirect to the dashboard on success
//             } else {
//                 throw new Error(data.message || "OTP verification failed.");
//             }
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             console.error("OTP verification failed:", error);
//             setErrorMessage(error.message  || "An error occurred during OTP verification.");
//         } finally {
//             setLoading(false); // Ensure loading state is reset
//         }
//     };

//     return (
//         <div className="flex mx-auto flex-col justify-center items-center h-screen relative px-5">
//             <div>
//                 <h1>
//                     {loading ? (
//                         <p className="flex mx-auto h-screen justify-center items-center text-6xl">
//                             <HashLoader
//                                 color="#000"
//                                 loading={loading}
//                                 size={80}
//                                 aria-label="Loading Spinner"
//                                 data-testid="loader"
//                             />
//                         </p>
//                     ) : (
//                         ""
//                     )}
//                 </h1>
//                 {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//                 <Card className="w-full p-8 flex mx-auto flex-col justify-center items-center ">
//                     <CardHeader>
//                         <CardTitle>Verify OTP</CardTitle>
//                     </CardHeader>
//                     <form onSubmit={onVerifyOtp}>
//                         <CardContent>
//                             {/* Disabled email input */}
//                             <Input
//                                 placeholder="Email"
//                                 type="email"
//                                 value={email || ""} // Ensure value is never null
//                                 disabled // Make the input disabled
//                             />
//                         </CardContent>
//                         <CardContent>
//                             <Input
//                                 placeholder="Enter OTP"
//                                 type="text"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value)}
//                                 maxLength={6} // Assuming OTP is 6 digits
//                             />
//                         </CardContent>
//                         <CardContent>
//                             <Button
//                                 className="w-full"
//                                 type="submit"
//                                 disabled={buttonDisabled}
//                             >
//                                 {buttonDisabled ? "Enter OTP" : "Verify OTP"}
//                             </Button>
//                         </CardContent>
//                     </form>
//                 </Card>
//             </div>
//         </div>
//     );
// }




"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HashLoader from "react-spinners/HashLoader";

function VerifyOtpComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (otp.length === 6) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [otp]);

    const onVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`/api/auth/signup/admin/verifyOtp?email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/dashboard");
            } else {
                throw new Error(data.message || "OTP verification failed.");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error)
            setErrorMessage(error.message || "An error occurred during OTP verification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex mx-auto flex-col justify-center items-center h-screen relative px-5">
            {loading ? (
                <p className="flex mx-auto h-screen w-screen absolute top-0 left-0 bg-white justify-center items-center z-50 text-6xl">
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
            {!loading && (
                <Card className="w-full p-8 flex mx-auto flex-col justify-center items-center ">
                    <CardHeader>
                        <CardTitle>Verify OTP</CardTitle>
                    </CardHeader>
                    <form onSubmit={onVerifyOtp}>
                        <CardContent>
                            <Input placeholder="Email" type="email" value={email || ""} disabled />
                        </CardContent>
                        <CardContent>
                            <Input placeholder="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                        </CardContent>
                        <CardContent>
                            <Button className="w-full" type="submit" disabled={buttonDisabled}>
                                {buttonDisabled ? "Enter OTP" : "Verify OTP"}
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            )}
        </div>
    );
}

// Wrap the component in Suspense for client-side rendering
export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div><p className="flex mx-auto h-screen w-screen absolute top-0 left-0 bg-white justify-center items-center z-50 text-6xl">
            <HashLoader
                color="#000"
                
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </p></div>}>
            <VerifyOtpComponent />
        </Suspense>
    );
}
