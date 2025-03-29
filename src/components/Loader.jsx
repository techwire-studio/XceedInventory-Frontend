import { RiLoaderLine } from "@remixicon/react";
import React from "react";

const Loader = () => {
	return (
		<div className="animate-spin flex justify-center items-center">
			<RiLoaderLine size={40} />
		</div>
	);
};

export default Loader;
