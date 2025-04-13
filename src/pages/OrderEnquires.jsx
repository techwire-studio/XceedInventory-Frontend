import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import StatusDropDown from "../components/StatusDropDown";

// Sample data for testing UI
// const sampleOrders = [
//   {
//     orderId: "ORD-1001",
//     firstName: "John",
//     lastName: "Smith",
//     phoneNumber: "+91 9876543210",
//     status: "Pending",
//     products: [{ name: "SPN3094", quantity: 2 }]
//   },
//   {
//     orderId: "ORD-1002",
//     firstName: "Emma",
//     lastName: "Johnson",
//     phoneNumber: "+91 8765432109",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN4567", quantity: 1 }]
//   },
//   {
//     orderId: "ORD-1003",
//     firstName: "Michael",
//     lastName: "Williams",
//     phoneNumber: "+91 7654321098",
//     status: "Cancelled",
//     products: [{ name: "SPN7890", quantity: 3 }]
//   },
//   {
//     orderId: "ORD-1004",
//     firstName: "Sarah",
//     lastName: "Brown",
//     phoneNumber: "+91 6543210987",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN2345", quantity: 5 }]
//   },
//   {
//     orderId: "ORD-1005",
//     firstName: "David",
//     lastName: "Jones",
//     phoneNumber: "+91 5432109876",
//     status: "Pending",
//     products: [{ name: "SPN6789", quantity: 4 }]
//   },
//   {
//     orderId: "ORD-1006",
//     firstName: "Jennifer",
//     lastName: "Garcia",
//     phoneNumber: "+91 4321098765",
//     status: "Cancelled",
//     products: [{ name: "SPN1234", quantity: 2 }]
//   },
//   {
//     orderId: "ORD-1007",
//     firstName: "Robert",
//     lastName: "Miller",
//     phoneNumber: "+91 3210987654",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN5678", quantity: 1 }]
//   },
//   {
//     orderId: "ORD-1008",
//     firstName: "Lisa",
//     lastName: "Davis",
//     phoneNumber: "+91 2109876543",
//     status: "Pending",
//     products: [{ name: "SPN9012", quantity: 6 }]
//   },
//   {
//     orderId: "ORD-1009",
//     firstName: "Thomas",
//     lastName: "Rodriguez",
//     phoneNumber: "+91 1098765432",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN3456", quantity: 3 }]
//   },
//   {
//     orderId: "ORD-1010",
//     firstName: "Patricia",
//     lastName: "Wilson",
//     phoneNumber: "+91 0987654321",
//     status: "Cancelled",
//     products: [{ name: "SPN7890", quantity: 2 }]
//   },
//   {
//     orderId: "ORD-1011",
//     firstName: "Amit",
//     lastName: "Sharma",
//     phoneNumber: "+91 9876543210",
//     status: "Pending",
//     products: [{ name: "SPN1234", quantity: 3 }]
// },
// {
//     orderId: "ORD-1012",
//     firstName: "Priya",
//     lastName: "Kumar",
//     phoneNumber: "+91 8765432109",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN5678", quantity: 1 }]
// },
// {
//     orderId: "ORD-1013",
//     firstName: "Rahul",
//     lastName: "Verma",
//     phoneNumber: "+91 7654321098",
//     status: "Cancelled",
//     products: [{ name: "SPN9012", quantity: 4 }]
// },
// {
//     orderId: "ORD-1014",
//     firstName: "Sneha",
//     lastName: "Patel",
//     phoneNumber: "+91 6543210987",
//     status: "Ready to Dispatch",
//     products: [{ name: "SPN3456", quantity: 2 }]
// },
// {
//     orderId: "ORD-1015",
//     firstName: "Vikram",
//     lastName: "Singh",
//     phoneNumber: "+91 5432109876",
//     status: "Pending",
//     products: [{ name: "SPN7890", quantity: 5 }]
// }
// ];

