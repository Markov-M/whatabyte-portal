/**
 * Required External Modules
 */

const express = require("express") 
const path = require("path") 

/**
 * App Variables
 */

const app = express()                       //créer une instance d'une application Express, que vous stockez ensuite dans app
const port = process.env.PORT || "8000"    // Défnir le port que le serveur utilisera pour écouter les demandes

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"))  //indique à Express quel répertoire il doit utiliser comme source de fichiers de modèles de visualisation
                                                 //path.join : méthode, qui crée un chemin de fichier multi-plateforme
app.set("view engine", "pug")                  // indique à Express quel moteur de gabarit utiliser, qui dans ce cas, est pug
                                                //npm i -D browser-sync : Pour rafraichir automatiquement le browser pendant le développement
app.use(express.static(path.join(__dirname, "public")))  //path.join(__dirname, "public")` renvoie le chemin absolu du dossier `public`

/**
 * Routes Definitions
 **/

app.get("/", (req, res) => {
    res.render("index", { title: "Accueil" });
  });

  app.get("/user", (req, res) => {
    res.render("user", { title: "Profile" , userProfile: { nickname:"Auth0" } });
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