import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ImportExport = () => {
	const [file, setFile] = useState(null);
	const [importMode, setImportMode] = useState("skip");
	const [loading, setLoading] = useState(false);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			toast.success("File selected: " + selectedFile.name);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			toast.error("Please select a file before uploading!");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("importMode", importMode);

		try {
			const response = await axios.post(
				"http://localhost:5000/api/products/upload",
				formData,
				{ headers: { "Content-Type": "multipart/form-data" },
					withCredentials: true }	,
			);

			toast.success(response.data.message || "File uploaded successfully!");
			setFile(null);
		} catch (error) {
			console.error("Upload Error:", error);
			toast.error("File upload failed. Try again!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 pb-36 bg-white shadow-md rounded-lg w-[78%] absolute top-20 -right-6 z-20 h-screen overflow-y-auto">
			<div className="flex flex-col justify-center items-center w-full">
				<h2 className="text-xl font-semibold mb-6 text-center">
					Items - Select file
				</h2>

				<div className=" p-6 border border-[#9D9D9D] bg-white rounded-md text-center w-1/2 ">
					<div className="relative top-0 bottom-0 flex-col justify-center items-center">
						<p className="text-gray-600 mb-2">Drag and drop file to import</p>
						<div>
							<label
								htmlFor="fileUpload"
								className="cursor-pointer px-6 py-2 bg-white rounded-[20px] shadow-xl text-gray-700 inline-block">
								Choose File
							</label>
							<input
								type="file"
								id="fileUpload"
								accept=".csv"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>

						{file && <p className="text-green-600 mt-4">{file.name}</p>}
						<p className="text-xs text-[#8F8F8F] mt-4">
							Accepted File Size: 20 KB - 10 MB Accepted CSV file format only
						</p>
					</div>
				</div>

				<div className="mt-6 w-1/2 text-sm text-gray-700">
					<p className="mb-2">
						Download the sample file and complete it as per format. If file is
						ready, choose the file for product list import.
					</p>

					<h3 className="font-semibold text-gray-800 mb-2">
						Duplicate Handling:
					</h3>
					<div className="space-y-2">
						<label className="flex space-x-2">
							<input
								className="form-radio"
								type="radio"
								name="duplicateHandling"
								value="skip"
								checked={importMode === "skip"}
								onChange={() => setImportMode("skip")}
							/>
							<span>
								Skip Duplicates Any matches in the database & inventory will be
								skipped while importing the new target.
							</span>
						</label>

						<label className="flex space-x-2">
							<input
								type="radio"
								name="duplicateHandling"
								value="overwrite"
								checked={importMode === "overwrite"}
								onChange={() => setImportMode("overwrite")}
								className="form-radio"
							/>
							<span>
								Overwrite Imported file mapping in the import file will replace
								existing items in the database & overwrite.
							</span>
						</label>
					</div>
				</div>

				<div className="mt-6 p-4 rounded-md w-1/2  text-sm text-[#2b2b2b] text-start">
					<h3 className="font-semibold text-gray-800 mb-2">Page Tips:</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>
							Make sure values are added in UTF-8 format by editing field
							separators format.
						</li>
						<li>For bulk upload, use the template file for reference.</li>
						<li>
							If you accidentally import wrong data, you can use the reset
							button for rollback.
						</li>
					</ul>
				</div>

				<button
					onClick={handleUpload}
					className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md"
					disabled={loading}>
					{loading ? "Uploading..." : "Upload File"}
				</button>
			</div>
		</div>
	);
};

export default ImportExport;
