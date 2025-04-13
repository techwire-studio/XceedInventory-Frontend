import React, { useContext, useState } from "react";
import AuthContext from "../config/AuthContext";
import { RiUser3Line, RiAdminLine, RiAddLine, RiDeleteBin6Line, RiShieldUserLine, RiMailLine, RiPhoneLine } from "react-icons/ri";

const Profile = () => {
  const { user, role } = useContext(AuthContext);
  const [dummyAdmins, setDummyAdmins] = useState([
    { id: 1, name: "John Doe", username: "johndoe", email: "john@xceed.com", createdAt: "2023-12-15" },
    { id: 2, name: "Jane Smith", username: "janesmith", email: "jane@xceed.com", createdAt: "2024-01-25" },
  ]);
  const [newAdmin, setNewAdmin] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Dummy data for demonstration
  const dummyUser = {
    name: user?.name || "Demo User",
    username: user?.username || "demouser",
    email: user?.email || "demo@xceed.com",
    phone: user?.phone || "+1 234 567 8900",
    role: role || "superadmin",
    createdAt: "2023-11-10",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newAdmin.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!newAdmin.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!newAdmin.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!newAdmin.password) {
      newErrors.password = "Password is required";
    } else if (newAdmin.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAdminWithId = {
        id: dummyAdmins.length + 1,
        name: newAdmin.name,
        username: newAdmin.username,
        email: newAdmin.email,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setDummyAdmins([...dummyAdmins, newAdminWithId]);
      setNewAdmin({ name: "", username: "", email: "", password: "", confirmPassword: "" });
      setSubmitting(false);
    }, 1000);
  };

  const handleDeleteAdmin = (adminId) => {
    setDummyAdmins(dummyAdmins.filter(admin => admin.id !== adminId));
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg w-full md:w-[78%] absolute top-20 -right-4 z-20 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <h2 className="text-xl font-semibold mb-6 text-[#2B2B2B] flex-none">Profile</h2>

      {/* Main content with scroll */}
      <div className="flex-grow overflow-y-auto pr-2">
        {/* User Profile Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-500 rounded-full p-3 mr-4">
              <RiUser3Line className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{dummyUser.name}</h3>
              <p className="text-gray-500">@{dummyUser.username}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-medium flex items-center">
                <RiAdminLine className="mr-2 text-blue-500" />
                {dummyUser.role === "superadmin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium flex items-center">
                <RiMailLine className="mr-2 text-blue-500" />
                {dummyUser.email}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium flex items-center">
                <RiPhoneLine className="mr-2 text-blue-500" />
                {dummyUser.phone}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <p className="font-medium">
                {new Date(dummyUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Management Section (Only visible to superadmins) */}
        {dummyUser.role === "Super Admin" && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-[#2B2B2B]">Admin Management</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
              <h4 className="font-medium mb-4">Create New Admin</h4>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newAdmin.name}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                      placeholder="Enter full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                      Username*
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={newAdmin.username}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.username ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                      placeholder="Create a username"
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newAdmin.email}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                      Password*
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newAdmin.password}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                      Confirm Password*
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newAdmin.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <RiAddLine className="mr-2" />
                      Create Admin
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-medium">Admin Users</h4>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {dummyAdmins.length} {dummyAdmins.length === 1 ? "Admin" : "Admins"}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Username</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Created Date</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyAdmins.length > 0 ? (
                      dummyAdmins.map((admin) => (
                        <tr key={admin.id} className="border-t border-gray-200">
                          <td className="p-4">{admin.name}</td>
                          <td className="p-4">{admin.username}</td>
                          <td className="p-4">{admin.email}</td>
                          <td className="p-4">{admin.createdAt}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="text-red-500 hover:text-red-700 flex items-center"
                            >
                              <RiDeleteBin6Line className="mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-500">
                          No admin users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;