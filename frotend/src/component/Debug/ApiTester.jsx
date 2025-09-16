import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./ApiTester.css";

const ApiTester = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState("");
  const history = useHistory();

  // Function to fetch all products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/product?keyword=&page=1&price[gte]=0&price[lte]=100000&ratings[gte]=0");
      setResponse(data);
      console.log("Direct API response:", data);
    } catch (err) {
      setError(err.message);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single product by ID
  const fetchProductById = async () => {
    if (!productId.trim()) {
      alert("Please enter a product ID");
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/${productId}`);
      setResponse(data);
      console.log("Single product response:", data);
    } catch (err) {
      setError(err.message);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products on initial load
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="api-tester-container">
      <h2>API Tester</h2>
      
      <div className="api-actions">
        <button onClick={fetchAllProducts} disabled={loading}>
          Fetch All Products
        </button>
        
        <div className="product-id-search">
          <input 
            type="text" 
            placeholder="Enter Product ID" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button onClick={fetchProductById} disabled={loading}>
            Fetch Single Product
          </button>
        </div>
        
        <button onClick={() => history.push("/")} className="back-btn">
          Back to Home
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="response-container">
          <div className="response-summary">
            <p><strong>API Status:</strong> {response ? "Success" : "Empty response"}</p>
            <p><strong>Products Count:</strong> {response?.productsCount || 0}</p>
            <p><strong>Results Per Page:</strong> {response?.resultPerPage || 0}</p>
            <p><strong>Products Length:</strong> {response?.products?.length || 0}</p>
          </div>
          
          <h3>Raw API Response:</h3>
          <pre className="response-data">
            {JSON.stringify(response, null, 2)}
          </pre>
          
          {response?.products && response.products.length > 0 && (
            <div className="first-product">
              <h3>First Product Structure:</h3>
              <pre className="response-data">
                {JSON.stringify(response.products[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTester;
