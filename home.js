const http=require("http");
const fs = require("fs");
var requests= require("requests");
const homeFile= fs.readFileSync("home.html", "utf-8");

const replaceval =(tempval,orgval)=>
{
    let temperature= tempval.replace("{%tempval%}",orgval.main.temp);
        temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
        temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
        temperature=temperature.replace("{%location%}",orgval.name);
        temperature=temperature.replace("{%country%}",orgval.sys.country);
        temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
        return temperature;

}

const server= http.createServer((req,res)=>
{
    if(req.url==="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=da2760bdda059f6e6d1941e98044c005&units=metric")
.on('data',  (chunk)=> {
    const objdata= JSON.parse(chunk);
    const arrdata= [objdata];
//   console.log(arrdata);
const realTimedata=arrdata.map((val)=> replaceval(homeFile,val)).join("");
res.write(realTimedata);
// console.log(realTimedata);

})
.on('end', (err)=> {
  if (err) return console.log('connection closed due to errors', err);
 
 res.end();
});
    }
});
server.listen(8000,"127.0.0.1");
