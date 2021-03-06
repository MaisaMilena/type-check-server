var express = require("express");
var app = express();
var cors = require("cors");
var { upd_log, log_msg } = require("./utils");
const { Worker } = require('worker_threads');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static("docs"));

app.get("/kind_version", (req, res) => {
  try {
    let version = require("./../Kind/bin/js/package.json").version
    res.send(version);
  } catch (e) {
    res.send(log_msg.version_fail)
  }
});

app.get("/api/check_term", async (req, res, next) => {

  process.chdir(__dirname);
  var req_data = req._parsedUrl.query;
  var req_start = Date.now();

  if (req_data) {
    const worker = new Worker("./worker_type_check.js");
    if (process.cwd().slice(-9) !== "Kind/base") {
      process.chdir("./../Kind/base");
    }
    worker.postMessage(req_data);

    worker.on('message', (msg) => {
      upd_log(req, req_start, log_msg.success, "");
      process.chdir(__dirname);
      res.send(msg);
    });

    worker.on('error', (e) => {
      let err = upd_log(req, req_start, log_msg.worker_type_check_error, e);
      res.send(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        let err = upd_log(req, req_start, log_msg.worker_exit, code)
        res.send(err);
      }
    });

  } else {
    let err = upd_log(req, req_start, log_msg.query_error, "");
    res.send(err);
  }
})

/**
 * Runs the term "playground.main".
 */
app.get("/api/run_term", async (req, res) => {
  process.chdir(__dirname);
  var req_data = req._parsedUrl.query;
  var req_start = Date.now();

  if (req_data) {
    const worker = new Worker("./worker_run_term.js");
    if (process.cwd().slice(-9) !== "Kind/base") {
      process.chdir("./../Kind/base");
    }
    worker.postMessage(req_data);

    worker.on('message', (msg) => {
      upd_log(req, req_start, log_msg.success, "");
      process.chdir(__dirname);
      res.send(msg);
    });

    worker.on('error', (e) => {
      let err = upd_log(req, req_start, log_msg.worker_run_code_error, e);
      res.send(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        let err = upd_log(req, req_start, log_msg.worker_exit, code);
        res.send(err);
      }
    });

  } else {
    let err = upd_log(req, req_start, log_msg.query_error, "");
    res.send(err);
  }

})

if (process.env.NODE_ENV === "test") {
  app.listen(process.env.TEST_PORT);
  console.log("Listening on port " + process.env.TEST_PORT + ".");
} else {
  app.listen(3030);
  console.log("Listening on port " + 3030 + ".");
}

module.exports = app; // for testing