const Person = require("./04.class");

class Employee extends Person {
    constructor(name = "", age = 10, employee_id) {
        super(name, age);
        this.employee_id = employee_id;
    }
    toJSON() {
        const {name, age, employee_id} = this;
        return {name, age, employee_id};
    }
}

module.exports = Employee;