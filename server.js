const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex')({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });


// spiderWebb
const register = require("./spiderWebb/register");
const image = require("./spiderWebb/image");
const profile = require("./spiderWebb/profile");
const signin = require("./spiderWebb/signin");

const app = express();

app.use(cors({
  origin: 'https://face-detector-e2hi.onrender.com'
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello, this is the API of my face detection app");
});

app.post("/signin", signin.handleSignin(knex, bcrypt));
app.post("/register", (req, res) => { register.handleRegister(req, res, knex, bcrypt) });
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, req.params.id, knex)});
app.post("/imageUrl", (req, res) => { image.handleImage(req, res, req.body.name, req.body.email, req.body.id, knex)});

app.listen(process.env.PORT || 5172, () => {
  console.log(`Currently listening on port ${process.env.PORT}`);
});
