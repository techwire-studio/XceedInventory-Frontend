import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import StatusDropDown from "../components/StatusDropDown";

const OrderEnquires = ({ setActivePage, setSelectedOrder }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    OrderEnquiryData();
  }, []);

  const OrderEnquiryData = async () => {
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId ? { ...item, status: newStatus } : item
      )
    );
  };

  if (loading) {
	return <Loader containerClass="w-[78%] absolute top-20 -right-6 bg-white rounded-xl shadow-lg h-screen" />;
  }

  const filteredOrders = items.filter((order) => {
    const matchesSearch = `${order.firstName} ${order.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "Unfulfilled") {
      return (
        matchesSearch &&
        (order.status === "Pending" || order.status === "Cancelled")
      );
    } else if (activeTab === "Ready to Dispatch") {
      return matchesSearch && order.status === "Ready to Dispatch";
    }
    return matchesSearch;
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[78%] absolute top-20 -right-6 z-20 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2B2B2B]">Orders</h2>
        <button
          className="bg-blue-500 text-white px-3 py-1.5 mr-4 text-sm"
          onClick={() => {
            setActivePage("order-details");
          }}>
          + New
        </button>
      </div>

      <div className="flex space-x-6 border-b border-[#B2B2B2]">
        {["All", "Unfulfilled", "Ready to Dispatch"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-sm ${
              activeTab === tab
                ? "border-b-2 border-[#1428A1] text-[#484848] font-semibold"
                : "text-[#484848]"
            }`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border border-[#B2B2B2] p-2 rounded w-full text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

	  <div className="mt-4 overflow-y-auto h-[calc(100vh-200px)]">
	  <table className="w-full border-b border-[#B2B2B2] text-[#484848] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-10 text-left">
                <input type="checkbox" className="h-4 w-4" />
              </th>
              <th className="p-3 text-center font-medium">Order ID</th>
              <th className="p-3 text-center font-medium">Customer</th>
              <th className="p-3 text-center font-medium">Phone</th>
              <th className="p-3 text-center font-medium">Product Name/Part No</th>
              <th className="p-3 text-center font-medium">Quantity</th>
              <th className="p-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 w-10">
                  <input type="checkbox" className="h-4 w-4" />
                </td>
                <td
                  className="p-3 text-center"
                  onClick={() => {
                    setSelectedOrder(order);
                    setActivePage("order-details");
                  }}>
                  {order.orderId}
                </td>
                <td className="p-3 text-center">
                  {order.firstName} {order.lastName}
                </td>
                <td className="p-3 text-center">{order.phoneNumber}</td>
                <td className="p-3 text-center">
                  {order.products?.length > 0
                    ? order.products[0].productName || order.products[0].name
                    : "N/A"}
                </td>
                <td className="p-3 text-center">
                  {order.products?.length > 0
                    ? order.products[0].quantity
                    : "N/A"}
                </td>
                <td className="p-3 w-40">
                  <StatusDropDown
                    orderId={order.orderId}
                    initialStatus={order.status || "Pending"}
                    onStatusUpdate={handleStatusUpdate}
					disableDropdown={false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderEnquires;