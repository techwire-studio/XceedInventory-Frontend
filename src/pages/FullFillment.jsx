import axios from "axios";
import React, { useEffect, useState } from "react";
import StatusDropDown from "../components/StatusDropDown";

const orders = [
	{
		id: "#9348",
		date: "18/12/2024 - 1:45 PM",
		customer: "Ritesh Yadav",
		product: "SPN3094, SPN8838",
		phone: "IH87GD7",
		status: "Completed",
	},
	{
		id: "#8745",
		date: "18/12/2024 - 5:45 PM",
		customer: "John Smith",
		product: "SPN8838",
		phone: "OO78UQ9",
		status: "Completed",
	},
	{
		id: "#8957",
		date: "18/12/2024 - 9:58 PM",
		customer: "David Williams",
		product: "SPN125N04A",
		phone: "IB023JD0",
		status: "Completed",
	},
	{
		id: "#4238",
		date: "18/12/2024 - 2:38 AM",
		customer: "Sarah Mitchel",
		product: "SPN166T04A",
		phone: "HC13FJ08",
		status: "Completed",
	},
];

const FullFillment = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	const [items, setItems] = useState([]);

	useEffect(() => {
		FullFilledData();
	}, []);

	const FullFilledData = async () => {
		setLoading(true);

		try {
			const response = await axios.get("http://localhost:5000/api/orders");
			setItems(response.data);
		} catch (error) {
			console.error("API Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredOrders = orders.filter((order) =>
		order.customer.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className=" p-8 bg-white overflow-y-auto rounded-xl shadow-lg w-[78%] absolute top-20 -right-6 z-20 h-screen">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-[#2B2B2B]">Orders</h2>{" "}
				<button className="bg-blue-500 text-white px-2 py-2 rounded-2xl">
					+ New
				</button>
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
					<thead className="text-center">
						<tr className="text-center">
							<th className="p-3">
								<input type="checkbox" />
							</th>
							<th className="p-3 font-medium">Order ID</th>
							<th className="p-3 font-medium">Date</th>
							<th className="p-3 font-medium">Customers</th>
							<th className="p-3 font-medium">ProductName/Part No</th>
							<th className="p-3 font-medium">Phone Number</th>
							<th className="p-3 font-medium">Fulfillment</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{filteredOrders.map((order) => (
							<tr
								key={order.id}
								className="border-b border-gray-300 rounded-lg font-light text-sm">
								<td className="p-3">
									<input type="checkbox" />
								</td>
								<td className="p-3">{order.id}</td>
								<td className="p-3">{order.date}</td>
								<td className="p-3">{order.customer}</td>
								<td className="p-3">{order.product}</td>
								<td className="p-3">{order.phone}</td>
								<td className="p-3 w-40">
									<StatusDropDown
										orderId={order.orderId}
										initialStatus={order.status || "Pending"}
										disableDropdown={true}
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

export default FullFillment;
