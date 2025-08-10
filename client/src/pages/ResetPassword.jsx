import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/send-reset-otp",
        { email }
      );
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

 // Step 2 - Verify OTP
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:4000/api/auth/verify-reset-otp", { email, otp });
    if (res.data.success) {
      toast.success("OTP verified");
      setStep(3);
    } else {
      toast.error(res.data.message || "Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
  setLoading(false);
};


  // Step 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, otp, newPassword }
      );
      if (res.data.success) {
        toast.success("Password reset successfully");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        {step === 1 && (
          <>
            <h2>Reset password</h2>
            <p>Enter your registered email address</p>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Verify OTP</h2>
            <p>Enter the OTP sent to your email</p>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Set New Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
