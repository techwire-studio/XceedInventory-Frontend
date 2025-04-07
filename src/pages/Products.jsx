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

const sampleProducts = [
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfest",
		subCategory: "SR MOSFET",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
	{
		productId: "IF94HBD",
		datasheetLink: "https://www.syn.com/",
		category: "Mosfets",
		subCategory: "SOT-23-3L",
		status: "Pending",
		products: [{ name: "SPN3094", imagehref: "/" }],
	},
];

const Products = ({ setActivePage }) => {
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [items, setItems] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 100;

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);

			try {
				setTimeout(() => {
					setItems(sampleProducts);
					setLoading(false);
				}, 500);
			} catch (error) {
				console.error("API Error:", error);
				setLoading(false);
			}
		};

		loadData();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300); // 300ms delay

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// const ProductsData = async () => {
	// 	setLoading(true);

	// 	try {
	// 		const response = await axios.get(
	// 			"http://localhost:5000/api/products/all-products",
	// 		);
	// 		setItems(response.data);
	// 	} catch (error) {
	// 		console.error("API Error:", error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const filteredOrders = items.filter((order) => {
		const matchesSearch =
			`${order.productName}`
				.toLowerCase()
				.includes(debouncedSearchQuery.toLowerCase()) ||
			(order.productId &&
				order.productId
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()));

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

	const handlePageChange = ({ selected }) => {
		setCurrentPage(selected);
	};

	if (loading) {
		return (
			<Loader
				containerClass="w-[78%] absolute top-20 -right-6 bg-white rounded-xl shadow-lg h-screen"
				text="Loading products..."
			/>
		);
	}

	return (
		<div className="p-4 bg-white rounded-xl shadow-lg w-[75%] absolute top-20 -right-0 z-20 h-[calc(100vh-80px)] flex flex-col mr-4 overflow-y-auto">
			<div className="flex-none">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-semibold flex items-center justify-center gap-2 text-[#2B2B2B]">
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

				<div className="mt-2 flex justify-between items-center">
					<input
						type="text"
						placeholder="Search"
						className="border border-[#B2B2B2] p-1.5 rounded w-full text-sm"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
					/>
				</div>
			</div>

			<div className="mt-2 flex-none">
				<table className="w-full text-[#484848] text-sm table-fixed">
					<thead className="bg-gray-50">
						<tr>
							<th className="p-2 w-10 text-center">
								<input type="checkbox" />
							</th>
							<th className="p-2 text-center font-medium w-[25%]">
								ProductName/PartNo
							</th>
							<th className="p-2 text-center font-medium w-[25%]">Datasheet</th>
							<th className="p-2 text-center font-medium w-[15%]">Category</th>
							<th className="p-2 text-center font-medium w-[15%]">
								SubCategory
							</th>
							<th className="p-2 text-center font-medium w-[15%]">ProductID</th>
							<th className="p-2 text-center font-medium w-[15%]"></th>
						</tr>
					</thead>
				</table>
				<div className="flex-grow overflow-y-auto min-h-0">
					<table className="w-full border-b border-[#B2B2B2] text-[#484848] text-sm table-fixed">
						<tbody className="text-center">
							{currentOrders.length > 0 ? (
								currentOrders.map((item, index) => (
									<tr
										key={index}
										className="border-b border-gray-300 rounded-lg font-light text-sm">
										<td className="p-2 w-10 text-center">
											<input
												type="checkbox"
												className="w-3 h-3"
											/>
										</td>
										<td className="p-2 text-center w-[25%]">
											{item.products?.length > 0 && item.products[0].imagehref}
											{item.products?.length > 0
												? item.products[0].productName || item.products[0].name
												: "N/A"}
										</td>
										<td className="p-2 text-center w-[25%] truncate">
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
										<td className="p-2 text-center w-[15%]">{item.category}</td>
										<td className="p-2 text-center w-[15%]">
											{item.subCategory}
										</td>
										<td className="p-2 text-center w-[15%]">
											{item.productId}
										</td>
										<td className="p-2 text-center w-[15%] relative">
											<div className="text-gray-600 cursor-pointer relative group">
												<span>⋮</span>
												<div className="absolute right-0 top-5 hidden group-hover:block bg-white border rounded-md w-24">
													<button className="block w-[10%] p-2 text-sm hover:bg-gray-100">
														Edit
													</button>
													<button className="block w-[10%] p-2 text-sm text-red-500 hover:bg-gray-100">
														Remove
													</button>
												</div>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="7"
										className="text-center p-4 text-gray-500">
										No products found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{/* Pagination - Fixed at bottom with reduced padding */}
			{filteredOrders.length > 0 && (
				<div className="py-2 border-t border-gray-200 flex-none">
					<div className="flex justify-between items-center">
						<div className="text-xs text-gray-500">
							Showing {Math.min(offset + 1, filteredOrders.length)} -{" "}
							{Math.min(offset + itemsPerPage, filteredOrders.length)} of{" "}
							{filteredOrders.length} orders
						</div>
						<div className="flex items-center space-x-1">
							<button
								onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
								disabled={currentPage === 0}
								className={`flex justify-center items-center w-6 h-6 border border-gray-300 rounded-md ${
									currentPage === 0
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-gray-100"
								}`}>
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
									}`}>
									{page + 1}
								</button>
							))}

							<button
								onClick={() =>
									handlePageChange(Math.min(pageCount - 1, currentPage + 1))
								}
								disabled={currentPage === pageCount - 1}
								className={`flex justify-center items-center w-6 h-6 border border-gray-300 rounded-md ${
									currentPage === pageCount - 1
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-gray-100"
								}`}>
								&gt;
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Products;
