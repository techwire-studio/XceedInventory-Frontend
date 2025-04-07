import { RiArrowLeftLine } from "@remixicon/react";
import axios from "axios";
import React, { useState } from "react";
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
    products: [{ productId: "", quantity: 1 }]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...form.products];
    updatedProducts[index][field] = value;
    setForm({ ...form, products: updatedProducts });
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
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        form,
        { withCredentials: true }
      );

      toast.success(response.data.message || "Order created successfully");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        products: [{ productId: "", quantity: 1 }]
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create order. Please try again!");
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
                className="w-full border p-2 rounded bg-gray-50"
                placeholder="Enter First Name"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border p-2 rounded bg-gray-50"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">
                Email Address*
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded bg-gray-50"
                placeholder="Enter Email Address"
              />
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
                className="w-full border p-2 rounded bg-gray-50"
                placeholder="Enter Phone Number"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold">Products</h3>
              <button 
                onClick={addProductRow}
                className="text-blue-500 text-sm hover:underline"
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
                    className="w-full border p-2 rounded bg-gray-50"
                    placeholder="Enter Product ID"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-600 text-xs font-semibold mb-1">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 1)}
                    className="w-full border p-2 rounded bg-gray-50"
                    min="1"
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  {form.products.length > 1 && (
                    <button
                      onClick={() => removeProductRow(index)}
                      className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded"
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
              className="w-full border p-2 rounded bg-gray-50 h-32"
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
              className="w-full border p-2 rounded bg-gray-50 text-gray-400"
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">
              Shipping Address
            </label>
            <textarea
              className="w-full border p-2 rounded bg-gray-50 h-24"
              placeholder="Enter shipping address"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;