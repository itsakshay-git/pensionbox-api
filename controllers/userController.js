const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const orders = [
  {
    orderId: '1',
    vendorName: 'Vendor A',
    pickupDate: '2023-04-15',
    status: 'Shipped',
  },
  {
    orderId: '2',
    vendorName: 'Vendor B',
    pickupDate: '2023-04-16',
    status: 'Pending',
  },
  {
    orderId: '3',
    vendorName: 'Vendor C',
    pickupDate: '2023-04-17',
    status: 'Cancelled',
  },
  {
    orderId: '4',
    vendorName: 'Vendor D',
    pickupDate: '2023-04-18',
    status: 'Shipped',
  },
  {
    orderId: '5',
    vendorName: 'Vendor E',
    pickupDate: '2023-04-19',
    status: 'Pending',
  },
  {
    orderId: '6',
    vendorName: 'Vendor F',
    pickupDate: '2023-04-20',
    status: 'Cancelled',
  },
  {
    orderId: '7',
    vendorName: 'Vendor G',
    pickupDate: '2023-04-21',
    status: 'Shipped',
  },
  {
    orderId: '8',
    vendorName: 'Vendor H',
    pickupDate: '2023-04-22',
    status: 'Pending',
  },
  {
    orderId: '9',
    vendorName: 'Vendor I',
    pickupDate: '2023-04-23',
    status: 'Cancelled',
  },
  {
    orderId: '10',
    vendorName: 'Vendor J',
    pickupDate: '2023-04-24',
    status: 'Shipped',
  },
  {
    orderId: '11',
    vendorName: 'Vendor K',
    pickupDate: '2023-04-25',
    status: 'Pending',
  },
  {
    orderId: '12',
    vendorName: 'Vendor L',
    pickupDate: '2023-04-26',
    status: 'Cancelled',
  },
  {
    orderId: '13',
    vendorName: 'Vendor M',
    pickupDate: '2023-04-27',
    status: 'Cancelled',
  },
  {
    orderId: '14',
    vendorName: 'Vendor N',
    pickupDate: '2023-04-27',
    status: 'Shipped',
  },
  {
    orderId: '15',
    vendorName: 'Vendor O',
    pickupDate: '2023-04-28',
    status: 'Pending',
  },
  {
    orderId: '16',
    vendorName: 'Vendor P',
    pickupDate: '2023-04-29',
    status: 'Cancelled',
  },
  {
    orderId: '17',
    vendorName: 'Vendor Q',
    pickupDate: '2023-04-30',
    status: 'Shipped',
  },
  {
    orderId: '18',
    vendorName: 'Vendor R',
    pickupDate: '2023-04-30',
    status: 'Pending',
  },
  {
    orderId: '19',
    vendorName: 'Vendor S',
    pickupDate: '2023-04-30',
    status: 'Cancelled',
  },
  {
    orderId: '20',
    vendorName: 'Vendor T',
    pickupDate: '2023-04-31',
    status: 'Shipped',
  },
  {
    orderId: '21',
    vendorName: 'Vendor U',
    pickupDate: '2023-04-32',
    status: 'Pending',
  },
  {
    orderId: '22',
    vendorName: 'Vendor V',
    pickupDate: '2023-04-32',
    status: 'Cancelled',
  },
];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Resister User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);

  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //one day
    sameSite: "none",
    secure: true,
    sameSite: 'none'
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  // res.send("Login user")
  const { email, password } = req.body;

  //Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Plese add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please singup");
  }

  // User exist, check if password is correct

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

    //Generate Token
    const token = generateToken(user._id);

    //send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //one day
      sameSite: "none",
      secure: true,
      sameSite: 'none'
    });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});



// Logout User
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
        sameSite: 'none'
      });

      return res.status(200).json({message: "Successfully Logged Out"})
});


// Get User Data
const getUser = asyncHandler(async (req, res) => {
    if (orders) {
      orders.map((user) => {
        // const {  orderId, vendorName, pickupDate, status} = user;
        // res.status(200).json([{
        //   orderId,
        //   vendorName,
        //   pickupDate,
        //   status,
        // }]);
        res.status(200).json(orders)
      })
      } else {
        res.status(400);
        throw new Error("User Not Found");
      }
})

const getPaginaredUser = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=orders.length;
  results.pageCount=Math.ceil(orders.length/limit);

  if (lastIndex < orders.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = orders.slice(startIndex, lastIndex);
  res.json(results)
})

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if(!token){
    return res.json(false) 
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  if(verified) {
    return res.json(true)
  }
  return res.json(false)
});


// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const {oldPassword, password} = req.body
  
  if(!user){
    res.status(400);
    throw new Error("User not found, please signup")
  }

  // Validate
  if(!oldPassword || !password){
    res.status(400);
    throw new Error("Please add old and new password")
  }

  // Check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)


  if(user && passwordIsCorrect){
    user.password = password
    await user.save()
    res.status(200).send("Password change successfull")
  }else{
    res.status(400);
    throw new Error("Old password is incorrect");
  }
})

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body
  const user = await User.findOne({email})

  if(!user){
    res.status(404)
    throw new Error("User does not exist")
  }

  // Delete token if its exists in DB
  let token = await Token.findOne({userId: user._id})
  if(token) {
    await token.deleteOne()
  }

  // Create Reste Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  console.log(resetToken)

  // Hash token before saving to DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000) // Thirty minutes
  }).save()

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

  // Reset Email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <p>This reset link is valid for only 30 minutes</p>
  <a href=${resetUrl} clicktracking=off >${resetUrl}</a>
  <p>Regards...</p>
  <p>invent Team</p>`;

  const subject = "Password Reset Request"
  const send_to = user.email
  const send_from = process.env.EMAIL_USER

  try {
    await sendEmail(subject, message, send_to, send_from)
    res.status(200).json({success: true, message: "Reset Email Send"})
  } catch (error) {
    res.status(500)
    throw new Error("Email not sent, please try again")
  }
})


// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  changePassword,
  forgotPassword,
  resetPassword,
  getPaginaredUser
};
