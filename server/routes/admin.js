const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

const jwtSecret = process.env.JWT_SECRET;

// CHeck login middleware

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "unauthorized" });
  }
};

//Get for Admin login page

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog Created using NodeJS, Express and MongoDB.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

// POST route for check login admin

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

// GET Dashboard

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Blog created using Nodejs",
    };
    const data = await Post.find();

    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// GET Dashboard
// Add-post

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Blog created using Nodejs",
    };
    const data = await Post.find();

    res.render("admin/add-post", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// POST Dashboard
//POST REquest Add-post

router.post("/add-post", authMiddleware, async (req, res) => {
  const { title, body } = req.body;
  try {
    console.log(req.body);

    try {
      const newPost = new Post({
        title: title,
        body: body,
      });

      await Post.create(newPost);
    } catch (error) {
      console.log(error);
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});


// Get Dashboard
// Edit Post

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Blog created using Nodejs",
          };
        const data = await Post.findOne({ _id: req.params.id});

        res.render('admin/edit-post' , {locals ,data , layout: adminLayout});
    } catch (error) {
      console.log(error);
    }
  });
  // PUT Dashboard
  // Edit Post
  
  router.put("/edit-post/:id", authMiddleware, async (req, res) => {
      try {
         
          await Post.findByIdAndUpdate(req.params.id,{
              title: req.body.title,
              body: req.body.body,
              updatedAt: Date.now()
          });
  
  
          res.redirect(`/edit-post/${req.params.id}`);
      } catch (error) {
        console.log(error);
      }
    });
  

      // DELETE Dashboard
  // Edit Post
  
  router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
       
        await Post.deleteOne({_id : req.params.id});
        res.redirect('/dashboard');


       
    } catch (error) {
      console.log(error);
    }
  });



  // GET ADMIN LOGOUT

  router.get('/logout' , (req,res) =>{
    res.clearCookie('token');
    res.redirect('/');
  })


// POST route for check login admin

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username: username,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User Created", user });
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }

      res.status(500).json({ message: "Internal Error" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
