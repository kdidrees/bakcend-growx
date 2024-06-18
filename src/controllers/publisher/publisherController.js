const PublisherModal = require("../../models/publisher/publisherModal");
const jwt = require("jsonwebtoken");
const { isValidPassword, generateUniqueSignupID } = require("../../utils/password");
const ManagerModal = require("../../models/manager/managerModel");
const SiteStoreModal = require("../../models/publisher/siteModal");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
 



exports.publisherLogin = async (req, res) => {
  try {
    const data = req.body;
    const data_come = {
      email: data.email,
      password: data.password,
    };
    const publisherUser = await PublisherModal.findOne({ email: data_come.email });
    if (publisherUser) {
      const isValid = isValidPassword(data_come.password,publisherUser.password);
      if (isValid) {
        const { id,userName,email } = publisherUser;
        const data={id,userName,email}
        const token = jwt.sign({ id,userName }, JWT_SECRET_KEY);
        res.json({
          status: "success",
          message: "login sucessfully",
          data: data,
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

exports.publisherSignup = async (req, res) => {
  try {
    const data = req.body;
   console.log(data,"data")
    

    let managerIdForAdvertiser = await ManagerModal.find({})
    let manager = managerIdForAdvertiser.map((ele) => ele._id)
    let randomNumber = Math.floor(Math.random() * manager.length);
    let managerIdForPublisher = manager[randomNumber]


 
const id = []
    let funcUnique = generateUniqueSignupID(id)

    let findPublisher = await PublisherModal.find({uniqueID:funcUnique})
    
    while(findPublisher.length>0){
      funcUnique = generateUniqueSignupID(6)
      findPublisher = await PublisherModal.find({uniqueID:funcUnique})
    }


    let siteStoreCreate = await SiteStoreModal.create({publisherId:null})

    const data_come = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userName: data.userName,
      password: data.password,
      messengerType: data.messengerType,
      messengerAccount: data.messengerAccount,
      managerId: managerIdForPublisher,
      uniqueID: funcUnique,
      siteStore:siteStoreCreate._id
    };





    const ress = await PublisherModal.create(data_come);
    siteStoreCreate.publisherId = ress._id
    await siteStoreCreate.save()
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

exports.getProfile=async(req,res)=>{
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded) {
      publisherUser = decoded;
      res.json({
        status: "success",
        data: publisherUser,
      });
    } else {
      res.json({
        success: false,
        message: "Unothorization token",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Unothorization token",
    });
  }
  
  
}
 