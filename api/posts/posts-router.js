// posts için gerekli routerları buraya yazın
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

//1
router.get("/", async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

//2
router.get("/:id", async (req, res) => {
  try {
    const idPost = await Posts.findById(req.params.id);
    if (idPost) {
      res.status(200).json(idPost);
    } else
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

//3
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  try {
    if (title && contents) {
      const addedPostId = await Posts.insert({
        title: title,
        contents: contents,
      });
      const addedPost = await Posts.findById(addedPostId.id);
      res.status(201).json(addedPost);
    } else {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

//4
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  try {
    const post = await Posts.findById(id);
    if (post) {
      if (title && contents) {
        await Posts.update(id, {
          title: title,
          contents: contents,
        });
        // console.log(updatePostResult);
        const updatedPost = await Posts.findById(id);
        res.status(200).json(updatedPost);
      } else {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      }
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const postToBeDeleted = await Posts.findById(id);
    if (postToBeDeleted) {
      await Posts.remove(id);
      res.status(200).json(postToBeDeleted);
    } else {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Posts.findById(postId);
    if (post) {
      const comments = await Posts.findPostComments(postId);
      res.status(200).json(comments);
    } else
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
