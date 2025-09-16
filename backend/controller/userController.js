const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const sendJWtToken = require("../utils/JwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Remove cloudinary import for now
// const cloudinary = require("cloudinary");

// signUp controller - MODIFIED to work without Cloudinary
exports.registerUser = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Create user with default avatar
  const user = await userModel.create({
    name,
    password,
    email,
    avatar: {
      public_id: "default_avatar",
      url: "https://via.placeholder.com/150/000000/FFFFFF?text=User",
    },
  });

  sendJWtToken(user, 201, res);
});

// ...existing code...

// Update Profile - MODIFIED to work without Cloudinary
exports.updateProfile = asyncWrapper(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Comment out avatar update for now
  // if (req.body.avatar !== "") {
  //   const user = await userModel.findById(req.user.id);
  //   const imageId = user.avatar.public_id;
  //   await cloudinary.v2.uploader.destroy(imageId);
  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "Avatar",
  //     width: 150,
  //     crop: "scale",
  //   });
  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// ...existing code...