import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import StatusDropDown from "../components/StatusDropDown";

// Sample fulfillment data
const sampleOrders = [
  {
    orderId: "#9348",
    date: "18/12/2024 - 1:45 PM",
    firstName: "Ritesh",
    lastName: "Yadav",
    phoneNumber: "+91 9874563210",
    products: [{ name: "SPN3094", quantity: 2 }],
    status: "Completed"
  },
  {
    orderId: "#8745",
    date: "18/12/2024 - 5:45 PM",
    firstName: "John",
    lastName: "Smith",
    phoneNumber: "+91 8523697410",
    products: [{ name: "SPN8838", quantity: 1 }],
    status: "Completed"
  },
  {
    orderId: "#8957",
    date: "18/12/2024 - 9:58 PM",
    firstName: "David",
    lastName: "Williams",
    phoneNumber: "+91 7412589630",
    products: [{ name: "SPN125N04A", quantity: 3 }],
    status: "Completed"
  },
  {
    orderId: "#4238",
    date: "18/12/2024 - 2:38 AM",
    firstName: "Sarah",
    lastName: "Mitchel",
    phoneNumber: "+91 8523697410",
    products: [{ name: "SPN166T04A", quantity: 4 }],
    status: "Completed"
  },
  {
    orderId: "#5789",
    date: "19/12/2024 - 10:15 AM",
    firstName: "Michael",
    lastName: "Johnson",
    phoneNumber: "+91 9632587410",
    products: [{ name: "SPN445T07B", quantity: 1 }],
    status: "Completed"
  },
  {
    orderId: "#6234",
    date: "19/12/2024 - 2:30 PM",
    firstName: "Emily",
    lastName: "Brown",
    phoneNumber: "+91 7896541230",
    products: [{ name: "SPN789P04C", quantity: 2 }],
    status: "Completed"
  },
  {
    orderId: "#7812",
    date: "20/12/2024 - 9:45 AM",
    firstName: "Robert",
    lastName: "Davis",
    phoneNumber: "+91 8745962130",
    products: [{ name: "SPN321Q08R", quantity: 5 }],
    status: "Completed"
  },
  {
    orderId: "#8367",
    date: "20/12/2024 - 4:20 PM",
    firstName: "Jennifer",
    lastName: "Wilson",
    phoneNumber: "+91 9513578520",
    products: [{ name: "SPN654S02T", quantity: 3 }],
    status: "Completed"
  },
  {
    orderId: "#9145",
    date: "21/12/2024 - 11:05 AM",
    firstName: "Thomas",
    lastName: "Anderson",
    phoneNumber: "+91 8529637410",
    products: [{ name: "SPN987U05V", quantity: 2 }],
    status: "Completed"
  },
  {
    orderId: "#1023",
    date: "21/12/2024 - 3:50 PM",
    firstName: "Jessica",
    lastName: "Taylor",
    phoneNumber: "+91 7539518520",
    products: [{ name: "SPN456W01X", quantity: 1 }],
    status: "Completed"
  },
  {
    orderId: "#1024",
    date: "21/12/2024 - 4:15 PM",
    firstName: "Amit",
    lastName: "Sharma",
    phoneNumber: "+91 9876543210",
    products: [{ name: "SPN123A01B", quantity: 2 }],
    status: "Completed"
},
{
    orderId: "#1025",
    date: "21/12/2024 - 5:30 PM",
    firstName: "Priya",
    lastName: "Kumar",
    phoneNumber: "+91 8765432109",
    products: [{ name: "SPN456C02D", quantity: 1 }],
    status: "Completed"
},
{
    orderId: "#1026",
    date: "21/12/2024 - 6:45 PM",
    firstName: "Rahul",
    lastName: "Verma",
    phoneNumber: "+91 7654321098",
    products: [{ name: "SPN789E03F", quantity: 3 }],
    status: "Completed"
},
{
    orderId: "#1027",
    date: "21/12/2024 - 7:00 PM",
    firstName: "Sneha",
    lastName: "Patel",
    phoneNumber: "+91 6543210987",
    products: [{ name: "SPN234G04H", quantity: 5 }],
    status: "Completed"
},
{
    orderId: "#1028",
    date: "21/12/2024 - 7:30 PM",
    firstName: "Vikram",
    lastName: "Singh",
    phoneNumber: "+91 5432109876",
    products: [{ name: "SPN678I05J", quantity: 4 }],
    status: "Completed"
},
{
    orderId: "#1029",
    date: "21/12/2024 - 8:00 PM",
    firstName: "Anjali",
    lastName: "Rao",
    phoneNumber: "+91 4321098765",
    products: [{ name: "SPN123K06L", quantity: 2 }],
    status: "Completed"
},
{
    orderId: "#1030",
    date: "21/12/2024 - 8:30 PM",
    firstName: "Rohan",
    lastName: "Mehta",
    phoneNumber: "+91 3210987654",
    products: [{ name: "SPN567M07N", quantity: 1 }],
    status: "Completed"
},
{
    orderId: "#1031",
    date: "21/12/2024 - 9:00 PM",
    firstName: "Pooja",
    lastName: "Desai",
    phoneNumber: "+91 2109876543",
    products: [{ name: "SPN901O08P", quantity: 6 }],
    status: "Completed"
},
{
    orderId: "#1032",
    date: "21/12/2024 - 9:30 PM",
    firstName: "Karan",
    lastName: "Kapoor",
    phoneNumber: "+91 1098765432",
    products: [{ name: "SPN345Q09R", quantity: 3 }],
    status: "Completed"
},
{
    orderId: "#1033",
    date: "21/12/2024 - 10:00 PM",
    firstName: "Meera",
    lastName: "Nair",
    phoneNumber: "+91 0987654321",
    products: [{ name: "SPN789S10T", quantity: 2 }],
    status: "Completed"
}
];

