import React, { useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import HeroSlider from "./HeroSilder";
import ImageStrip from "./ImageStrip"; // Add new import

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MataData title="Libati - Premium Sports Equipment Rental" />
          <div className="Home_Page">
            {/* Fixed Hero Section with Video Background */}
            <section className="heroSlider_Home">
              <HeroSlider />
            </section>

            {/* Content starts after hero section */}
            <div className="content-wrapper">
              {/* All Equipment Section */}
              <section className="all-equipment-section">
                <h2 className="trending_heading" data-section="products">
                  All Equipment
                </h2>

                <div className="trending-products">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "4rem 2rem",
                        width: "100%",
                        color: "#cbd5e1",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <h3>No products available at this time.</h3>
                      <p>Please check back later for our latest equipment.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Image Strip Section - moved below All Equipment */}
              <ImageStrip />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;