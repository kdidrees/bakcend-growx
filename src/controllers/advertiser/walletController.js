const WalletModel = require("../../models/advertiser/walletModel");

 
exports.addWallet = async (req, res) => {
  const data = req.body;
  // console.log(data.user_id);
  const data_come = {
    user_id: data.user_id,
    amount: data.amount,
  };
  try {
    const findId = await WalletModel.findOne({ user_id: data.user_id });
    if (findId) {
      const amount = parseInt(findId.amount) + parseInt(data.amount);
      // console.log(amount);
      const ress = await WalletModel.findByIdAndUpdate(findId._id, {
        amount: amount,
      });
      // console.log(ress);
      if (ress) {
        res.json({
          status: "success",
          message: "Wallet updated sucessfully",
          data: ress,
        });
      } else {
        res.json({
          status: "fail",
        });
      }
    } else {
      const ress = await WalletModel.create(data_come);
      // console.log(ress);
      if (ress) {
        res.json({
          status: "success",
          message: "Wallet added sucessfully",
          data: ress,
        });
      } else {
        res.json({
          status: "fail",
        });
      }
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
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const ress = await WalletModel.findOne({ user_id: userId });
    if (ress) {
      res.json({
        status: "success",
        message: "Wallet get sucessfully",
        data: ress,
      });
    } else {
      res.json({
        status: "fail",
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
exports.updateWallet = async (req, res) => {
  const data = req.body;
 
  try {
    const data_come = {
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      status: data.status,
      date: data.date,
    };
    const res = await WalletModel.findByIdAndUpdate(data.id, data_come);
   
    if (res) {
      res.json({
        status: "success",
        message: "Wallet updated sucessfully",
        data: res,
      });
    } else {
      res.json({
        status: "fail",
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