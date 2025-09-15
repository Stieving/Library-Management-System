// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import Message from "./Message";
// import Loading from "./Loading";

// function Login({ handlers, loading, message }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return;
//     }
//     if (!/\d/.test(password)) {
//       toast.error("Password must contain at least one number");
//       return;
//     }
//     if (!/[A-Z]/.test(password)) {
//       toast.error("Password must contain at least one uppercase letter");
//       return;
//     }
//     if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
//       toast.error("Password must contain at least one special character");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Call handler
//     await handlers.handleLogin(email, password);
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
//           Login
//         </h2>

//         {message && <Message message={message} />}
//         <Loading loading={loading} />

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//                          focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//                            focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
//                 required
//               />
//               <FontAwesomeIcon
//                 icon={showPassword ? faEye : faEyeSlash}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 
//                            cursor-pointer text-gray-500"
//                 onClick={togglePasswordVisibility}
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg 
//                        font-bold hover:bg-indigo-700 transition-colors 
//                        disabled:bg-indigo-300"
//             disabled={loading}
//           >
//             Log In
//           </button>
//         </form>

//         {/* Forgot Password */}
//         <div className="mt-4 text-center">
//           <Link
//             to="/forgot-password"
//             className="text-sm text-indigo-600 hover:underline"
//           >
//             Forgot Password?
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
