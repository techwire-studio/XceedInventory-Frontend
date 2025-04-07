import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StatusDropDown = ({ orderId, initialStatus, onStatusUpdate, disableDropdown }) => {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownMenuRef = useRef(null);

    // Status options with their corresponding colors
    const statusOptions = [
        { value: "Pending", color: "#F5D876" }, // Yellow
        { value: "Ready to dispatch", color: "#F79A4B" }, // Orange
        { value: "Completed", color: "#63D384" }, // Green
        { value: "Cancelled", color: "#E24C4C" }, // Red
    ];

    // Get the current status color
    const getCurrentStatusColor = () => {
        const option = statusOptions.find((opt) => opt.value === status);
        return option ? option.color : "#cccccc";
    };

    const handleStatusChange = async (newStatus) => {
        if (newStatus === status) {
            setIsOpen(false);
            return;
        }
        
        setStatus(newStatus);
        setIsOpen(false);
        setLoading(true);

        try {
            await axios.patch(
                `http://localhost:5000/api/orders/${orderId}/status`,
                {
                    status: newStatus,
                },
                { 
                    withCredentials: true,
                },
            );
            toast.success(`Order ${orderId} status updated to "${newStatus}"`);
            onStatusUpdate(orderId, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            setStatus(initialStatus);
        } finally {
            setLoading(false);
        }
    };

    // Adjust dropdown position when it opens
    useEffect(() => {
        if (isOpen && dropdownMenuRef.current) {
            const dropdown = dropdownMenuRef.current;
            const dropdownRect = dropdown.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if dropdown extends beyond viewport bottom
            if (dropdownRect.bottom > viewportHeight) {
                // Position dropdown above instead of below
                dropdown.style.bottom = "100%";
                dropdown.style.top = "auto";
                dropdown.style.marginBottom = "4px";
                dropdown.style.marginTop = "0";
            } else {
                // Reset to default position
                dropdown.style.top = "100%";
                dropdown.style.bottom = "auto";
                dropdown.style.marginTop = "4px";
                dropdown.style.marginBottom = "0";
            }
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // If dropdown is disabled, just show the status indicator
    if (disableDropdown) {
        return (
            <div className="flex items-center px-3 py-2">
                <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getCurrentStatusColor() }}
                />
                <span className="text-sm text-gray-900">{status}</span>
            </div>
        );
    }

    return (
        <div className="relative inline-block w-full" ref={dropdownRef}>
            {/* Current Status Display */}
            <div 
                className="flex items-center justify-between px-3 py-2 rounded bg-white cursor-pointer"
                onClick={() => !loading && setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getCurrentStatusColor() }}
                    />
                    <span className="text-sm text-gray-900 truncate">{status}</span>
                </div>
                <svg 
                    className={`flex-shrink-0 fill-current h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div 
                    ref={dropdownMenuRef}
                    className="absolute z-50 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 right-0 origin-top-right"
                >
                    {statusOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer ${
                                option.value === status ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleStatusChange(option.value)}
                        >
                            <div
                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                style={{ backgroundColor: option.color }}
                            />
                            <span className="text-sm truncate">{option.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default StatusDropDown;