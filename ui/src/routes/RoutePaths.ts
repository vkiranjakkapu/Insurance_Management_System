export const RoutePaths = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    AGENT: "/agent",
    CUSTOMERS: "/customers",
    EMPLOYEES: "/employees",
    
    AGENT_DETAILS: "/agent/:id",
    EMPLOYEE_DETAILS: "/employees/:id",
    CUSTOMER_DETAILS: "/customers/:id",

    POLICIES: "/policies",
    POLICY_DETAILS: "/policies/:id",

    CLAIMS: "/claims",
    CLAIM_DETAILS: "/claims/:id",

    PAYMENTS: "/payments",
    DOCUMENTS: "/documents",
    REPORTS: "/reports",

    SYSTEM_SETTINGS: "/settings",
} as const;
