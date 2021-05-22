const {parentPort } = require('worker_threads');
var {type_check, log_msg} = require("./utils");

parentPort.on("message", async req_data => {
  
  try {
    var code = await type_check(req_data);
    parentPort.postMessage(code);
  } catch (error) { 
    console.log(error)
    parentPort.postMessage(log_msg.type_check_error);
  }

});
