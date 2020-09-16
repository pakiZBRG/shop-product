const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const { MONGO_URI } = require('./config');
const items = require("./routes/items");
const app = express();

app.use(express.json());

mongoose.connect(MONGO_URI, {useNewUrlParser: true,useUnifiedTopology: true,})
  .then(() => console.log("MongoDB Connected..."))
  .catch(() => console.log("MongoDB Error"));

//Use Routes
app.use("/api/items", items);

//If in Production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server connected on port ${port}`));