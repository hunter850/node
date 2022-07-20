require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsIm5hbWUiOiJLZXZpbiIsImlhdCI6MTY1ODMwMjA3Mn0.9kiU5-7ZHzoiazKG9HxTytD-jbESTA7ooXZVuxdjVEI";
jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if(error) {
        console.log(error);
        process.exit();
    }
    console.log(decoded);
    process.exit();
});
