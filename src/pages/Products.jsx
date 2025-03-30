import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiLoaderLine,
} from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiAddLine, RiArrowDownSLine } from "react-icons/ri";
import Loader from "../components/Loader";
import ReactPaginate from "react-paginate";

const Products = ({ setActivePage }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 100;

    useEffect(() => {
        ProductsData();
    }, []);

    const ProductsData = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                "http://localhost:5000/api/products/all-products",
            );
            setItems(response.data);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = items.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (loading) {
        return <Loader containerClass="w-[78%] absolute top-20 -right-6 bg-white rounded-xl shadow-lg h-screen" text="Loading products..." />;
    }
    
    return (
        <div className="p-8 bg-white rounded-xl shadow-lg w-[78%] absolute top-20 -right-6 z-20 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
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

            <input
                type="text"
                placeholder="Search"
                className="w-full p-2 border-b border-gray-300 rounded-md mb-4"
            />

            <div className="overflow-x-auto">
                <table className="w-full border-b border-gray-300 rounded-lg text-[#484848]">
                    <thead>
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
                    <tbody className="text-center">
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
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
											title={item.datasheetLink} // Show full URL on hover
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
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {items.length > 0 && (
                <div className="flex justify-center items-end mt-4">
                    <ReactPaginate
                        previousLabel={<RiArrowLeftSLine />}
                        nextLabel={<RiArrowRightSLine />}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        containerClassName={"flex items-center space-x-2"}
                        previousLinkClassName={"flex justify-center items-center"}
                        nextLinkClassName={"flex justify-center items-center"}
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                        activeClassName={"bg-blue-500 text-white px-3 py-1 rounded"}
                    />
                </div>
            )}
        </div>
    );
};

export default Products;