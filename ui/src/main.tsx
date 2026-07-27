import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContextProvider.tsx";
import "./index.css";
import ProfileContextProvider from "./context/ProfileContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthContextProvider>
            <ProfileContextProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ProfileContextProvider>
        </AuthContextProvider>
    </StrictMode>,
);
