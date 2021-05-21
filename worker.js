const {parentPort, workerData } = require('worker_threads');
var {type_check} = require("./utils");

// TODO: make this work
parentPort.on("message", data => {
  // var code = await type_check(req_data);
  parentPort.postMessage("code");
});
