const express = require("express");
const mongoose = require("mongoose");
const app = express();


const transporter = require("./src/mail")

app.use(express.json())
const connect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/pagination");
}

// createing schema:
const userSchema = new mongoose.Schema({
    first_name: { type: String, require: true },
    gender: { type: String, require: true },
    email: { type: String, require: true },
},
    {
        versionKey: false,
        timestamp: true
    })

const User = mongoose.model("user", userSchema);

//admin Schema
const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    versionKey: false
})

const Admin = mongoose.model("admin", adminSchema);


app.get("/users", async (req, res) => {
    try {
        const page = req.query.page
        const pagesize = req.query.pagesize
        const skip = Math.ceil((page - 1) * pagesize)
        const userData = await User.find({}).skip(skip).limit(pagesize).lean().exec();
        return res.status(200).send(userData)
    } catch (error) {
        console.log(error)
    }
})

app.post("/users", async (req, res) => {
    try {
        const userpost = await User.create(req.body);
        // send mail with defined transport object
        transporter.sendMail({
            from: '"abcsystem" <abc@system.com>', // sender address
            to: `${userpost.email}`, // list of receivers
            subject: `Welcome to ABC system ${userpost.first_name} `, // Subject line
            text: `Hi ${userpost.first_name}, Please confirm your email address`, // plain text body

        });

        transporter.sendMail({
            from: '"abcsystem" <abc@system.com>', // sender address
            to: "lmaingot0@reference.com,ebunyan1@wordpress.org,ktumility2@boston.com,bcesconi3@fastcompany.com,mlinklet4@liveinternet.ru", // list of receivers
            subject:` ${userpost.first_name} has registered with us`, // Subject line
            text: `Please welcome ${userpost.first_name}`, // plain text body
            // html: "<b>`Hi ${first_name}, Please confirm your email address`</b>", // html body
          });

        res.status(200).send(userpost)
    } catch (error) {
        console.log(error)
    }
})


app.get("/admin", async (req, res) => {
    try {
        const admin = await Admin.find().lean().exec()

        return res.status(200).send(admin)

    } catch (err) {
        return res.status(500).send(err)
    }
})


app.post("/admin", async (req, res) => {
    try {
        const admin = await Admin.create(req.body)

        return res.status(200).send(admin)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.listen(3000, async () => {
    try {
        await connect();
    } catch (error) {
        console.log(error)
    }
    console.log("Listening to port 3000")
})