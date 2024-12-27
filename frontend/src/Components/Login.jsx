import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import "./Login.css";

import logo from "../assets/logo.svg";
import one from "../assets/one.svg";
import two from "../assets/two.svg";
import three from "../assets/three.svg";

const Login = () => {
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
    <div>
      <div className="main">
        <div className='left'>
          <nav>
            <img src={logo} />
          </nav>
          <div className='images'>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <img src={one} />
            </div>
            <div>
              <img src={two} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <img src={three} />
            </div>
          </div>
        </div>
        <div className="right">
          {step === 1 && (
            <>
              <div className="top">
                <h3 style={{ fontSize: '40px' }}>Welcome to Wavve</h3>
                <p style={{ fontSize: '20px', color: 'grey', margin: '20px 0px' }}>
                  Join us to streamline your salon operations effortlessly.
                </p>
              </div>
              <Form>
                <Form.Group controlId="phoneNumber" style={{ marginTop: '60px', marginLeft: '22px' }}>
                  <Form.Label style={{ fontSize: '15px' }}>Phone Number</Form.Label>
                  <InputGroup
                    style={{
                      backgroundColor: 'white',
                      width: '70%',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '1px solid grey',
                    }}
                  >
                    <InputGroup.Text>
                      IN <span style={{ color: 'grey' }}>+91</span>
                    </InputGroup.Text>
                    <Form.Control
                      style={{ border: 'none', outline: 'none' }}
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'grey',
                    margin: '20px 0px',
                    marginLeft: '22px',
                    textAlign: 'end',
                    width: '65%',
                  }}
                >
                  Already have an account?{' '}
                  <span style={{ color: '#7A2DB1', fontWeight: 'bold' }}>Login</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '80%' }}>
                  <Button style={{ margin: '80px 0px' }} className="btn" variant="primary" onClick={handleGetOtp}>
                    Get OTP
                  </Button>
                </div>
              </Form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="top">
                <h3 style={{ fontSize: '40px' }}>Verify Otp</h3>
                <p style={{ fontSize: '20px', color: 'grey', margin: '20px 0px' }}>
                  Enter the code from the SMS we sent to your mobile number.
                </p>
              </div>
              <Form>
                <Form.Group controlId="otp">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        style={{
                          width: '50px',
                          height: '50px',
                          margin: '0 10px',
                          fontSize: '24px',
                          textAlign: 'center',
                          borderRadius: '10px',
                          border: '1px solid #ccc',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  I didn't receive any code.{' '}
                  <span onClick={() => setStep(1)} style={{ color: '#7A2DB1', fontWeight: 'bold' }}>
                    RESEND
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button style={{ margin: '40px auto' }} variant="primary" onClick={handleVerifyOtp}>
                    Get Started
                  </Button>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