const OrderEnquires = ({ setActivePage, setSelectedOrder }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Fixed at 7 objects per page

  useEffect(() => {
    // Simulating API call and using sample data
    const loadData = async () => {
      setLoading(true);
      try {
        // Comment this section to use hardcoded data instead of API
        const response = await axios.get("http://localhost:5000/api/orders", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
        });
        console.log("API Response:", response.data);
        setItems(response.data);

      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Debouncing search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loader containerClass="w-[78%] absolute top-20 -right-6 bg-white rounded-xl shadow-lg h-screen" />;
  }

  const filteredOrders = items.filter((order) => {
    // Search by name or phone number
    const matchesSearch = (
      `${order.firstName} ${order.lastName}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (order.phoneNumber && order.phoneNumber.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
      (order.orderId && order.orderId.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );

    if (activeTab === "Unfulfilled") {
      return (
        matchesSearch &&
        (order.status === "Pending" || order.status === "Cancelled")
      );
    } else if (activeTab === "Ready to dispatch") {
      return matchesSearch && order.status === "Ready to dispatch";
    }
    return matchesSearch;
  });

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentOrders = filteredOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-[75%] absolute top-20 -right-0 z-20 h-[calc(100vh-80px)] flex flex-col mr-4 overflow-hidden">
      {/* Fixed Header Section - Made more compact for low height screens */}
      <div className="flex-none">
        {/* Header with reduced margins */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-[#2B2B2B]">Orders</h2>
          <button
            className="bg-blue-500 text-white px-3 py-1 mr-4 text-sm"
            onClick={() => {
              setActivePage("create-order");
            }}>
            + New
          </button>
        </div>
    
        {/* Tabs with reduced padding */}
        <div className="flex space-x-6 border-b border-[#B2B2B2]">
          {["All", "Unfulfilled", "Ready to dispatch"].map((tab) => (
            <button
              key={tab}
              className={`pb-1 text-sm ${
                activeTab === tab
                  ? "border-b-2 border-[#1428A1] text-[#484848] font-semibold"
                  : "text-[#484848]"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(0); // Reset to first page when tab changes
              }}>
              {tab}
            </button>
          ))}
        </div>
    
        {/* Search with reduced margin */}
        <div className="mt-2 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name, phone number or order ID"
            className="border border-[#B2B2B2] p-1.5 rounded w-full text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Page reset is handled by the debounced effect
            }}
          />
        </div>
      </div>
  
    {/* Table Headers - Fixed with reduced padding */}
    <div className="mt-2 flex-none">
      <table className="w-full text-[#484848] text-sm table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 w-10 text-left">
              <input type="checkbox" className="h-3 w-3" />
            </th>
            <th className="p-2 text-left font-medium w-[15%]">Order ID</th>
            <th className="p-2 text-left font-medium w-[15%]">Customer</th>
            <th className="p-2 text-left font-medium w-[15%]">Phone</th>
            <th className="p-2 text-left font-medium w-[23%]">Product Name/Part No</th>
            <th className="p-2 text-left font-medium w-[12%]">Quantity</th>
            <th className="p-2 text-left font-medium w-[20%]">Status</th>
          </tr>
        </thead>
      </table>
    </div>

    {/* Table Body - Scrollable with optimized height */}
    <div className="flex-grow overflow-y-auto min-h-0">
      <table className="w-full border-b border-[#B2B2B2] text-[#484848] text-sm table-fixed">
        <tbody>
          {currentOrders.map((order) => (
            <tr
              key={order.orderId}>
              <td className="p-2 w-10">
                <input type="checkbox" className="h-3 w-3" />
              </td>
              <td className="p-2 text-left cursor-pointer hover:text-blue-600 w-[15%]"
                  onClick={() => {
                    setSelectedOrder(order);
                    setActivePage("order-details");
                  }}>
                {order.orderId}
              </td>
              <td className="p-2 text-left w-[15%]">
                {order.firstName} {order.lastName}
              </td>
              <td className="p-2 text-left w-[15%]">{order.phoneNumber}</td>
              <td className="p-2 text-left w-[25%]">
                <div className="max-h-16 overflow-y-auto">
                  {order.products?.length > 0 ? (
                    order.products.map((product, idx) => (
                      <div key={idx} className="truncate text-xs mb-1">
                        <span className="font-medium">
                          {product.productName || product.name}
                        </span>
                        <span className="text-gray-500 ml-1">
                          ({product.productId})
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </td>
              <td className="p-2 text-left w-[10%]">
                {order.products?.length > 0 ? (
                  <div className="max-h-16 overflow-y-auto">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="text-xs mb-1">
                        {product.quantity}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="p-2 w-[20%]">
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
    
      {/* Pagination - Fixed at bottom with reduced padding */}
      {filteredOrders.length > 0 && (
        <div className="py-2 border-t border-gray-200 flex-none">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Showing {Math.min(offset + 1, filteredOrders.length)} - {Math.min(offset + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className={`flex justify-center items-center w-6 h-6 border border-gray-300 rounded-md ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                &lt;
              </button>
              
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex justify-center items-center w-6 h-6 border rounded-md text-xs ${
                    currentPage === page
                      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(pageCount - 1, currentPage + 1))}
                disabled={currentPage === pageCount - 1}
                className={`flex justify-center items-center w-6 h-6 border border-gray-300 rounded-md ${
                  currentPage === pageCount - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderEnquires;