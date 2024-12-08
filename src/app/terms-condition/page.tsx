import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from 'next/image'
import BrandImg from "@/app/asset/Logo.jpeg"

const TermsAndConditions = () => {
    return (
        <div className=" min-h-screen ">
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
            <div className="max-w-3xl my-8 mx-auto bg-white border shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Terms and Conditions
                </h1>
                <p className="text-gray-600 mb-6">
                    Welcome to EpicHair Salon. By using our services, you agree to comply
                    with these Terms and Conditions. Please read them carefully.
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Services</h2>
                    <p className="text-gray-600">
                        EpicHair Salon provides in-person haircare and grooming services
                        including haircuts, styling, coloring, and treatments. We strive to
                        deliver excellent service tailored to your needs.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Appointments and Payments
                    </h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>
                            All services are provided in person at our salon location. Online
                            bookings or calls are available for appointment scheduling.
                        </li>
                        <li>
                            Payment is due in full at the time of service. We accept cash,
                            cards, and digital payments.
                        </li>
                        <li>
                            Service prices are subject to change and will be confirmed before
                            your appointment.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Cancellations and Rescheduling
                    </h2>
                    <p className="text-gray-600">
                        To reschedule or cancel an appointment, please notify us at least
                        24 hours in advance. Failure to notify may result in a no-show fee.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Liability
                    </h2>
                    <p className="text-gray-600">
                        EpicHair Salon uses professional products and techniques. Clients
                        must inform the stylist of any allergies or conditions before
                        services are provided. We are not responsible for reactions caused
                        by undisclosed conditions.
                    </p>
                </section>

                

                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Changes to Terms and Conditions
                    </h2>
                    <p className="text-gray-600">
                        EpicHair Salon reserves the right to modify these Terms and
                        Conditions at any time. Clients are encouraged to review them
                        periodically.
                    </p>
                </section>

                <p className="text-gray-600 mt-6">
                    By using our services, you confirm that you have read and agreed to
                    these Terms and Conditions. If you have any questions, please contact
                    us directly at our salon.
                </p>
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
        </div>
    );
};

export default TermsAndConditions;
