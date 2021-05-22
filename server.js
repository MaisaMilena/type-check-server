var express = require("express");
var app = express();
var cors = require("cors");
var { upd_log, log_msg } = require("./utils");
const { Worker } = require('worker_threads');
var {execSync} = require("child_process");

app.use(cors());
app.use(express.json());
app.use(express.static("docs"));

// app.get("/api/check_term", async (req, res, next) => {
//   // var req_code = req.query.code;
//   var req_data = req._parsedUrl.query;
//   var req_start = Date.now();

//   if (req_data) {
//     if (isMainThread) {
//       // This code is executed in the main thread and not in the worker.
//       console.log("Main thread")
//       const worker = new Worker(__filename);
      
//       worker.on('message', (msg) => { 
//         console.log("Success")
//         console.log(msg); 
//         // res.send(msg)
//       });
      
//       worker.on('error', (e) => {
//         upd_log(req, req_start, log_msg.worker_error, e)});
      
//       worker.on('exit', (code) => {
//         if (code !== 0)
//           upd_log(req, req_start, log_msg.worker_error, code)
//       });

//     } else { // This code is executed in the worker and not in the main thread.
//       console.log("Worker")
//       try {
//         console.log(">>>>> Go to typecheck")
//         // var code = await type_check(req_data);
//         // parentPort.postMessage(code);
//         parentPort.postMessage("Hello from worker")
//       } catch (e) {
//         let err = upd_log(req, req_start, log_msg.type_check_error, e)
//         parentPort.postMessage(err);
//       }
//     }
//   } else {
//     let err = upd_log(req, req_start, log_msg.query_error, "")
//     res.send(err)
//   }
// })

app.get("/api/check_term", async (req, res, next) => {
  
  var req_data = req._parsedUrl.query;
  var req_start = Date.now();
  
  if(req_data) {
    const worker = new Worker("./worker.js");
    if (process.cwd().slice(-9) !== "Kind/base") {
      process.chdir("./../Kind/base");
    }
    worker.postMessage(req_data);

    worker.on('message', (msg) => {
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
