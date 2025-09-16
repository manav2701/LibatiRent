const express  = require("express");
const router  = express.Router();

const { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductDetails, 
  getProductReviews, 
  deleteReview, 
  createProductReview, 
  getAdminProducts,
  checkAvailability,
  getProductFilters
} = require("../controller/productController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");
 
router.route("/product").get(getAllProducts);
router.route("/admin/product/new").post(isAuthentictedUser, authorizeRoles("admin"), createProduct);
router.route("/admin/products").get(isAuthentictedUser, authorizeRoles("admin"), getAdminProducts); // Changed function name
router.route("/admin/product/:id") 
  .put(isAuthentictedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthentictedUser, authorizeRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review/new").put(isAuthentictedUser, createProductReview);
router.route("/reviews").get(getProductReviews);
router.route("/product/reviews/delete").delete(isAuthentictedUser, authorizeRoles("admin"), deleteReview);
router.route("/products/filters").get(getProductFilters);
// Rental availability check
router.route("/products/check-availability").post(checkAvailability);


module.exports = router;