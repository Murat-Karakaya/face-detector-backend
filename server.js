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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello")
  //knex.select('name', 'entries', 'joined').from('users').then(data => res.json(data))
});

app.post("/signin", signin.handleSignin(knex, bcrypt));
app.post("/register", (req, res) => { register.handleRegister(req, res, knex, bcrypt) });
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, req.params.id, knex)})
app.put("/image", (req, res) => { image.handleImage(req, res, req.body.id, knex)});
app.post("/imageUrl", (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 5172, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
