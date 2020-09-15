const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const items = require("./routes/items");
const app = express();

app.use(express.json());

mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true,})
  .then(() => console.log("MongoDB Connected..."))
  .catch(() => console.log("MongoDB Error"));

//Use Routes
app.use("/api/items", items);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server connected on port ${port}`));