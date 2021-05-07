var express = require("express");
var app = express();
var cors = require("cors");
var utils = require("./utils");

app.use(cors());
app.use(express.json());
app.use(express.static("docs"));

app.get("/api/check_term", async (req, res, next) => {
  var code = ""
  var req_code = req.query.code;
  var req_start = Date.now();
  if (req_code) {
    try{
      // req_code = utils.clear_url_code(req_code)
      code = await utils.type_check(req_code)
    } catch (e) {
      console.log("[Error - type check code] "+ utils.date_now() + ": ", e)
    }
    log(req, req_start, "sucess");
    res.send(code);
  } else {
    log(req, req_start, "internal error");
    res.send("Internal error. Couldn't type check.")
  }
})

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
  utils.save_log(log);
}

var port = process.argv[2] || "80";
app.listen(3030);

console.log("Listening on port " + 3030 + ".");
