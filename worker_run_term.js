const {parentPort} = require('worker_threads');
var {log_msg, format_output, clear_data} = require("./utils");
const fs = require('fs');
var {execSync} = require("child_process");

parentPort.on("message", async req_data => {
  try {
    var code = clear_data(req_data);
    if (code) {
      var res = await run_term(code);
      let output = check_valid_term(res) + res;
      parentPort.postMessage(output);
    } else {
      parentPort.postMessage(log_msg.invalid_url);
    }
  } catch (error) { 
    console.log(error)
    parentPort.postMessage(log_msg.run_code_error);
  }
});

function check_valid_term(res) {
  let clear = res.slice(0, -1);
  if (clear.endsWith("Couldn't find or compile term: 'playground.main'.")) {
    return "[!] To run a term, the code must be inside\n a 'playground.main: Type' function. \n\n"
  } else {return ""}
}

// Must be in Kind/base to write a new file and run the term
async function run_term(code) {
  console.log("I'm in ", process.cwd());
  try {
    fs.writeFileSync("playground.kind", code);
    let aux = __dirname + "/playground.txt";
    execSync("kind playground.main --run > "+aux);
    return format_output(fs.readFileSync(aux));
  } catch (e) {
    throw e
  }
}

