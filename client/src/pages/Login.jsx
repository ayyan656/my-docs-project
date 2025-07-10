// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // ✅ Redirect if already logged in
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("userInfo"));
//     if (user) navigate("/");
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("Please enter both email and password");
//     }

//     try {
//       const res = await axios.post('https://my-docs-project-2025.onrender.com/api/auth/login', {
//         email,
//         password
//       });

//       localStorage.setItem("userInfo", JSON.stringify(res.data));
//       toast.success("Login successful!");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>🔐 Login</h2>
//       <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             cursor: "pointer"
//           }}
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter both email and password");
    }

    try {
      const res = await axios.post('https://my-docs-project-2025.onrender.com/api/auth/login', {
        email,
        password
      });

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">🔐 Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const API = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const user = localStorage.getItem("userInfo");
//     if (user) navigate("/");
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("Please enter both email and password");
//     }

//     try {
//       const res = await axios.post(`${API}/api/auth/login`, { email, password });

//       if (res.data?.token) {
//         localStorage.setItem("userInfo", JSON.stringify(res.data));
//         toast.success("Login successful!");
//         navigate("/");
//       } else {
//         toast.error("Invalid response from server");
//         console.warn("Missing token or user data in response:", res.data);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center">🔐 Login</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

