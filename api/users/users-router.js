const express = require("express");

const userModel = require("./users-model");
const postModel = require("../posts/posts-model");
const mw = require("../middleware/middleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let allUsers = await userModel.get();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", mw.validateUserId, (req, res, next) => {
  try {
    res.json(req.currentUser);
  } catch (error) {
    next(error);
  }
});

router.post("/", mw.validateUser, async (req, res, next) => {
  try {
    const insertedUser = await userModel.insert({ name: req.body.name });
    res.status(201).json(insertedUser);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  mw.validateUserId,
  mw.validateUser,
  async (req, res, next) => {
    try {
      let updatedUser = await userModel.update(req.params.id, {
        name: req.body.name,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", mw.validateUserId, async (req, res, next) => {
  try {
    let deletedUser = await userModel.remove(req.params.id);
    res.status(200).json({ message: "Başarıyla silindi" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", mw.validateUserId, async (req, res, next) => {
  try {
    let userPosts = await userModel.getUserPosts(req.params.id);
    res.status(200).json(userPosts);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/posts",
  mw.validateUserId,
  mw.validatePost,
  async (req, res, next) => {
    try {
      let newPost = await postModel.insert({
        user_id: req.params.id,
        text: req.body.text,
      });
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
