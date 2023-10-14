require('dotenv').config();

const express = require('express');

const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const { isActiveRoute } = require('./server/helpers/routeHelpers')
// helps us use the update post option 
const methodOverride = require('method-override')
const app = express();
const PORT = 3000 || process.env.PORT;



connectDB();

//Middlewares
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'Shivansh07',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))

// for passing the data to api calls post call
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.locals.isActiveRoute = isActiveRoute;


//Templating engine

app.use(expressLayout);
// it is helping to render the main.ejs
app.set('layout' , './layouts/main');
app.set('view engine' , 'ejs');




// app.get('' , (req , res) =>{

//     res.send("Server is working");
// });

// get is replaced with this

app.use('/' , require('./server/routes/main'));
app.use('/' , require('./server/routes/admin'));

app.listen(PORT , ()=>{

    console.log(`App listening on port ${PORT}`);
})