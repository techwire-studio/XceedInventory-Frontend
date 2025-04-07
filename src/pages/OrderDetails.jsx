import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiCloseLine } from "react-icons/ri";

const OrderDetails = ({ setActivePage, order }) => {
    if (!order) {
        return null;
    }
    
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(
        order.shippingAddress || {},
    );
    const [billingAddress, setBillingAddress] = useState(
        order.billingAddress || {},
    );
    const [products, setProducts] = useState(order.products || []);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setActivePage("orders");
    };

    const handleAddressChange = (e, type, field) => {
        const value = e.target.value;
        if (type === "shipping") {
            setShippingAddress({ ...shippingAddress, [field]: value });
        } else {
            setBillingAddress({ ...billingAddress, [field]: value });
        }
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const handleConfirm = async () => {
        setLoading(true);

        const updatedOrder = {
            ...order,
            email: order.email || "admin@xceed.com",
            invoiceNumber: order.invoiceNumber || "9874155",
            message: "Confirmed order",
            totalAmount: order.totalAmount || 480.0,
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            products,
        };

        console.log("Updating Order Data:", updatedOrder);

        try {
            const response = await axios.patch(
                `http://localhost:5000/api/orders/${order.orderId}/details`,
                JSON.stringify(updatedOrder),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            if (response.status === 200) {
                toast.success("Order details updated successfully!");
                setActivePage("orders");
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error updating order:", error.response?.data || error);
            toast.error("Failed to update order details.");
        } finally {
            setLoading(false);
        }
    };

    // Format date for better display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 w-full overflow-y-auto h-full relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">
                    <RiCloseLine size={24} />
                </button>

                <h2 className="text-2xl font-semibold mb-8">Order Details</h2>

                {/* Customer Info Section */}
                <div className="flex justify-between gap-4 mb-8 text-gray-700">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                        <p className="font-medium">First Name:</p>
                        <p>{order.firstName || "N/A"}</p>
                        
                        <p className="font-medium">Last Name:</p>
                        <p>{order.lastName || "N/A"}</p>
                        
                        <p className="font-medium">Email Id:</p>
                        <p>{order.email || "N/A"}</p>
                        
                        <p className="font-medium">Phone Number:</p>
                        <p>{order.phoneNumber || "N/A"}</p>
                        
                        <p className="font-medium">Message:</p>
                        <p>{order.message || "N/A"}</p>
                        
                        <p className="font-medium">Product Enquired:</p>
                        <p>{products.length > 0 ? products[0].name : "N/A"}</p>
                        
                        <p className="font-medium">Enquiry Date:</p>
                        <p>{formatDate(order.createdAt)}</p>
                        
                        <p className="font-medium">Tracking Id:</p>
                        <p>{order.trackingId || "Not assigned yet"}</p>
                        
                        <p className="font-medium">Invoice#:</p>
                        <p>{order.invoiceNumber || "Not generated yet"}</p>
                        
                        <p className="font-medium">Total Amount:</p>
                        <p>${order.totalAmount || "0.00"}</p>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center px-10 py-3" 
                             style={{ 
                                 backgroundColor: 
                                 order.status === "Pending" ? "#F5D876" : 
                                 order.status === "Ready to Dispatch" ? "#F79A4B" : 
                                 order.status === "Completed" ? "#63D384" : 
                                 order.status === "Cancelled" ? "#E24C4C" : 
                                 "#cccccc"
                             }}>
                            <span className="text-black font-medium">{order.status || "Pending"}</span>
                        </div>
                    </div>
                </div>

                {/* Header section with product info */}
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="border border-gray-300 rounded-lg p-4 mb-8">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3">Product Name/Part No</th>
                                <th className="p-3">Product ID</th>
                                <th className="p-3">Quantity</th>
                                <th className="p-3">Amount (optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b font-light">
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3">{item.productId}</td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded p-2"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleProductChange(index, "quantity", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded p-2"
                                            value={item.amount}
                                            onChange={(e) =>
                                                handleProductChange(index, "amount", e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Address Section with updated styling */}
                <h3 className="text-lg font-semibold mb-4">Address</h3>

                {/* Shipping Address with new styling */}
                <h4 className="font-medium mb-4">Shipping Address</h4>
                <div className="flex flex-col gap-4 mb-8">
                    {["line1", "line2", "city", "state", "pinCode", "country"].map(
                        (field) => (
                            <input
                                key={field}
                                type="text"
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
                                value={shippingAddress[field] || ""}
                                onChange={(e) => handleAddressChange(e, "shipping", field)}
                            />
                        ),
                    )}
                </div>

                {/* Billing Address with checkbox */}
                <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-medium">Billing Address</h4>
                    <label className="text-blue-500 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={sameAsShipping}
                            onChange={() => setSameAsShipping(!sameAsShipping)}
                        />
                        Same as shipping address
                    </label>
                </div>

                {!sameAsShipping && (
                    <div className="flex flex-col gap-4 mb-8">
                        {["line1", "line2", "city", "state", "pinCode", "country"].map(
                            (field) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
                                    value={billingAddress[field] || ""}
                                    onChange={(e) => handleAddressChange(e, "billing", field)}
                                />
                            ),
                        )}
                    </div>
                )}

                {/* Confirm Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium text-base">
                        {loading ? "Updating..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;