const moment = require("moment-timezone");

const dateForm = "YYYY-MM-DD";
const dateTimeForm = "YYYY-MM-DD HH:mm:ss";

const toDateString = t => moment(t).format(dateForm);
const toDateTimeString = t => moment(t).format(dateTimeForm);

module.exports = {
    toDateString,
    toDateTimeString
};