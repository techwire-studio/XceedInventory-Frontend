import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import OrderEnquires from "./OrderEnquires";
import FullFillment from "./FullFillment";
import Products from "./Products";
import ImportExport from "./ImportExport";
import Analytics from "./Analytics";
import AddProducts from "./AddProducts";
import OrderDetails from "./OrderDetails";

export default function Dashboard() {
    const [activePage, setActivePage] = useState("analytics");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Sync state-based navigation with router-based navigation
    useEffect(() => {
        // Extract path after /dashboard/ if it exists
        const path = location.pathname.split('/dashboard/')[1];
        if (path) {
            setActivePage(path);
        }
    }, [location]);
    
    // Handle state change to update URL
    const handlePageChange = (page) => {
        setActivePage(page);
        navigate(`/dashboard/${page}`);
    };
    
    const renderContent = () => {
        switch (activePage) {
            case "home":
            case "analytics":
                return <Analytics setActivePage={handlePageChange} />;
            case "orders":
                return (
                    <OrderEnquires
                        setActivePage={handlePageChange}
                        setSelectedOrder={setSelectedOrder}
                    />
                );
            case "fulfillment":
            case "fullfillment": // Handle both spellings
                return <FullFillment />;
            case "products":
                return <Products setActivePage={handlePageChange} />;
            case "import-export":
            case "import-product":
                return <ImportExport />;
            case "add-products":
                return <AddProducts />;
            case "order-details":
                return (
                    <OrderDetails
                        setActivePage={handlePageChange}
                        order={selectedOrder}
                    />
                );
            default:
                return <Analytics setActivePage={handlePageChange} />;
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-y-scroll">
            <div className="flex flex-col w-full">
                <div className="flex flex-1 gap-2 pt-96">
                    <Sidebar setActivePage={handlePageChange} />
                    <main className="flex-1 flex items-center justify-center p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}