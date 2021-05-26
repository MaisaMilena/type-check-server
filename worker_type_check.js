const {parentPort } = require('worker_threads');
var {format_output, log_msg} = require("./utils");
const fs = require('fs');
var {execSync} = require("child_process");

parentPort.on("message", async req_data => {
  
  try {
    let data = new URLSearchParams(req_data);
    let code = data.get("code");
    if (code) {
      var res = await type_check(code);
      parentPort.postMessage(res);
    } else {
      parentPort.postMessage(log_msg.invalid_url);
    }
  } catch (error) { 
    console.log(error)
    parentPort.postMessage(log_msg.type_check_error);
  }

});

// Must be in Kind/base to write a new file and type checks it
async function type_check(code) {
  try {
    fs.writeFileSync("playground.kind", code);
    let aux = __dirname + "/playground.txt";
    execSync("kind playground.kind > "+aux);
    return format_output(fs.readFileSync(aux));
  } catch (e) {
    throw e;
  }
}
