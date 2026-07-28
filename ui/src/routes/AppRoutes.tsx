import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import HomeLayout from "../layouts/HomeLayout";
import SystemSettings from "../pages/admin/SystemSettings";
import AgentDetails from "../pages/agents/AgentDetails";
import ManageAgents from "../pages/agents/ManageAgents";
import ClaimDetails from "../pages/claims/ClaimDetails";
import ManageClaims from "../pages/claims/ManageClaims";
import CustomerDetails from "../pages/customers/CustomerDetails";
import ManageCustomers from "../pages/customers/ManageCustomers";
import DashboardLayout from "../pages/dashboard/Dashboard";
import EmployeeDetails from "../pages/employees/EmployeeDetails";
import ManageEmployees from "../pages/employees/ManageEmployees";
import Home from "../pages/home/Home";

import PolicyDetails from "../pages/policies/PolicyDetails";
import ProtectedRoute from "./ProtectedRoute";
import { RoutePaths } from "./RoutePaths";
import ManagePolicies from "../pages/policies/ManagePolicies";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route element={<HomeLayout />}>
                <Route path={RoutePaths.HOME} element={<Home />} />
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    <Route
                        path={RoutePaths.DASHBOARD}
                        element={<DashboardLayout />}
                    />

                    <Route
                        path={RoutePaths.EMPLOYEES}
                        element={<ManageEmployees />}
                    />
                    <Route
                        path={RoutePaths.EMPLOYEE_DETAILS}
                        element={<EmployeeDetails />}
                    />

                    <Route
                        path={RoutePaths.CUSTOMERS}
                        element={<ManageCustomers />}
                    />
                    <Route
                        path={RoutePaths.CUSTOMER_DETAILS}
                        element={<CustomerDetails />}
                    />

                    <Route
                        path={RoutePaths.CLAIMS}
                        element={<ManageClaims />}
                    />
                    <Route
                        path={RoutePaths.CLAIM_DETAILS}
                        element={<ClaimDetails />}
                    />

                    <Route
                        path={RoutePaths.POLICIES}
                        element={<ManagePolicies />}
                    />
                    <Route
                        path={RoutePaths.POLICY_DETAILS}
                        element={<PolicyDetails />}
                    />

                    <Route path={RoutePaths.AGENT} element={<ManageAgents />} />
                    <Route
                        path={RoutePaths.AGENT_DETAILS}
                        element={<AgentDetails />}
                    />

                    <Route
                        path={RoutePaths.SYSTEM_SETTINGS}
                        element={<SystemSettings />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
