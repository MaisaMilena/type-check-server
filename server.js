var express = require("express");
var app = express();
var cors = require("cors");
var { upd_log, log_msg } = require("./utils");
const { Worker } = require('worker_threads');

app.use(cors());
app.use(express.json());
app.use(express.static("docs"));

app.get("/api/check_term", async (req, res, next) => {
  
  var req_data = req._parsedUrl.query;
  var req_start = Date.now();
  
  if(req_data) {
    const worker = new Worker("./worker_type_check.js");
    if (process.cwd().slice(-9) !== "Kind/base") {
      process.chdir("./../Kind/base");
    }
    worker.postMessage(req_data);

    worker.on('message', (msg) => {
      upd_log(req, req_start, log_msg.success, "")
      process.chdir(__dirname);
      res.send(msg);
    });

    worker.on('error', (e) => {
      let err = upd_log(req, req_start, log_msg.worker_error, e)
      res.send(err)
    });
    
    worker.on('exit', (code) => {
      if (code !== 0) {
        upd_log(req, req_start, log_msg.worker_error, code)
        res.send(err)
      }
    });

  } else {
    let err = upd_log(req, req_start, log_msg.query_error, "")
    res.send(err)
  }
})


app.get("/api/run_term", async (req, res) => {
  var req_data = req._parsedUrl.query;
  var req_start = Date.now();

  if(req_data) {
    const worker = new Worker("./worker_run_term.js");
    if (process.cwd().slice(-9) !== "Kind/base") {
      process.chdir("./../Kind/base");
    }
    worker.postMessage(req_data);

    worker.on('message', (msg) => {
      upd_log(req, req_start, log_msg.success, "")
      process.chdir(__dirname);
      res.send(msg);
    });

    worker.on('error', (e) => {
      let err = upd_log(req, req_start, log_msg.worker_error, e)
      res.send(err)
    });
    
    worker.on('exit', (code) => {
      if (code !== 0) {
        upd_log(req, req_start, log_msg.worker_error, code)
        res.send(err)
      }
    });

  } else {
    let err = upd_log(req, req_start, log_msg.query_error, "")
    res.send(err)
  }

})




app.listen(3030);
console.log("Listening on port " + 3030 + ".");


// TODO:
/*
 - add Jest
 - add tests for type check
 - add tests for run terms
 - get term
*/