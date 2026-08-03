import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import HomeLayout from "../layouts/HomeLayout";
import SystemSettings from "../pages/admin/SystemSettings";
import ClaimDetails from "../pages/claims/ClaimDetails";
import ManageClaims from "../pages/claims/ManageClaims";
import CustomerDetails from "../pages/customers/CustomerDetails";
import ManageUsers from "../pages/users/ManageUsers";
import EmployeeDetails from "../pages/employees/EmployeeDetails";
import Home from "../pages/home/Home";

import Dashboard from "../pages/dashboard/Dashboard";
import ManagePolicies from "../pages/policies/ManagePolicies";
import PolicyDetails from "../pages/policies/PolicyDetails";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";
import { RoutePaths } from "./RoutePaths";
import NonCustomerRoute from "./NonCustomersRoute";
import ProfilePage from "../pages/profile/ProfilePage";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import SubscriptionDetails from "../pages/subscriptions/SubscriptionDetails";

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
                        element={<Dashboard />}
                    />

                    <Route element={<AdminRoute />}>
                        <Route
                            path={RoutePaths.EMPLOYEE_DETAILS}
                            element={<EmployeeDetails />}
                        />

                        <Route
                            path={RoutePaths.SYSTEM_SETTINGS}
                            element={<SystemSettings />}
                        />
                    </Route>

                    <Route element={<NonCustomerRoute />}>
                        <Route
                            path={RoutePaths.USERS}
                            element={<ManageUsers />}
                        />
                        <Route
                            path={RoutePaths.CUSTOMERS}
                            element={<ManageUsers />}
                        />
                        <Route
                            path={RoutePaths.CUSTOMER_DETAILS}
                            element={<CustomerDetails />}
                        />
                    </Route>

                    <Route
                        path={RoutePaths.SUBSCIPRTION_DETAILS}
                        element={<SubscriptionDetails />}
                    />

                    <Route
                        path={RoutePaths.SUBSCIPRTIONS}
                        element={<Subscriptions />}
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
                    <Route
                        path={RoutePaths.PROFILE}
                        element={<ProfilePage />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
