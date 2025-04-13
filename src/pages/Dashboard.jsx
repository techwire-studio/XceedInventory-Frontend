import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import OrderEnquires from "./OrderEnquires";
import FullFillment from "./FullFillment";
import Products from "./Products";
import ImportExport from "./ImportExport";
import Analytics from "./Analytics";
import AddProducts from "./AddProducts";
import OrderDetails from "./OrderDetails";
import CreateOrder from "./CreateOrder";
import Profile from "./Profile";

export default function Dashboard() {
	const [activePage, setActivePage] = useState("analytics");
	const [selectedOrder, setSelectedOrder] = useState(null);

	const renderContent = () => {
		switch (activePage) {
			case "home":
				return <Analytics setActivePage={setActivePage} />;
			case "orders":
				return (
					<OrderEnquires
						setActivePage={setActivePage}
						setSelectedOrder={setSelectedOrder}
					/>
				);
			case "fulfillment":
				return <FullFillment />;
			case "products":
				return <Products setActivePage={setActivePage} />;
			case "import-export":
				return <ImportExport />;
			case "add-products":
				return <AddProducts />;
			case "order-details":
				return (
					<OrderDetails
						setActivePage={setActivePage}
						order={selectedOrder}
					/>
				);
			case "create-order":
				return <CreateOrder setActivePage={setActivePage} />;
			case "profile":
				return <Profile setActivePage={setActivePage} />;
			default:
				return <Analytics setActivePage={setActivePage} />;
		}
	};

	return (
		<div className="flex h-screen bg-gray-100 overflow-y-scroll">
			<div className="flex flex-col w-full">
				<div className="flex flex-1 gap-2 pt-96">
					<Sidebar setActivePage={setActivePage} />
					<main className="flex-1 flex items-center justify-center p-6">
						{renderContent()}
					</main>
				</div>
			</div>
		</div>
	);
}
