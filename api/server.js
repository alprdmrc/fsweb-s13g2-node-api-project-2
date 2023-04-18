// server için gerekli olanları burada ayarlayın
const express = require("express");

const server = express();

server.use(express.json());

// posts router'ını buraya require edin ve bağlayın
const postRouter = require("./posts/posts-router");

server.use("/api/posts", postRouter);

server.get("*", (req, res) => {
  res.status(200).send("server up and running");
});

module.exports = server;
