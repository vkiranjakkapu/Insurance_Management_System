import usePrincipal from "../../context/usePrincipal";

export default function Dashboard() {
    const auth = usePrincipal();

    return (
        <div>
            <p>Dashboard</p>
            <p>Login Details: {JSON.stringify(auth.principal)}</p>
            <p>Login Status: {JSON.stringify(auth.isLoggedIn())}</p>
            <button
                className="bg-cyan-50"
                onClick={() =>
                    auth.authenticate({
                        email: "admin@ims.com",
                        password: "admin123",
                    })
                }
            >
                Login
            </button>
            <button
                className="bg-cyan-50"
                onClick={() => auth.logout()}
            >
                Logout
            </button>
        </div>
    );
}
