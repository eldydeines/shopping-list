const express = require("express")
const app = express();
const itemsRoutes = require("./routes/items")
const { ExpressError } = require("./expressError")

app.use(express.json());
app.use("/items", itemsRoutes);

// If no other route matches, respond with a 404 status code.
app.use((req, res, next) => {

  const e = new ExpressError("Page Not Found", 404);
  return next(e);

})

// Error handler
app.use(function (err, req, res, next) { //Note the 4 parameters!
  // the default status is 500 Internal Server Error

  let status = err.status || 500;
  let message = err.msg;

  // set the status and alert the user
  return res.status(status).json({ error: { message, status } });

});

module.exports = app;