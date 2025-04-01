import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import React, { useState } from "react";

const Sidebar = ({ setActivePage }) => {
    const [option, setOption] = useState("home");
    const [isSalesOpen, setIsSalesOpen] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    const handleOption = (page, parent = null) => {
        setOption(page);
        setActivePage(page);

        if (parent === "sales") setIsSalesOpen(true);
        if (parent === "inventory") setIsInventoryOpen(true);
    };

    return (
        <aside className="bg-white text-[#2B2B2B] font-medium p-6 flex flex-col rounded-xl absolute w-[22%] top-20 left-0 z-20 bottom-4 shadow-lg overflow-y-auto">
            <div className="flex flex-col items-center mb-4">
                <img
                    src="/avatar.png"
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                />
                <div className="mt-1 text-center">
                    <p className="text-sm font-semibold">Riya Sharma</p>
                    <p className="text-xs text-gray-700">Project Manager</p>
                </div>
            </div>

            <nav className="flex flex-col space-y-2 mt-2">
                <button
                    onClick={() => handleOption("home")}
                    className={`py-1.5 px-2 text-start rounded-lg cursor-pointer ${
                        option === "home" && "bg-[#2b2b2b] text-white"
                    }`}>
                    Home
                </button>

                <button
                    onClick={() => setIsSalesOpen(!isSalesOpen)}
                    className={`py-1.5 px-2 flex justify-between rounded-lg cursor-pointer ${
                        ["orders", "fulfillment"].includes(option) &&
                        "bg-[#2b2b2b] text-white"
                    }`}>
                    Sales {isSalesOpen ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                </button>
                {isSalesOpen && (
                    <div className="ml-4 space-y-1">
                        <button
                            onClick={() => handleOption("orders", "sales")}
                            className={`block py-1 px-2 cursor-pointer ${
                                option === "orders"
                                    ? "text-[#1428A1] font-bold"
                                    : "text-[#2b2b2b] font-medium"
                            }`}>
                            Order Enquires
                        </button>
                        <button
                            onClick={() => handleOption("fulfillment", "sales")}
                            className={`block py-1 px-2 cursor-pointer ${
                                option === "fulfillment"
                                    ? "text-[#1428A1] font-bold"
                                    : "text-[#2b2b2b] font-medium"
                            }`}>
                            Fulfillment
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                    className={`py-1.5 px-2 flex justify-between rounded-lg cursor-pointer ${
                        ["products", "import-export"].includes(option) &&
                        "bg-[#2b2b2b] text-white"
                    }`}>
                    Inventory{" "}
                    {isInventoryOpen ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                </button>
                {isInventoryOpen && (
                    <div className="ml-4 space-y-1">
                        <button
                            onClick={() => handleOption("products", "inventory")}
                            className={`block py-1 px-2 cursor-pointer ${
                                option === "products"
                                    ? "text-[#1428A1] font-bold"
                                    : "text-[#2b2b2b] font-medium"
                            }`}>
                            Products
                        </button>
                        <button
                            onClick={() => handleOption("import-export", "inventory")}
                            className={`block py-1 px-2 cursor-pointer text-left ${
                                option === "import-export"
                                    ? "text-[#1428A1] font-bold"
                                    : "text-[#2b2b2b] font-medium"
                            }`}>
                            Import/Export CSV
                        </button>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;