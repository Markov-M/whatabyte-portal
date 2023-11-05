/**
 * Required External Modules
 */

const express = require("express") 
const path = require("path") 

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();
const authRouter = require("./auth");

/**
 * App Variables
 */

const app = express()                       //créer une instance d'une application Express, que vous stockez ensuite dans app
const port = process.env.PORT || "8000"    // Défnir le port que le serveur utilisera pour écouter les demandes


/**
 * Session Configuration (New!)
 */
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}







/**
 * Passport Configuration (New!)
 */

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);


/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"))  //indique à Express quel répertoire il doit utiliser comme source de fichiers de modèles de visualisation
                                                 //path.join : méthode, qui crée un chemin de fichier multi-plateforme
app.set("view engine", "pug")                  // indique à Express quel moteur de gabarit utiliser, qui dans ce cas, est pug
                                                //npm i -D browser-sync : Pour rafraichir automatiquement le browser pendant le développement
app.use(express.static(path.join(__dirname, "public")))  //path.join(__dirname, "public")` renvoie le chemin absolu du dossier `public`

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creating custom middleware with Express
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Router mounting
app.use("/", authRouter);


/**
 * Routes Definitions
 **/
/////////SECURITY
const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};
////////DEFINED ROUTES
app.get("/", (req, res) => {
    res.render("index", { title: "Accueil" });
  });

  app.get("/user", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("user", {
       title: "Profile" , 
       userProfile: userProfile
   });
   
  });


  

/*
app.get("/", (req, res) => {
    res.status(200).send("WHATABYTE: Food For Devs") 
  }) 
*/
  


/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Démmarage de l'app web sur http://localhost:${port}`) 
  }) 