import express from "express";
import usersController from "./routes/users";
import pingController from "./routes/pong";
import bodyParser from "body-parser";
import postsController from "./routes/posts";

const app = express();

const PORT = 3000;

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/ping", pingController);

app.use("/api/users", usersController);
app.use("/api/posts", postsController);

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
