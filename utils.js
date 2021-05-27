const fs = require('fs');
require('dotenv').config();

// Clear stuffs related to color that appears on terminal
const format_output = (output) => {
  var output = output.toString();
  return output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

const date_now = () => {
  return new Date().toLocaleString("pt-BT", {timeZone: "America/Sao_Paulo"})
}

// Save the log of the request
function save_log(log){
  let aux = __dirname + "/log/"; 
  let timestamp =  Date.now(); 
  try {
    fs.writeFileSync(aux + timestamp +".txt", log)
    console.log(date_now()+": updated log on "+timestamp+".txt");
  } catch (e) {
    console.log(date_now()+": couldn't save log: ", e);
  }
}

// Log the request
function log(req, req_start, status) {
  const { url, socket } = req;
  const { remote_address } = socket;

  var log = JSON.stringify({
    status: status,
    timestamp: Date.now(),
    processingTime: Date.now() - req_start,
    remote_address, // not working
    url,
    code: req.query.code ? req.query.code : ""
  })
  save_log(log);
}

const log_msg = {
  query_error: "Query Error. Unable to find query on the request.",
  type_check_error: "Internal error. Couldn't type check.",
  run_code_error: "Internal error. Couldn't execute this term.",
  invalid_url: "Invalid URL. Check the parameters and try again.",
  worker_error: "Worker error.",
  worker_exit: "Worker stopped with exit code ",
  success: "Response sent to client!"
}


function upd_log(req, req_start, msg, err) {
  if (process.env.NODE_ENV !== "test") {
    console.log(date_now() + ": " + msg + "\n", err)
    log(req, req_start, msg);
  }
  return log_msg[msg];
}

// Removes "code=" from the URL and clear encoded URI symbols
// ex: code=type%20Foo%20%7Ba%7D
const clear_data = (input) => {
  var aux = input.slice(5)
  if (process.env.NODE_ENV !== "test") {
  try {
    return decodeURI(aux);
  } catch {
    return "URL decoding error"
  }
  } else {
    let data = new URLSearchParams(input);
    return data.get("code");
  }
}

module.exports = {save_log, date_now, upd_log, log_msg, format_output, clear_data}

/*
Resources: 
http://www.blooberry.com/indexdot/html/topics/urlencoding.htm
*/