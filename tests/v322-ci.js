const fs=require("fs"),path=require("path");const root=path.join(__dirname,"..","elise-learning-v1-deployable 2");const v=fs.readFileSync(path.join(root,"v3.js"),"utf8"),h=fs.readFileSync(path.join(root,"index.html"),"utf8"),help=fs.readFileSync(path.join(root,"learning-help.js"),"utf8");
const checks=[
["version",v.includes('VERSION="V3.2.2"')&&h.includes("V3.2.2")],
["quality label",h.includes("Test qualité")],
["quality isolation copy",h.includes("sans modifier les XP")&&h.includes("progression réelle")],
["six attempts",v.includes("rows.length>=6")],
["three distinct passes",v.includes("passed=new Set")&&v.includes("passed.size>=3")],
["test bypasses daily gate",v.includes("if(!window.__testMode){let d=dailyStatus(k)")],
["help component",help.includes("Application à cet exercice")],
["help loaded",h.includes("learning-help.js?v=3.2.2")],
["no stale runtime version",!h.includes("?v=3.2.1")],
["help practice only",v.includes("i<PRACTICE&&window.EliseLearningHelp")],
["help removed each question",v.includes('document.getElementById("learningHelp")')]
];for(const [n,ok] of checks)console.log((ok?"PASS ":"FAIL ")+n);if(checks.some(x=>!x[1]))process.exit(1);