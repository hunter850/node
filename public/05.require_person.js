const Person = require("./04.class");

const person1 = new Person("David", 24);
const person2 = new Person("Frank");
const person3 = new Person("Alex", 18);

//使用JSON.stringify會呼叫該class的toJSON函式

console.log(person1);
console.log(person2);
console.log(JSON.parse(JSON.stringify(person3)));