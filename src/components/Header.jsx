import { Bell } from "lucide-react";
import React from "react";

const Header = () => {
	return (
		<header className="h-28 bg-[#2b2b2b] text-white">
			<div className="p-6 mb-2 flex items-center justify-between">
				<img
					src="/XceedInventory.png"
					alt="logo"
					className="h-5"
				/>
				<p className="flex flex-col justify-center items-center">
					<Bell
						className="cursor-pointer text-sm font-light"
						size={24}
					/>
					<span className="text-sm font-light">Notifications</span>
				</p>
			</div>
		</header>
	);
};

export default Header;
