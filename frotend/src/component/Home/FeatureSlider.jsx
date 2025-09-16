import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Remove these old imports:
// import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";

// Use these instead:
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import "./FeatureSlider.css";
import { Link } from "react-router-dom";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const FeaturedSlider = ({ products }) => {
  // Add safety check for products
  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <Swiper
      modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
      loop={true}
      speed={500}
      spaceBetween={150}
      slidesPerView={1} // Changed from "auto" to 1 for better stability
      pagination={{ clickable: true }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 10,
        depth: 50,
        modifier: 3,
        slideShadows: false,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween: 200,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 250,
        },
      }}
      className="featured_swiper"
    >
      {products.map((product) => {
        const { _id, images, name, price } = product;
        
        // Add safety checks
        if (!images || images.length === 0) {
          return null;
        }
        
        let newPrice = generateDiscountedPrice(price);
        newPrice = dispalyMoney(newPrice);
        const oldPrice = dispalyMoney(price);

        return (
          <SwiperSlide key={_id} className="featured_slides">
            <Link
              to={`/product/${_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="featured_title">{name}</div>
              <figure className="featured_img">
                <img src={images[0].url} alt={name} />
              </figure>
              <h2 className="products_price">
                <span className="final_price">{newPrice}</span> &nbsp;
                <small>
                  <del className="old_price">{oldPrice}</del>
                </small>
              </h2>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FeaturedSlider;