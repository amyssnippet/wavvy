import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import logo from "../../assets/logo.svg";
import one from "../../assets/one.svg";
import two from "../../assets/two.svg";
import three from "../../assets/three.svg";

export function Login() {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleGetOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/request-otp', { phoneNumber });
            alert(response.data.message);
            setStep(2);
        } catch (error) {
            console.error('Error requesting OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const otpCode = otp.join(''); // Join the OTP array to form the full code
            const response = await axios.post('http://localhost:5000/verify-otp', { phoneNumber, otp: otpCode });
            alert(response.data.message);
            console.log('OTP verified successfully');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Invalid OTP. Please try again.');
        }
    };

    const handleOtpChange = (e, index) => {
        let value = e.target.value;

        // Ensure that only numbers are entered and the length is 1 (to prevent extra input)
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;

        setOtp(newOtp);

        // Automatically focus on the next input field
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle the backspace to move focus backward
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <div className="flex w-full h-screen">
            <div className="flex-[60%] bg-white p-12">
                <nav>
                    <img src={logo} className="m-4" alt="Logo" />
                </nav>
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <img src={one} alt="One" />
                    </div>
                    <div>
                        <img src={two} alt="Two" />
                    </div>
                    <div className="flex justify-end">
                        <img src={three} alt="Three" />
                    </div>
                </div>
            </div>

            <div className="flex-[40%] p-8 bg-[#f9f9f9] flex flex-col justify-center items-center">
                {step === 1 && (
                    <>
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Welcome to Wavve</h3>
                            <p className="text-lg text-gray-500 mt-4">Join us to streamline your salon operations effortlessly.</p>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold text-gray-700" htmlFor="phoneNumber">Phone Number</label>
                            <div className="flex bg-white rounded-lg border border-gray-300 p-1 mt-2 w-full">
                                <span className="text-gray-500">+91</span>
                                <Input
                                    className="flex-1 p-2 text-lg border-none outline-none"
                                    id="phoneNumber"
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="text-right text-sm text-gray-500 mt-4">
                                Already have an account? <span className="text-indigo-600 font-semibold cursor-pointer">Login</span>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Button
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    onClick={handleGetOtp}
                                >
                                    Get OTP
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Verify OTP</h3>
                            <p className="text-lg text-gray-500 mt-4">Enter the code from the SMS we sent to your mobile number.</p>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            ))}
                        </div>

                        <div className="text-center mt-4">
                            I didn't receive any code.{' '}
                            <span onClick={() => setStep(1)} className="text-indigo-600 font-semibold cursor-pointer">
                                RESEND
                            </span>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Button
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                onClick={handleVerifyOtp}
                            >
                                Get Started
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
