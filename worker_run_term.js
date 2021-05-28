const {parentPort} = require('worker_threads');
var {log_msg, format_output, clear_data} = require("./utils");
const fs = require('fs');
var {execSync} = require("child_process");

parentPort.on("message", async req_data => {
  try {
    var code = clear_data(req_data);
    if (code) {
      var res = await run_term(code);
      parentPort.postMessage(res);
    } else {
      parentPort.postMessage(log_msg.invalid_url);
    }
  } catch (error) { 
    console.log(error)
    parentPort.postMessage(log_msg.run_code_error);
  }
});

// Must be in Kind/base to write a new file and run the term
async function run_term(code) {
  try {
    fs.writeFileSync("playground.kind", code);
    let aux = __dirname + "/playground.txt";
    execSync("kind playground.main --run > "+aux);
    return format_output(fs.readFileSync(aux));
  } catch (e) {
    throw e
  }
}

