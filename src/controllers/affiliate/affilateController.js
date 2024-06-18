const AffiliateModal = require("../../models/affiliate/affiliateModal");
const { isValidPassword } = require("../../utils/password");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;



exports.affiliateLogin = async (req, res) => {
  try {
    const data = req.body;
    const data_come = {
      email: data.email,
      password: data.password,
    };
    const ress = await AffiliateModal.findOne({ email: data_come.email });
    if (ress) {
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
    } else {
      res.json({
        status: "fail",
        message: "email is not correct",
      });
    }
  } catch (error) {
    console.log(error);
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

exports.affiliateSignup = async (req, res) => {
  try {
    const data = req.body;

    const data_come = {
      fullName: data.fullName,
      userLogin: data.userLogin,
      email: data.email,
      password: data.password,
      messenger: data.messenger,
      messengerDetails: data.messengerDetails,
      paymentMethod: data.paymentMethod,
      // company: data.company,
    };

    const ress = await AffiliateModal.create(data_come);
    if (ress) {
      res.json({
        status: "success",
        message: "signup sucessfully",
        data: ress,
      });
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {
    console.log(error);

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

// Affiliate Auth
