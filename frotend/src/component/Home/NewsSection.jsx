import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "./NewsSection.css";

const newsData = [
  {
    id: 1,
    title: "New Tennis Equipment Collection Available",
    excerpt: "Discover our latest premium tennis rackets and gear for rent. Professional-grade equipment from top brands now available.",
    link: "/news/tennis-collection",
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "Special Discount on Padel Gear",
    excerpt: "Get 20% off on all padel equipment rentals this month. Perfect time to try out premium padel rackets and accessories.",
    link: "/news/padel-discount",
    date: "March 12, 2024"
  },
  {
    id: 3,
    title: "Libati Reaches 25,000+ Happy Customers",
    excerpt: "We're celebrating a major milestone with our growing community of sports enthusiasts across the region.",
    link: "/news/milestone",
    date: "March 10, 2024"
  },
  {
    id: 4,
    title: "New Location Opening Soon",
    excerpt: "Expanding our services with a new pickup location in downtown. Making equipment rental even more convenient.",
    link: "/news/new-location",
    date: "March 8, 2024"
  },
  {
    id: 5,
    title: "Professional Tennis Tournament Partnership",
    excerpt: "Proud to be the official equipment rental partner for the upcoming regional tennis championship.",
    link: "/news/tournament",
    date: "March 5, 2024"
  },
  {
    id: 6,
    title: "Sustainable Sports Initiative",
    excerpt: "Learn about our commitment to reducing sports equipment waste through our rental model and recycling programs.",
    link: "/news/sustainability",
    date: "March 3, 2024"
  }
];

// Duplicate the array for infinite scroll effect
const infiniteNewsData = [...newsData, ...newsData];

const NewsSection = () => {
  const newsItems = [
    "🎾 New Tennis Equipment Available",
    "🏓 Padel Rackets 30% Off",
    "⚡ Flash Sale This Weekend", 
    "🏆 Professional Grade Equipment",
    "🎯 Book Now Pay Later Option",
    "🚀 Same Day Delivery Available",
    "🔥 Limited Time Offers",
    "⭐ 5-Star Customer Reviews",
  ];

  return (
    <section className="news-section">
      <div className="news-container">
        <h2 className="news-heading">Latest Updates</h2>
        
        <div className="news-scroll-wrapper">
          <div className="news-cards">
            {infiniteNewsData.map((item, index) => (
              <div key={`${item.id}-${index}`} className="news-card">
                <div className="news-card-content">
                  <span className="news-badge">NEWS</span>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-excerpt">{item.excerpt}</p>
                  <Link to={item.link} className="news-link">
                    Read More <ArrowForwardIcon style={{ fontSize: '16px' }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="news-ticker-container">
        <div className="news-ticker-content">
          {/* Duplicate the items to create seamless loop */}
          {[...newsItems, ...newsItems].map((item, index) => (
            <span key={index} className="news-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