const FullFillment = ({ setActivePage, setSelectedOrder }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Fixed at 6 objects per page
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState({});

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setItems(sampleOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    
    const newSelectedOrders = {...selectedOrders};
    currentOrders.forEach(order => {
      newSelectedOrders[order.orderId] = isChecked;
    });
    
    setSelectedOrders(newSelectedOrders);
  };
  
  // Handle individual checkbox selection
  const handleSelectOrder = (orderId, isChecked) => {
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: isChecked
    }));
    
    // Update selectAll state
    const allSelected = currentOrders.every(order => 
      order.orderId === orderId ? isChecked : selectedOrders[order.orderId]
    );
    setSelectAll(allSelected);
  };

  if (loading) {
    return <Loader containerClass="w-[75%] absolute top-20 -right-0 bg-white rounded-xl shadow-lg h-[calc(100vh-80px)] mr-4" />;
  }

  const filteredOrders = items.filter((order) => {
    const matchesSearch = (
      `${order.firstName} ${order.lastName}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (order.phoneNumber && order.phoneNumber.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );

    if (activeTab === "Recent") {
      // Filter for orders in the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return matchesSearch && order.date.includes("21/12/2024");
    } else if (activeTab === "This Week") {
      // Filter for this week's orders
      return matchesSearch && (
        order.date.includes("18/12/2024") || 
        order.date.includes("19/12/2024") || 
        order.date.includes("20/12/2024") || 
        order.date.includes("21/12/2024")
      );
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
    <div className="p-4 bg-white rounded-xl shadow-lg w-[75%] absolute top-20 -right-0 z-20 h-[calc(100vh-80px)] flex flex-col mr-4">
      {/* Fixed Header Section - Reduced padding for low height screens */}
      <div className="flex-none">
        {/* Header - More compact */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-[#2B2B2B]">Fulfillment</h2>
          <button
            className="bg-blue-500 text-white px-3 py-1.5 mr-4 text-sm"
            onClick={() => {
              setActivePage && setActivePage("order-details");
            }}>
            + New
          </button>
        </div>
    
        {/* Tabs - More compact */}
        <div className="flex space-x-6 border-b border-[#B2B2B2]">
          {["All", "Recent", "This Week"].map((tab) => (
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
    
        {/* Search - More compact */}
        <div className="mt-2 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name or phone number"
            className="border border-[#B2B2B2] p-2 rounded w-full text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0); // Reset to first page when search changes
            }}
          />
        </div>
      </div>
  
      {/* Table Headers - Fixed, more compact */}
      <div className="mt-2 flex-none">
        <table className="w-full text-[#484848] text-sm table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 w-10 text-left">
                <input 
                  type="checkbox" 
                  className="h-4 w-4" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-2 text-center font-medium w-[12%]">Order ID</th>
              <th className="p-2 text-center font-medium w-[18%]">Date</th>
              <th className="p-2 text-center font-medium w-[15%]">Customer</th>
              <th className="p-2 text-center font-medium w-[15%]">Phone</th>
              <th className="p-2 text-center font-medium w-[18%]">Product Name/Part No</th>
              <th className="p-2 text-center font-medium w-[7%]">Quantity</th>
              <th className="p-2 text-center font-medium w-[15%]">Status</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Table Body - Scrollable, more compact */}
      <div className="flex-grow overflow-y-auto">
        <table className="w-full border-b border-[#B2B2B2] text-[#484848] text-sm table-fixed">
          <tbody>
            {currentOrders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 w-10">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4" 
                    checked={selectedOrders[order.orderId] || false}
                    onChange={(e) => handleSelectOrder(order.orderId, e.target.checked)}
                  />
                </td>
                <td
                  className="p-2 text-center cursor-pointer hover:text-blue-600 w-[12%]"
                  onClick={() => {
                    setSelectedOrder && setSelectedOrder(order);
                    setActivePage && setActivePage("order-details");
                  }}>
                  {order.orderId}
                </td>
                <td className="p-2 text-center w-[18%]">{order.date}</td>
                <td className="p-2 text-center w-[15%]">
                  {order.firstName} {order.lastName}
                </td>
                <td className="p-2 text-center w-[15%]">{order.phoneNumber}</td>
                <td className="p-2 text-center w-[18%] truncate">
                  {order.products?.length > 0
                    ? order.products[0].name
                    : "N/A"}
                </td>
                <td className="p-2 text-center w-[7%]">
                  {order.products?.length > 0
                    ? order.products[0].quantity
                    : "N/A"}
                </td>
                <td className="p-2 w-[15%]">
                  <StatusDropDown
                    orderId={order.orderId}
                    initialStatus={order.status || "Pending"}
                    onStatusUpdate={handleStatusUpdate}
                    disableDropdown={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Pagination - Fixed at bottom, more compact */}
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
                className={`flex justify-center items-center w-7 h-7 border border-gray-300 rounded-md ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                &lt;
              </button>
              
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex justify-center items-center w-7 h-7 border rounded-md ${
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
                className={`flex justify-center items-center w-7 h-7 border border-gray-300 rounded-md ${
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

export default FullFillment;