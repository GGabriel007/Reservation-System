import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures that whenever a new page is loaded, the scroll position returns to top.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
