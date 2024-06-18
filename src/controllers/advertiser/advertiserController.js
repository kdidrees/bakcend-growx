const AdvertiserModal = require("../../models/advertiser/advertiserModel");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken");
const { isValidPassword, htmlFile, generateUniqueSignupID } = require("../../utils/password");
const ManagerModal = require("../../models/manager/managerModel");
const CampaignStoreModel = require("../../models/advertiser/campaignModel");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const EMAIL = process.env.NODE_EMAIL;
const PASSWORD = process.env.NODE_EMAIL_PASSWORD;

exports.advertiserLogin = async (req, res) => {
    try {
        const data = req.body;
        console.log(data,"login")
        const data_come = {
            email: data.email,
            password: data.password,
        };
        const ress = await AdvertiserModal.findOne({ email: data_come.email });



        const isValid = isValidPassword(data_come.password, ress.password);
        if (isValid) {
            const token = jwt.sign({ id: ress._id }, JWT_SECRET_KEY);
            res.json({
                status: "success",
                message: "login sucessfully",
                data: ress,
                token: token,
            });
        } else {
            res.json({
                status: "fail",
                message: "password is not correct",
            });
        }

    } catch (error) {
        const resError = {};
        resError.status = "failed";
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            resError.error = errors;
        }
        res.json(resError);
    }
};

exports.advertiserSignup = async (req, res) => {
    try {
        const data = req.body;
        console.log(data,"advertiser")
        const allManagerForAdvertiser = await ManagerModal.find({});

        const managerId = allManagerForAdvertiser.map((manager) => manager._id)
        const managerIdIndex = Math.floor(Math.random() * managerId.length);
        const managerIdForAdvertiser = managerId[managerIdIndex];
        const newCampaignStore = await CampaignStoreModel.create({ advertiserId: null });

        const idd = []
        let uniqu = generateUniqueSignupID(idd);

        let allAdvertiser = await AdvertiserModal.find({ uniqueID: uniqu });


        while (allAdvertiser.length > 0) {
            uniqu = generateUniqueSignupID(idd);
            allAdvertiser = await AdvertiserModal.find({ uniqueID: uniqu });
        }



        const data_come = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            userName: data.userName,
            password: data.password,
            messengerType: data.messengerType,
            messengerAccount: data.messengerAccount,
            managerId: managerIdForAdvertiser,
            campaignStore: newCampaignStore._id,
            uniqueID: uniqu
        };
        const newAdvertiser = await AdvertiserModal.create(data_come);

        newCampaignStore.advertiserId = newAdvertiser._id
        await newCampaignStore.save()
        if (newAdvertiser) {
            res.json({
                status: "success",
                message: "signup sucessfully",
                data: newAdvertiser,
            });
        } else {
            res.json({
                status: "failed",
                message: "signup failed",
            });
        }
    } catch (error) {
        console.log(error,"error");
        const resError = {};
        resError.status = "failed";
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            
            resError.error = errors;
           
        }
        else if (error.name === "MongoError" && (error.code === 11000 || error.code === 11001)) {
            resError.error = "Duplicate key error: " + error.message;
        }
         console.log(resError,"error")
        res.json(resError);
    }
};

exports.advertiserForgetPassword = async (req, res) => {
    try {
        const data = req.params.email;

        const findname = await AdvertiserModal.findOne({ email: data })

        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: EMAIL,
                pass: PASSWORD
            },
            secure: true
        })

        const mailData = {
            from: EMAIL,
            to: data,
            subject: "Password Reset Link",
            html: htmlFile(data, findname.fullName)
        }

        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        }
        )
        res.json({
            status: "success",
            message: "Email Sent"
        })



    } catch (error) {

    }
}

exports.updatePassword = async (req, res) => {
    try {

        const data = req.params.email;
        const password = req.body.password

        const salt = bcrypt.genSaltSync(10);
        const UpdatedPassword = bcrypt.hashSync(password, salt);

        let findById = await AdvertiserModal.findOneAndUpdate({ email: data }, { password: UpdatedPassword })

        if (findById) {
            res.json({
                status: "success",
                message: "password change successfully"
            })
        } else {
            res.json({
                status: "fail"
            })
        }


    }
    catch (err) {
        console.log(err);
    }
}

exports.getAllEmail = async (req, res) => {
    try {
        const data = req.params.email

        const ress = await AdvertiserModal.findOne({ email: data })

        if (ress) {
            res.json({
                status: "success"
            })
        } else {
            res.json({
                status: "fail"
            })
        }
    } catch (error) {

    }


}

