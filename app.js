import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import sequelize from "./config/database.js";
import "./models/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);


app.use((req, res, next) => {
  res.locals.admin = req.session.admin || null;
  next();
});

app.use("/", routes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});


app.use(errorHandler);

try {
  await sequelize.authenticate();
  console.log("Database connected.");

  await sequelize.sync({ alter: true });
  console.log("Models synchronized.");
} catch (error) {
  console.error("Database connection failed:", error);
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});