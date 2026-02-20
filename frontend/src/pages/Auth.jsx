import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shield, User, Mail, Lock, Eye, EyeOff, Phone, Key } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from '../api/api';
import ResponsiveImage from "../components/ResponsiveImage";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupSecretKey, setSignupSecretKey] = useState('');

  const showcaseImages = [
    {
      url: "/images/room-img2.webp",
      title: "",
      description: ""
    },
    {
      url: "/images/room-img3.webp",
      title: "",
      description: ""
    },
    {
      url: "/images/room-img1.webp",
      title: "",
      description: ""
    }
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? showcaseImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === showcaseImages.length - 1 ? 0 : prev + 1));
  };

  const handleLogin = async () => {
    try {
      if (!loginEmail || !loginPassword) {
        alert("Please fill in all fields");
        return;
      }

      const { data } = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });


      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/receptionist/dashboard");
      }



    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };
  const handleSignup = async () => {
    try {
      if (
        !signupName ||
        !signupEmail ||
        !signupPhone ||
        !signupPassword ||
        !signupConfirmPassword ||
        !signupSecretKey
      ) {
        alert("Please fill in all fields");
        return;
      }

      const { data } = await api.post("/auth/register", {
        name: signupName,
        email: signupEmail,
        phoneNumber: signupPhone,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        secretKey: signupSecretKey,
      });

      alert(data.message);

      // Switch to login after success
      setIsLogin(true);
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration failed"
      );
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/20 to-gray-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">


          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 lg:p-12 hidden lg:flex flex-col justify-between overflow-hidden">

            <div className="absolute inset-0">
              <ResponsiveImage
                src={showcaseImages[currentImageIndex].url}
                alt="Hotel Management"
                className="w-full h-full object-cover opacity-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-serif">Staff Portal</h2>
                  <p className="text-amber-400 text-sm tracking-wider">HOTEL SHIV GANGA</p>
                </div>
              </div>
            </div>


            <div className="relative z-10">
              <div className="mb-8">
                <h3 className="text-white text-3xl font-serif mb-2">
                  {showcaseImages[currentImageIndex].title}
                </h3>
                <p className="text-gray-300">
                  {showcaseImages[currentImageIndex].description}
                </p>
              </div>


              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevImage}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowRight size={18} />
                </button>
                <div className="flex-1"></div>
                <span className="text-white/60 text-sm">
                  {currentImageIndex + 1} / {showcaseImages.length}
                </span>
              </div>
            </div>
          </div>


          <div className="p-8 lg:p-12 flex flex-col justify-center">

            <div className="mb-8">
              <h1 className="text-2xl font-serif text-gray-800 mb-8">HOTEL SHIV GANGA</h1>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Login to access your dashboard' : 'Sign up to get started'}
              </p>
            </div>


            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${isLogin
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${!isLogin
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign Up
              </button>
            </div>


            {isLogin ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        if (!loginEmail) {
                          alert("Enter your email first");
                          return;
                        }

                        const { data } = await api.post("/auth/forgot-password", {
                          email: loginEmail,
                        });

                        alert(data.message);
                      } catch (err) {
                        alert(err.response?.data?.message || "Error");
                      }
                    }}
                    className="text-sm text-amber-600 hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login
                </button>
              </div>
            ) : (

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Admin Secret Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={signupSecretKey}
                      onChange={(e) => setSignupSecretKey(e.target.value)}
                      placeholder="Enter admin secret key"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Create Account
                </button>
              </div>
            )}


            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {isLogin ? 'Staff members only. Contact admin for support.' : 'Admin approval required for new accounts.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
