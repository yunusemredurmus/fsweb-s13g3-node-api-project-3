const userModel = require("../users/users-model");

function logger(req, res, next) {
  let reqMethod = req.method;
  let reqUrl = req.originalUrl;
  let timestamp = new Date().toLocaleString();
  console.log(`${timestamp} - ${reqMethod} - ${reqUrl}`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    let existUser = await userModel.getById(req.params.id);
    if (!existUser) {
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
    } else {
      req.currentUser = existUser;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Hata oluştu" });
  }
}

function validateUser(req, res, next) {
  try {
    let { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Gerekli name alanı eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

function validatePost(req, res, next) {
  try {
    let { text } = req.body;
    if (!text) {
      res.status(400).json({ message: "Gerekli text alanı eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateUserId,
  validateUser,
  validatePost,
  logger,
};
