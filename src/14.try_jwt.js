require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const token = jwt.sign({id:40, name: "Kevin"}, JWT_SECRET);

console.log(token);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsIm5hbWUiOiJLZXZpbiIsImlhdCI6MTY1ODMwMjA3Mn0.9kiU5-7ZHzoiazKG9HxTytD-jbESTA7ooXZVuxdjVEI