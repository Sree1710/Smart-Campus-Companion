import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Smartphone } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-white">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Smart Campus Companion</span>
                            <span className="text-xl font-bold text-indigo-600">campusO</span>
                        </a>
                    </div>
                    <div className="flex flex-1 justify-end space-x-4">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </Link>
                        <Link to="/register" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Smart Campus Tracking System
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Everything you need to manage your campus life. Track buses in real-time, mark attendance seamlessly, and manage duty leaves—all in one place.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/register"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register Now
                            </Link>
                            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 flex items-center">
                                Login <ArrowRight className="ml-1 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster, Smarter, Better</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage your campus
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <Smartphone className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Real-time Bus Tracking
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Track college buses live on the map. Know exactly when your bus will arrive and never miss a ride again.
                                </dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Smart Attendance
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Teachers can mark attendance digitally. Students can view their records instantly.
                                </dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Duty Leave Management
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Apply for on-duty leave online, upload proofs, and track approval status without paperwork.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2024 Smart Campus Companion. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
