import { RiArrowLeftLine } from "@remixicon/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateOrder = ({setActivePage}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
    products: [{ productId: "", quantity: 1 }],
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pinCode: "",
      country: ""
    }
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate form when values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [form, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...form.products];
    updatedProducts[index][field] = value;
    setForm({ ...form, products: updatedProducts });
    setTouched({ ...touched, [`products[${index}].${field}`]: true });
  };

  const handleAddressChange = (field, value) => {
    setForm({
      ...form,
      shippingAddress: { ...form.shippingAddress, [field]: value }
    });
    setTouched({ ...touched, [`shippingAddress.${field}`]: true });
  };

  const addProductRow = () => {
    setForm({
      ...form,
      products: [...form.products, { productId: "", quantity: 1 }]
    });
  };

  const removeProductRow = (index) => {
    if (form.products.length > 1) {
      const updatedProducts = form.products.filter((_, i) => i !== index);
      setForm({ ...form, products: updatedProducts });
    } else {
      toast.error("Order must have at least one product");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation (required, alphabets only)
    if (!form.firstName) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(form.firstName.trim())) {
      newErrors.firstName = "First name must contain only alphabets";
    }
    
    // Last name validation (if provided, alphabets only)
    if (form.lastName && !/^[A-Za-z]+$/.test(form.lastName.trim())) {
      newErrors.lastName = "Last name must contain only alphabets";
    }
    
    // Phone number validation (required, 10 digits with optional country code)
    if (!form.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+\d+ )?\d{10}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits, optionally with country code";
    }
    
    // Email validation (if provided, valid format)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Product validations
    form.products.forEach((product, index) => {
      if (!product.productId || product.productId.trim() === "") {
        newErrors[`products[${index}].productId`] = "Product ID is required";
      }
      
      if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
        newErrors[`products[${index}].quantity`] = "Quantity must be a positive number";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      ...form.products.reduce((acc, _, index) => {
        acc[`products[${index}].productId`] = true;
        acc[`products[${index}].quantity`] = true;
        return acc;
      }, {})
    });
    
    const isValid = validateForm();
    
    if (!isValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        form,
        { withCredentials: true }
      );

      toast.success(response.data.message || "Order created successfully");
      setActivePage("orders");

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
        products: [{ productId: "", quantity: 1 }],
        shippingAddress: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pinCode: "",
          country: ""
        }
      });
      setErrors({});
      setTouched({});
      
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        
        // If backend returns missing products, show a more specific error
        if (error.response.data.missingProducts) {
          toast.error(`Missing product IDs: ${error.response.data.missingProducts.join(', ')}`);
        }
      } else {
        toast.error("Failed to create order. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg overflow-y-auto w-full md:w-[78%] absolute top-20 -right-4 z-20 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
          <RiArrowLeftLine size={24}
            onClick={() => setActivePage("orders")}
            className="cursor-pointer"
           /> Create Order
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Order"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                className={`w-full border ${errors.firstName ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                placeholder="Enter First Name"
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
                className={`w-full border ${errors.lastName ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                placeholder="Enter Last Name"
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                placeholder="Enter Email Address"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                Phone Number*
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={() => handleBlur("phoneNumber")}
                className={`w-full border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                placeholder="Enter Phone Number"
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold">Products*</h3>
              <button 
                onClick={addProductRow}
                className="text-blue-500 text-sm hover:underline"
                type="button"
              >
                + Add Product
              </button>
            </div>
            
            {form.products.map((product, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 mb-3">
                <div className="col-span-3">
                  <label className="block text-gray-600 text-xs font-semibold mb-1">
                    Product ID*
                  </label>
                  <input
                    type="text"
                    value={product.productId}
                    onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                    onBlur={() => handleBlur(`products[${index}].productId`)}
                    className={`w-full border ${errors[`products[${index}].productId`] ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                    placeholder="Enter Product ID"
                  />
                  {errors[`products[${index}].productId`] && touched[`products[${index}].productId`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`products[${index}].productId`]}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-600 text-xs font-semibold mb-1">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || "")}
                    onBlur={() => handleBlur(`products[${index}].quantity`)}
                    className={`w-full border ${errors[`products[${index}].quantity`] ? "border-red-500" : "border-gray-300"} p-2 rounded bg-gray-50`}
                    min="1"
                  />
                  {errors[`products[${index}].quantity`] && touched[`products[${index}].quantity`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`products[${index}].quantity`]}</p>
                  )}
                </div>
                <div className="col-span-1 flex items-end">
                  {form.products.length > 1 && (
                    <button
                      onClick={() => removeProductRow(index)}
                      className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded"
                      type="button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">
              Order Notes
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-gray-50 h-32"
              placeholder="Add any special instructions or notes about this order"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">
              Order ID
            </label>
            <input
              type="text"
              disabled
              className="w-full border border-gray-300 p-2 rounded bg-gray-50 text-gray-400"
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">
              Shipping Address
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Address Line 1"
                value={form.shippingAddress.line1}
                onChange={(e) => handleAddressChange("line1", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded bg-gray-50"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={form.shippingAddress.line2}
                onChange={(e) => handleAddressChange("line2", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded bg-gray-50"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={form.shippingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={form.shippingAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Pin Code"
                  value={form.shippingAddress.pinCode}
                  onChange={(e) => handleAddressChange("pinCode", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={form.shippingAddress.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;