import express from "express";
import cors from "cors"
import "./auth.js"
import passport from "passport"
import session from "express-session"
import dotenv from "dotenv"

dotenv.config()


const app = express()
const router = express.Router()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json()) 

app.use(router)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(passport.initialize())  

app.use(passport.session())

// google authentication routes

app.get('/auth/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
));
  
app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
        successRedirect: 'http://localhost:5173/dashboard',
        failureRedirect: 'http://localhost:5173/',
}));


// facebook authentication routes

app.get('/auth/facebook',
    passport.authenticate('facebook',
        //  { scope: ['user_friends', 'manage_pages'] }
        ));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect: 'http://localhost:5173/dashboard',
        failureRedirect: 'http://localhost:5173/',
    }),
    );


app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user._json)
    }else{
        res.status(401).json({ message: "You are not logged in" })
    }
})


app.listen(3000, () => {
    console.log("Server is listening on Port 3000!");
    
})


