import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiLoaderLine,
} from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { RiAddLine, RiArrowDownSLine } from "react-icons/ri";
import Loader from "../components/Loader";
import ReactPaginate from "react-paginate";

const Products = ({ setActivePage }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Start at page 1 for backend
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Match backend default
    const [searchQuery, setSearchQuery] = useState(""); 
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [shouldFocusInput, setShouldFocusInput] = useState(false);
    
    // Create a ref for the search input
    const searchInputRef = useRef(null);

    // Debounce search query
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms delay

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Focus the input after data is loaded if needed
    useEffect(() => {
        if (!loading && shouldFocusInput && searchInputRef.current) {
            searchInputRef.current.focus();
            setShouldFocusInput(false);
        }
    }, [loading, shouldFocusInput]);

    // Fetch data when page, limit, or debounced search query changes
    useEffect(() => {
        // Check if input has focus before fetching data
        const inputHasFocus = document.activeElement === searchInputRef.current;
        if (inputHasFocus) {
            setShouldFocusInput(true);
        }

        if (debouncedQuery) {
            performSearch(debouncedQuery, currentPage);
        } else {
            fetchAllProducts();
        }
    }, [currentPage, itemsPerPage, debouncedQuery]);

    const fetchAllProducts = async () => {
        setLoading(true);
        setIsSearching(false);

        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/all-products?page=${currentPage}&limit=${itemsPerPage}`,
                {withCredentials: true}
            );
            setItems(response.data.products);
            setTotalProducts(response.data.totalProducts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const performSearch = async (query, page) => {
        if (!query) {
            fetchAllProducts();
            return;
        }

        setLoading(true);
        setIsSearching(true);

        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/search?query=${query}&limit=${itemsPerPage}&page=${page}`, 
                {withCredentials: true}
            );
            
            setItems(response.data.products);
            setTotalProducts(response.data.totalProducts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = ({ selected }) => {
        // Check if search input has focus before changing page
        if (document.activeElement === searchInputRef.current) {
            setShouldFocusInput(true);
        }
        
        // selected is 0-indexed, but our API expects 1-indexed
        setCurrentPage(selected + 1);
    };

    const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // Reset to first page when search query changes
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setDebouncedQuery("");
        setCurrentPage(1);
        // Focus the input after clearing
        searchInputRef.current.focus();
    };

    if (loading) {
        return <Loader containerClass="w-[78%] absolute top-20 -right-6 bg-white rounded-xl shadow-lg h-screen" text="Loading products..." />;
    }
    
    return (
        <div className="p-8 bg-white rounded-xl shadow-lg w-[78%] absolute top-20 -right-6 z-20 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-none">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2 text-[#2B2B2B]">
                    Active Items <RiArrowDownSLine size={24} />
                </h2>

                <button
                    type="button"
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setActivePage("add-products")}>
                    <RiAddLine className="mr-2" />
                    Add Products
                </button>
            </div>

            <div className="mb-4 flex-none relative">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products by name, ID, or category"
                    className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={handleSearchInput}
                />
                {searchQuery && (
                    <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={clearSearch}
                    >
                        ✕
                    </button>
                )}
            </div>

            {isSearching && (
                <div className="mb-4 flex-none">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 mr-2">
                            Search results for: <span className="font-medium">"{debouncedQuery}"</span>
                        </span>
                        <button 
                            className="text-blue-500 hover:underline"
                            onClick={clearSearch}
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto flex-grow overflow-y-auto">
                <table className="w-full border-b border-gray-300 rounded-lg text-[#484848]">
                    <thead className="sticky top-0 bg-white text-left">
                        <tr>
                            <th className="p-3">
                                <input type="checkbox" />
                            </th>
                            <th className="p-3">ProductName/PartNo</th>
                            <th className="p-3">Datasheet</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">SubCategory</th>
                            <th className="p-3">ProductID</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-300 rounded-lg font-light text-sm">
                                    <td className="p-3">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3 text-center">
                                        <a
                                            className="truncate block max-w-[200px]"
                                            href={item.datasheetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={item.datasheetLink}
                                        >
                                            {item.datasheetLink && item.datasheetLink.length > 30
                                            ? `${item.datasheetLink.substring(0, 30)}...`
                                            : item.datasheetLink || "N/A"}
                                        </a>
                                    </td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3">{item.subCategory}</td>
                                    <td className="p-3">{item.id}</td>
                                    <td className="p-3 relative">
                                        <div className="text-gray-600 cursor-pointer relative group">
                                            <span>⋮</span>
                                            <div className="absolute right-0 top-5 hidden group-hover:block bg-white shadow-md border rounded-md w-24">
                                                <button className="block w-full px-3 py-2 text-sm hover:bg-gray-100">
                                                    Edit
                                                </button>
                                                <button className="block w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-100">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-500">
                                    {isSearching ? 
                                        `No products found matching "${debouncedQuery}"` : 
                                        "No products found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {totalProducts > 0 && (
                <div className="py-4 border-t border-gray-200 flex-none">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts)} - {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                        </div>
                        <ReactPaginate
                            previousLabel={<RiArrowLeftSLine />}
                            nextLabel={<RiArrowRightSLine />}
                            pageCount={totalPages}
                            onPageChange={handlePageChange}
                            containerClassName={"flex items-center space-x-2"}
                            previousLinkClassName={"flex justify-center items-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100"}
                            nextLinkClassName={"flex justify-center items-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100"}
                            pageLinkClassName={"flex justify-center items-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100"}
                            activeLinkClassName={"bg-blue-500 text-white border-blue-500 hover:bg-blue-600"}
                            disabledClassName={"opacity-50 cursor-not-allowed"}
                            forcePage={currentPage - 1}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;