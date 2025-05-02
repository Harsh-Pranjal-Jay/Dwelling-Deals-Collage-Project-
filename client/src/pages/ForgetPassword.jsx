import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState("request");
  const [timer, setTimer] = useState(180);
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Regular expression for password validation

  // Password validation function
  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return true;
  };

  useEffect(() => {
    let interval;

    if (stage === "verify") {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setMessage("OTP expired, redirecting to login page");
            setTimeout(() => navigate("/login"), 2000);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [stage, navigate]);

  const handleRequestOtp = async (event) => {
    event.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/forgot-password",
          {email });
        console.log(res);
          setMessage("OTP sent to your email. Please check your inbox.");
          setStage("verify");
      }
    catch (error) {
        setMessage(error.response?.data?.message || "User not found");
      }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password using the same conditions as signup
    const validationResult = validatePassword(password);
    if (validationResult !== true) {
      setPasswordError(validationResult);
    } else {
      setPasswordError(""); // Clear error message if password is valid
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!otp || !newPassword) {
      setMessage("Please enter OTP and new password");
      return;
    }

    // Check if there's a password error before proceeding
    if (passwordError) {
      setMessage("Please fix the password error before proceeding.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { email, otp, newPassword }
      );
      setMessage(response.data.message || "Password updated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="font-sans bg-white flex items-center justify-center min-h-screen p-4">
      <div className="max-w-5xl max-md:max-w-lg rounded-md p-6 flex flex-col lg:flex-row items-center animate-slide-in">
        {/* Image Section */}
        <div className="hidden lg:block flex-shrink-0 w-1/2 pr-10 animate-slide-left">
          <img
            src="https://readymadeui.com/signin-image.webp"
            alt="login-image"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Form Section */}
        <form className="w-full lg:w-1/2 max-w-sm mx-auto animate-slide-right">
          <div className="mb-12">
            <h3 className="text-4xl font-extrabold text-brand-blue text-center">
              {stage === "request" ? "Forgot Password" : "Verify OTP"}
            </h3>
          </div>

          {stage === "request" ? (
            <div className="mb-6 ">
              <div className="relative flex items-center mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full font-light text-black text-[1.3rem] bg-white border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                />
              </div>
              <br />

              <button
                onClick={handleRequestOtp}
                className="w-full py-2.5 px-10 text-sm font-semibold rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none transition-transform transform hover:scale-105"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative flex items-center mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full text-[1.35rem] bg-white border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                />
              </div>
              <div className="relative flex items-center mb-6">
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className={`w-full text-[1.35rem] border-b bg-white ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-600 px-2 py-3 outline-none mb-2`}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mb-2">{passwordError}</p>
              )}
              <button
                onClick={handleVerifyOtp}
                className="w-full py-2.5 px-10 text-sm font-semibold rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none transition-transform transform hover:scale-105"
              >
                Verify OTP
              </button>
              <p className="text-center text-sm bg-white text-gray-500 mt-4">
                Time left: {timer} seconds
              </p>
            </div>
          )}

          {message && (
            <p className="text-center text-green-500 font-bold mt-6">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
