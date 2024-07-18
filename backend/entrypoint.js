require("dotenv").config();
require("./database");
console.log("mode recieved",process.env.MODE);
if(process.env.MODE === "consumer"){
    console.log("consumer mode");
    require("./consumer");
}else{
    require("./server");
}
