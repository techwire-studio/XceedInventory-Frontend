import { RiArrowLeftLine } from "@remixicon/react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddProducts = () => {
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		source: "",
		subCategory: "",
		datasheetLink: "",
		description: "",
		package: "",
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/products/add-product",
				form,
			);

			toast.success(response.data.message);

			setForm({
				name: "",
				source: "",
				subCategory: "",
				datasheetLink: "",
				description: "",
				package: "",
			});
		} catch (error) {
			console.error("Error:", error);
			toast.error("Failed to add product. Try again!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 bg-white rounded-xl shadow-lg overflow-y-auto w-[78%] absolute top-20 -right-4 z-20 h-screen">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold flex items-center justify-center gap-2">
					<RiArrowLeftLine size={24} /> Add Products
				</h2>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-md"
					onClick={handleSubmit}
					disabled={loading}>
					{loading ? "Saving..." : "Save"}
				</button>
			</div>

			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 space-y-4">
					<div>
						<label className="block text-gray-600 text-sm font-semibold mb-1">
							Product Name/Part No
						</label>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							className="w-full border p-2 rounded bg-gray-50"
							placeholder="Enter Product Name"
						/>
					</div>

					<div>
						<label className="block text-gray-600 text-sm font-semibold mb-1">
							Description
						</label>
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							className="w-full border p-2 rounded h-48 bg-gray-50"
							placeholder="Enter product description"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-600 text-sm font-semibold mb-1">
								Category*
							</label>
							<input
								type="text"
								name="source"
								value={form.source}
								onChange={handleChange}
								className="w-full border p-2 rounded bg-gray-50"
								placeholder="Enter Source"
							/>
						</div>
						<div>
							<label className="block text-gray-600 text-sm font-semibold mb-1">
								Sub-Category (optional)
							</label>
							<input
								type="text"
								name="subCategory"
								value={form.subCategory}
								onChange={handleChange}
								className="w-full border p-2 rounded bg-gray-50"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-600 text-sm font-semibold mb-1">
								Datasheet Link*
							</label>
							<input
								type="text"
								name="datasheetLink"
								value={form.datasheetLink}
								onChange={handleChange}
								className="w-full border p-2 rounded bg-gray-50"
							/>
						</div>
						<div>
							<label className="block text-gray-600 text-sm font-semibold mb-1">
								Package
							</label>
							<input
								type="text"
								name="package"
								value={form.package}
								onChange={handleChange}
								className="w-full border p-2 rounded bg-gray-50"
							/>
						</div>
					</div>
				</div>

				<div className="space-y-7">
					<div>
						<label className="block text-gray-600 text-sm font-semibold mb-1">
							Media
						</label>
						<div className="border border-dashed p-6 rounded-lg text-center text-gray-500 bg-gray-100 h-48 flex flex-col justify-center items-center">
							<button className="text-blue-500">Upload new</button>
							<p className="text-xs mt-2">Drag & drop or click to upload</p>
						</div>
					</div>

					<div>
						<label className="block text-gray-600 text-sm font-semibold mb-1">
							Product ID
						</label>
						<input
							type="text"
							className="w-full border p-2 rounded bg-gray-50"
						/>
					</div>

					<div>
						<label className="block text-gray-600 text-sm font-semibold mb-1">
							Quantity
						</label>
						<input
							type="number"
							className="w-full border p-2 rounded bg-gray-50"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProducts;
