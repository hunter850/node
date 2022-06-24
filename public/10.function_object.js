const funcObject = () => {
    return console.log("hello funciton");
}

funcObject.method = () => {
    console.log("hello method");
}

funcObject();
funcObject.method();