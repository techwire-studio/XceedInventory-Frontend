import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StatusDropDown = ({ orderId, initialStatus, onStatusUpdate }) => {
	const [status, setStatus] = useState(initialStatus);
	const [loading, setLoading] = useState(false);

	const handleStatusChange = async (e) => {
		const newStatus = e.target.value;
		setStatus(newStatus);
		setLoading(true);

		try {
			await axios.patch(
				`http://localhost:5000/api/orders/${orderId}/status`,
				{
					status: newStatus,
				},
				{ headers: { "Content-Type": "application/json" } },
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

	return (
		<select
			value={status}
			onChange={handleStatusChange}
			className="px-2 py-1 rounded text-sm border focus:outline-none text-gray-900 border-gray-500"
			disabled={loading}>
			<option value="Pending">Pending</option>
			<option value="Ready to Dispatch">Ready to Dispatch</option>
			<option value="Completed">Completed</option>
			<option value="Cancelled">Cancelled</option>
		</select>
	);
};

export default StatusDropDown;
