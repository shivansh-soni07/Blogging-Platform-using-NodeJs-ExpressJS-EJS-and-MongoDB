const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//Routes

// GET ROUTE FOR HOME

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Simple Blog Created using NodeJS, Express and MongoDB.",
    };

    let perPage = 5;

    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", { 
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
     });
  } catch (err) {
    console.log(err);
  }
});



// GET ROUTE for POST _ID


router.get("/post/:id", async (req, res) => {
    try {
        
        
        let slug = req.params.id;
        
        const data = await Post.findById({_id : slug});
        const locals = {
          title: data.title,
          description: "Simple Blog Created using NodeJS, Express and MongoDB.",
        };

      res.render('post' , {locals , data , currentRoute:`/post/${slug}`});
     
    } catch (err) {
      console.log(err);
    }
  });



  // POST ROUTE FOR SEARCH

  // post = searchTerm
  
router.post("/search", async (req, res) => {
    try {
         
        const locals = {
          title: "Search",
          description: "Simple Blog Created using NodeJS, Express and MongoDB.",
        };


        let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        
        const data = await Post.find({

            $or: [
                { title: {$regex: new RegExp(searchNoSpecialChar , 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar , 'i')}}

            ]
        });
    // res.send(searchTerm);

    res.render('searchpage' , {locals , data ,currentRoute:`/search`});
     
    } catch (err) {
      console.log(err);
    }
  });
  

 

router.get("/about", (req, res) => {
  res.render("about" , {currentRoute:'/about'});
});

router.get("/contact", (req, res) => {
  res.render("contact" ,{currentRoute:'/contact'});
});



// function insertPostData (){

//     Post.insertMany(
//         [
//             {
//                 "title": "Building a Blog",
//                 "body": "This is a body text"
//             },
//             {
//                 "title": "Dummy Title 1",
//                 "body": "Dummy Body 1"
//             },
//             {
//                 "title": "Dummy Title 2",
//                 "body": "Dummy Body 2"
//             },
//             {
//                 "title": "Dummy Title 3",
//                 "body": "Dummy Body 3"
//             },
//             {
//                 "title": "Dummy Title 4",
//                 "body": "Dummy Body 4"
//             },
//             {
//                 "title": "Dummy Title 5",
//                 "body": "Dummy Body 5"
//             },
//             {
//                 "title": "Dummy Title 6",
//                 "body": "Dummy Body 6"
//             },
//              
//         ]

//     )
// }

// insertPostData();

module.exports = router;
