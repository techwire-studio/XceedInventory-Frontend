// import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../config/AuthContext";
// import AuthContext from "../config/AuthContext";

const Login = () => {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await login(username, password);
			navigate("/");
			toast.success("Login Success");
		} catch (err) {
			toast.error("Invalid username or password", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-white">
			<div className="w-full max-w-sm">
				<h1 className="text-center text-2xl font-bold">
					Xceed<span className="text-blue-600">Inventory</span>
				</h1>

				<form
					className="mt-8 space-y-4"
					onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full border-b border-gray-300 p-2 outline-none"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border-b border-gray-300 p-2 outline-none"
						required
					/>
					<Link
						to={"/"}
						className="text-blue-500 text-sm">
						Forget password
					</Link>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold cursor-pointer mt-2"
						disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
