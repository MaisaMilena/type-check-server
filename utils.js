const fs = require('fs');
var {execSync} = require("child_process");
const kind = require("kind-lang");

// Goes to /base to write a new file and type checks it
async function type_check(code) {
  var path = "./Kind/base/playground.kind"
  try{
    process.chdir("./../base");
    fs.writeFileSync(path, code);
    execSync("kind playground.kind > ./../web/playground.txt");
    var output = fs.readFileSync("./../web/playground.txt");
    return output.toString();
  } catch (e) {
    throw e;
  }
}

const date_now = () => {
  return new Date().toLocaleString("pt-BT", {timeZone: "America/Sao_Paulo"})
}

// Save the log of the request
function save_log(log){
  process.chdir("./../web");
  fs.appendFile("playground_log.txt", "\n"+log, 
  () => { 
    
    console.log(date_now()+": updated log")});
}

// function clear_url_code(code){
//   console.log(code)
//   var aux = code.substring(3) // " character, displayed as %22 in url
//   aux = code.substring(-3) // " character
//   console.log(aux)
//   return aux;
// }

module.exports = {type_check, save_log, date_now}