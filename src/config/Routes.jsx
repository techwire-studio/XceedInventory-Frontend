import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Analytics from "../pages/Analytics";
import OrderEnquires from "../pages/OrderEnquires";
import FullFillment from "../pages/FullFillment";
import Products from "../pages/Products";
import ImportExport from "../pages/ImportExport";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
            { path: "analytics", element: <Analytics /> },
            { path: "orders", element: <OrderEnquires /> },
            { path: "fullfillment", element: <FullFillment /> },
            { path: "products", element: <Products /> },
            { path: "import-product", element: <ImportExport /> },
        ],
    },
]);

export default function WebRouter() {
    return <RouterProvider router={router} />;
}