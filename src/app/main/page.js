"use client"
import { useEffect } from "react";
import { withProtectedRoute } from "@/components/auth/ProtectedRoute";

function Main() {

    useEffect(() => {
        document.title = "Cana Goals | Dashboard";
    }, []);
    
    return (
        <div>
            Hello
        </div>
    );
}

export default withProtectedRoute(Main);