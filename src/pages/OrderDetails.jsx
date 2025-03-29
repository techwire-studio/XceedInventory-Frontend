/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiCloseLine } from "react-icons/ri";

const OrderDetails = ({ setActivePage, order }) => {
	if (!order) {
		return null;
	}
	const [sameAsShipping, setSameAsShipping] = useState(false);
	const [shippingAddress, setShippingAddress] = useState(
		order.shippingAddress || {},
	);
	const [billingAddress, setBillingAddress] = useState(
		order.billingAddress || {},
	);
	const [products, setProducts] = useState(order.products || []);
	const [loading, setLoading] = useState(false);

	const handleClose = () => {
		setActivePage("orders");
	};

	const handleAddressChange = (e, type, field) => {
		const value = e.target.value;
		if (type === "shipping") {
			setShippingAddress({ ...shippingAddress, [field]: value });
		} else {
			setBillingAddress({ ...billingAddress, [field]: value });
		}
	};

	const handleProductChange = (index, field, value) => {
		const updatedProducts = [...products];
		updatedProducts[index][field] = value;
		setProducts(updatedProducts);
	};

	const handleConfirm = async () => {
		setLoading(true);

		const updatedOrder = {
			email: order.email || "admin@xceed.com",
			invoiceNumber: order.invoiceNumber || "9874155",
			message: "Confirmed order",
			totalAmount: order.totalAmount || 480.0,
			shippingAddress,
			billingAddress: sameAsShipping ? shippingAddress : billingAddress,
			products,
		};

		console.log("Updating Order Data:", updatedOrder);

		try {
			const response = await axios.patch(
				`http://localhost:5000/api/orders/${order.orderId}/details`,
				JSON.stringify(updatedOrder),
				{
					headers: { "Content-Type": "application/json" },
				},
			);

			if (response.status === 200) {
				toast.success("Order details updated successfully!");
				setActivePage("orders");
			} else {
				throw new Error("Unexpected response from server");
			}
		} catch (error) {
			console.error("Error updating order:", error.response?.data || error);
			toast.error("Failed to update order details.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-8  w-full overflow-y-auto h-full relative">
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">
					<RiCloseLine size={24} />
				</button>

				<h2 className="text-2xl font-semibold mb-6">Order Details</h2>

				<div className="flex justify-between gap-4 mb-6 text-gray-700">
					<div className="grid grid-cols">
						<p>
							<span className="font-medium">First Name</span>
						</p>
						<p>
							<span className="font-medium">Last Name</span>
						</p>
						<p>
							<span className="font-medium">Email Id</span>
						</p>
						<p>
							<span className="font-medium">Phone Number</span>
						</p>
						<p>
							<span className="font-medium">Message</span>
						</p>
						<p>
							<span className="font-medium">Product Enquired</span>
						</p>
						<p>
							<span className="font-medium">Enquiry Date</span>
						</p>
						<p>
							<span className="font-medium">Tracking Id</span>
						</p>
						<p>
							<span className="font-medium">Invoice#:</span>
						</p>
						<p>
							<span className="font-medium">Total Amount:</span>
						</p>
					</div>
					<div className="">
						<button className="bg-yellow-400 text-gray-800 text-sm font-semibold px-5 py-2"></button>
					</div>
				</div>

				<h3 className="text-lg font-semibold mb-2">Product Details</h3>
				<div className="border border-gray-300 rounded-lg p-4 mb-6">
					<table className="w-full text-sm text-left">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2">Product Name/Part No</th>
								<th className="p-2">Product ID</th>
								<th className="p-2">Quantity</th>
								<th className="p-2">Amount (optional)</th>
							</tr>
						</thead>
						<tbody>
							{products.map((item, index) => (
								<tr
									key={index}
									className="border-b font-light">
									<td className="p-2">{item.name}</td>
									<td className="p-2">{item.productId}</td>
									<td className="p-2">
										<input
											type="number"
											className="w-full border border-gray-300 rounded p-1"
											value={item.quantity}
											onChange={(e) =>
												handleProductChange(index, "quantity", e.target.value)
											}
										/>
									</td>
									<td className="p-2">
										<input
											type="number"
											className="w-full border border-gray-300 rounded p-1"
											value={item.amount}
											onChange={(e) =>
												handleProductChange(index, "amount", e.target.value)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<h3 className="text-lg font-semibold mb-2">Address</h3>

				<h4 className="font-medium mb-2">Shipping Address</h4>
				<div className="grid grid-cols-2 gap-4 mb-4">
					{["line1", "line2", "city", "state", "pinCode", "country"].map(
						(field) => (
							<input
								key={field}
								type="text"
								placeholder={field}
								className="border p-2 rounded w-full"
								value={shippingAddress[field] || ""}
								onChange={(e) => handleAddressChange(e, "shipping", field)}
							/>
						),
					)}
				</div>

				<div className="flex items-center gap-2 mb-2">
					<h4 className="font-medium">Billing Address</h4>
					<label className="text-blue-500 text-sm cursor-pointer">
						<input
							type="checkbox"
							className="mr-2"
							checked={sameAsShipping}
							onChange={() => setSameAsShipping(!sameAsShipping)}
						/>
						Same as shipping address
					</label>
				</div>

				{!sameAsShipping && (
					<div className="grid grid-cols-2 gap-4 mb-6">
						{["line1", "line2", "city", "state", "pinCode", "country"].map(
							(field) => (
								<input
									key={field}
									type="text"
									placeholder={field}
									className="border p-2 rounded w-full"
									value={billingAddress[field] || ""}
									onChange={(e) => handleAddressChange(e, "billing", field)}
								/>
							),
						)}
					</div>
				)}

				<div className="flex justify-center">
					<button
						onClick={handleConfirm}
						disabled={loading}
						className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
						{loading ? "Updating..." : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
