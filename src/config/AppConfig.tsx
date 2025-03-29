import axios from "axios";
import { Restapi } from "./Restapi";

export const AppConfig = {
	API_URL: "http://localhost:5000/api/",
};

export const apiCall = async (module: string, data = {}) => {
	try {
		const url = AppConfig.API_URL + module;
		const result = await axios.post(url, data, {
			headers: { "Content-Type": "application/json" },
		});
		const resp: Restapi = await result.data;
		return resp;
	} catch (er: any) {
		console.log("api-call-error", er.message);
	}
};

export async function getOption(name: string) {
	const json = localStorage.getItem("_options");
	if (json != null) {
		const ab = JSON.parse(json);
		return ab[name];
	} else {
		return null;
	}
}
