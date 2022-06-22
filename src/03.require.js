const {Square, Cub} = require("./02.exports");
const {Square: twoTimes, Cub: threeTimes} = require("./02.exports");

//require只要引入一次 就會保留記憶體位置 所以hello world才會只印一次 而不是兩次

console.log(Square(2));
console.log(Cub(3));
console.log(twoTimes(4));
console.log(threeTimes(5));