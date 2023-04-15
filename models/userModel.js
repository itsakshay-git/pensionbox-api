const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add a name"]
    },
    email: {
        type: String,
        require: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        require: [true, "Please add a name"],
        minLength: [6, "Password must be up to 6 characters"],
        // maxLength: [23, "Password must not be more then 23 characters"],

    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default:"https://unsplash.com/photos/s-aRz4D_b5I"
    },
    phone: {
        type: String,
        default:"+91"
    },
    bio: {
        type: String,
        maxLength: [250, "Password must not be more then 250 characters"],
        default:"bio"
    }
},{
    timestamps: true
});

//Encrypt password before saving to DB
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User;