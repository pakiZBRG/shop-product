const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const config = require('config');
const db = config.get('mongoURI');
const app = express();

app.use(express.json());

mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(() => console.log("MongoDB Error"));

//Use Routes
app.use("/api/items", require("./routes/items"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

//If in Production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server connected on port ${port}`));