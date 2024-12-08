import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from 'next/image'
import BrandImg from "@/app/asset/Logo.jpeg"

const PrivacyPolicy = () => {
    return (
       <>
            <div className=" h-20 flex items-center justify-center w-full  to-transparent shadow z-50">
                <div className=" w-full  ">
                    <div className="max-w-7xl mx-auto flex items-center justify-center lg:justify-between px-5 text-black py-3">
                        <div className="relative">
                            <Link href="/" className="flex items-center " >
                                <Image src={BrandImg} width={1000} height={1000} alt="Brand Logo" className="w-12 rounded-xl border-2 bg-orange-700 p-1" />
                                {/* <span className="text-black text-xl font-bold">Epic Hair</span> */}
                            </Link>
                        </div>
                        <div className="hidden lg:block">
                            <ul className="flex gap-4 items-center">

                                <li>
                                    <a href="#" className=" ">Home</a>
                                </li>
                                <li>
                                    <a href="#feature" className=" ">Feature</a>
                                </li>

                                <li>
                                    <a href="#faq" >FAQ</a>
                                </li>

                                <li>
                                    <Link href="/" >
                                        <Button className="bg-orange-700 hover:bg-orange-600 ">Download Now</Button></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 mb-6">
                        At EpicHair Salon, we value your privacy and are committed to
                        protecting your personal information. This policy outlines how we
                        collect, use, and safeguard your information.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Information We Collect
                        </h2>
                        <p className="text-gray-600">
                            We may collect personal information when you interact with us,
                            including:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Your name, phone number, and email address for booking appointments.</li>
                            <li>Payment details for processing transactions.</li>
                            <li>Feedback or reviews provided about our services.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            How We Use Your Information
                        </h2>
                        <p className="text-gray-600">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Schedule and manage your appointments efficiently.</li>
                            <li>Process payments and provide receipts.</li>
                            <li>Improve our services based on your feedback.</li>
                            <li>Send updates, promotions, or special offers (only if you opt-in).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Sharing Your Information
                        </h2>
                        <p className="text-gray-600">
                            We respect your privacy and do not sell or share your personal
                            information with third parties, except as necessary to:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Process payments via trusted payment providers.</li>
                            <li>Comply with legal requirements or enforce our terms of service.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Data Security
                        </h2>
                        <p className="text-gray-600">
                            We take the security of your information seriously and implement
                            appropriate measures to protect it. However, no method of data
                            transmission or storage is completely secure, so we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Your Rights
                        </h2>
                        <p className="text-gray-600">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Access and review your personal information.</li>
                            <li>Request corrections to any inaccuracies.</li>
                            <li>Request deletion of your personal information, subject to legal obligations.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Updates to This Policy
                        </h2>
                        <p className="text-gray-600">
                            We may update this Privacy Policy from time to time. Please review
                            this page periodically to stay informed of any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Contact Us</h2>
                        <p className="text-gray-600">
                            If you have any questions about this Privacy Policy or how your
                            information is handled, please contact us at [insert contact details].
                        </p>
                    </section>
                </div>
            </div>
            <section className='h-24  flex text-center  items-center bg-orange-700'>
                <div className=' max-w-7xl mx-auto'>
                    <div className="w-full flex flex-col text-white justify-between items-center gap-2">
                        <p className='text-base'>copyright © 2024 EpicHair All Rights Reserved. Developed By <a className='underline' href="https://www.noblessetech.com/">Noblessetech</a> </p>

                        <div className='flex gap-3'>
                            <Link className='underline' href="/privacy-policy">Privacy Policy</Link>
                            <Link className='underline' href="/terms-condition">Terms & Condition</Link>

                        </div>


                    </div>
                </div>

            </section>
       </>
    );
};

export default PrivacyPolicy;
