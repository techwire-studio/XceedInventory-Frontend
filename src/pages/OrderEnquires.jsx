import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const statusOptions = [
	{ value: "Ready to Dispatch", label: "Ready to Dispatch", image: "/rtd.png" },
	{ value: "Pending", label: "Pending", image: "/pending.png" },
	{ value: "Completed", label: "Completed", image: "/complete.png" },
	{ value: "Cancelled", label: "Cancelled", image: "/cancel.png" },
];

const customSingleValue = ({ data }) => (
	<div className="flex items-center">
		<img
			src={data.image}
			alt={data.label}
			className="w-5 h-5 mr-2"
		/>
		<span>{data.label}</span>
	</div>
);

const customOption = (props) => {
	const { data, innerRef, innerProps } = props;
	return (
		<div
			ref={innerRef}
			{...innerProps}
			className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
			<img
				src={data.image}
				alt={data.label}
				className="w-5 h-5 mr-2"
			/>
			<span>{data.label}</span>
		</div>
	);
};

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

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			const response = await axios.patch(
				`http://localhost:5000/api/orders/${orderId}/status`,
				{
					status: newStatus,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			console.log("Full Response:", {
				status: response.status,
				data: response.data,
			});

			toast.success(`Order ${orderId} status updated to "${newStatus}"`);
		} catch (error) {
			toast.error(`Failed to update status: ${error.message}`);
		}
	};

	if (loading) {
		return <Loader />;
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
		<div className="p-8 bg-gray-100 rounded-xl shadow-lg w-[78%] absolute top-20 -right-6 z-20 h-screen overflow-y-auto">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-[#2B2B2B]">Orders</h2>{" "}
				<button
					className="bg-blue-500 text-white px-2 py-2 rounded-2xl"
					onClick={() => {
						// setSelectedOrder(order);
						setActivePage("order-details");
					}}>
					+New
				</button>
			</div>

			<div className="flex space-x-6 border-b border-[#B2B2B2]">
				{["All", "Unfulfilled", "Ready to Dispatch"].map((tab) => (
					<button
						key={tab}
						className={`pb-2 ${
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
					className="border border-[#B2B2B2] p-2 rounded w-full"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full border-b border-[#B2B2B2] text-[#484848]">
					<thead className="text-left">
						<tr className="text-left">
							<th className="p-3">
								<input type="checkbox" />
							</th>
							<th className="px-4 font-medium">Order ID</th>
							<th className="px-2 font-medium">Date</th>
							<th className="px-3 font-medium">Customers</th>
							<th className="px-8 font-medium">Product Name/Part No</th>
							<th className="px-3 font-medium">PhoneNumber</th>
							<th className="px-3 font-medium">Fulfillment</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr
								key={order.orderId}
								className="border-b border-gray-300 rounded-lg font-light text-sm">
								<td className="p-3">
									<input type="checkbox" />
								</td>
								<td
									className="p-3"
									onClick={() => {
										setSelectedOrder(order);
										setActivePage("order-details");
									}}>
									{order.orderId}
								</td>
								<td className="p-3">
									{order.firstName} {order.lastName}
								</td>
								<td className="p-3">{order.phoneNumber}</td>
								<td className="p-3">
									{order.products?.length > 0
										? order.products[0].productName
										: "N/A"}
								</td>
								<td className="p-3">
									{order.products?.length > 0
										? order.products[0].quantity
										: "N/A"}
								</td>
								<td className="p-3">
									{/* <select
										value={order.status}
										onChange={(e) =>
											handleStatusChange(order.orderId, e.target.value)
										}
										className="border p-2 rounded bg-white">
										<option value="Ready to Dispatch">Ready to Dispatch</option>
										<option value="Pending">Pending</option>
										<option value="Completed">Completed</option>
										<option value="Cancelled">Cancelled</option>
									</select> */}
									<Select
										options={statusOptions}
										value={statusOptions.find(
											(opt) => opt.value === order.status,
										)}
										onChange={(selectedOption) =>
											handleStatusChange(order.orderId, selectedOption.value)
										}
										components={{
											SingleValue: customSingleValue,
											Option: customOption,
										}}
										className="border border-[#B2B2B2] p-2 rounded"
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

{
	/* <StatusDropDown
										orderId={order.orderId}
										initialStatus={order.status}
										onStatusUpdate={(orderId, newStatus) =>
											setItems((prevItems) =>
												prevItems.map((item) =>
													item.orderId === orderId
														? { ...item, status: newStatus }
														: item,
												),
											)
										}
									/> */
}

// const handleStatusChange = async (orderId, newStatus) => {
// 	console.log("Updating order:", orderId, "with status:", newStatus);

// 	try {
// 		await axios.patch(
// 			`http://localhost:5000/api/orders/${orderId}/status`,
// 			{
// 				status: newStatus,
// 			},
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			},
// 		);
// 		toast.success(`Order ${orderId} status updated to "${newStatus}"`);
// 		setItems((prevItems) =>
// 			prevItems.map((item) =>
// 				item.orderId === orderId ? { ...item, status: newStatus } : item,
// 			),
// 		);
// 	} catch (error) {
// 		console.error("Status Update Error:", error);
// 		toast.error("Failed to update status");
// 	}
// };
