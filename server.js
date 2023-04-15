const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(
    cors({
      origin: ["https://pensionbox.onrender.com", "http://localhost:3000"],
      credentials: true,
    })
  );


//Route Middleware
app.use("/api/users", userRoute);

//Routes
app.get("/", (req,res) => {
    res.send("Home Page")
})

// Error Middleware
app.use(errorHandler);

//connection to DB
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on ${PORT}`)
        })
    })
    .catch((err) => {console.error(err)})