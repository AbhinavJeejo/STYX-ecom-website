import Product from "../components/ProductsPage";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Craftsmanship from "../components/Craftsmanship";

function Home() {
    return (
        <div className="page-content">
            <Banner />
            <Product />
            <Craftsmanship />
            <Footer />
        </div>
    );
}

export default Home;
