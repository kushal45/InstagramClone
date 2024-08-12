require("dotenv").config();
require("./database");
console.log("mode recieved",process.env.MODE);
// if(process.env.MODE === "consumer"){
//     console.log("consumer mode");
//     require("./consumer");
// }else{
//     require("./server");
// }
_fetchConfig()[process.env.MODE](); 


function _fetchConfig(){
    return {
        ["consumer"]:consumerConfig,
        ["server"]:serverConfig,
        ["connectorConsumer"]:connectorConfig
    }
}

function consumerConfig(){
    require("./consumer");
}

function serverConfig(){
    require("./server");
}

function connectorConfig(){
    require("./connectorConsumer");
}