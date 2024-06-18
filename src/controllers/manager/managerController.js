const ManagerModal = require("../../models/manager/managerModel");

const jwt = require("jsonwebtoken");
const { isValidPassword } = require("../../utils/password");
const AdvertiserModal = require("../../models/advertiser/advertiserModel");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.managerLogin = async (req, res) => {
  try {
    const data = req.body;
    const data_come = {
      email: data.email,
      password: data.password,
    };
    let ress = await ManagerModal.findOne({ email: data_come.email });
    console.log(ress);

    // image path set

    ress.profilePic = `http://localhost:1337/image/${ress.profilePic}`;

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

exports.managerSignup = async (req, res) => {
  try {
    const data = req.body;
    const file = req.image_path;

    const data_come = {
      fullName: data.fullName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      skipeId: data.skipeId,
      profilePic: file,
      whatsapp: data.whatsapp,
      message: data.message,
      linkedIn: data.linkedIn,
      telegram: data.telegram,
    };

    const ress = await ManagerModal.create(data_come);
    if (ress) {
      res.json({
        status: "success",
        message: "signup sucessfully",
        data: ress,
      });
    } else {
      res.json({
        status: "fail",
        message: "signup fail",
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

exports.mangerLoginDetail = async (req, res) => {
  try {
    const mangerId = req.user.id;
    const allAdvertiser = await AdvertiserModal.find({ managerId: mangerId });

    if (allAdvertiser.length > 0) {
      res.json({
        status: "success",
        data: allAdvertiser,
      });
    } else {
      res.json({
        status: "failed",
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

exports.goToAdvertiser = async (req, res) => {
  try {
    const userId = req.params.id;

    const forverding = await AdvertiserModal.findOne({ _id: userId });

    if (forverding) {
      const token = jwt.sign({ id: forverding._id }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({
        status: "success",
        data: forverding,
        token: token,
        navigator: `http://localhost:3002/${token}`,
      });
    } else {
      res.json({
        status: "failed",
      });
    }
  } catch (error) {}
};
