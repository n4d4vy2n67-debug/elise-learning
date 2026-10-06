const https=require("https");
const target=process.env.SITE_URL;
if(!target){console.error("SITE_URL missing");process.exit(1)}
https.get(target,res=>{
 let body="";
 res.on("data",chunk=>body+=chunk);
 res.on("end",()=>{
  const checks=[
   ["HTTP 200",res.statusCode===200],
   ["V3.2 visible",body.includes("V3.2")],
   ["v3 runtime",body.includes("v3.js")],
   ["engine",body.includes("engine-v31.js")],
   ["English catalog",body.includes("catalog-english.js")],
   ["Math catalog",body.includes("catalog-math.js")]
  ];
  checks.forEach(([name,ok])=>console.log((ok?"PASS ":"FAIL ")+name));
  if(checks.some(([,ok])=>!ok)) process.exit(1);
 });
}).on("error",err=>{console.error(err.message);process.exit(1)});
