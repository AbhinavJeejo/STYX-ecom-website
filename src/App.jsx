import CartContext from "./context/CartContext";
import { FilterProvider } from "./context/FilterContext";
import AppRoutes from "./routes/AppRoutes";
import data from "./data/data.json";
import { ThemeContextProvider } from "./context/ThemeContextProvider";

function App() {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(data.users || []));
    }

    if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify(data.products || []));
    }
    
    return (
        <ThemeContextProvider>
            <FilterProvider>
                <CartContext>
                    <AppRoutes />
                </CartContext>
            </FilterProvider>
        </ThemeContextProvider>
    );
}

export default App;