const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

//routes

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/create", (req, res) => {
  res.render("campgrounds/create");
});

app.post("/campgrounds", async (req, res) => {
  const campo = new Campground(req.body.campground);
  await campo.save();
  res.redirect(`campgrounds/${campo._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campgroundShow = await Campground.findById(id);
  res.render("campgrounds/show", { campgroundShow });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campgroundEdit = await Campground.findById(id);
  res.render("campgrounds/edit", { campgroundEdit });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const editCamp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${editCamp._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCamp = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds/");
});

app.listen(3001, () => {
  console.log("Listening on Port 3001");
});
