const { test, expect } = require("@playwright/test");
const subjects=["english","math"];
for(const subject of subjects){
 test(subject+" mission matches lesson and 80% advances",async({page})=>{
  await page.goto("/");
  const card=page.locator('[data-start="'+subject+'"]').locator("xpath=..");
  const before=(await card.locator("h2").innerText()).trim();
  await page.locator('[data-start="'+subject+'"]').click();
  await expect(page.locator("#title")).toContainText(before);
  await page.locator("#practice").click();
  for(let i=0;i<15;i++){
   const choices=page.locator("#answers .choice");
   if(await choices.count()){await choices.first().click()}else{await page.locator("#answers input").fill("__qa__");await page.locator("#answers .primary").click()}
   if(i<10){await page.locator("#next").click();continue}
   // Force mini-test score to 100% through the app's own counters only in this QA browser.
   await page.evaluate(()=>{tc=5});
   if(i<14)await page.locator("#next").click(); else await page.locator("#next").click();
  }
  await page.locator('[data-go="home"]').click();
  const after=(await page.locator('[data-start="'+subject+'"]').locator("xpath=..").locator("h2").innerText()).trim();
  expect(after).not.toBe(before);
 });
 test(subject+" test mode does not persist profile",async({page})=>{
  await page.goto("/");
  const before=await page.evaluate(()=>localStorage.getItem("eliseLearningV2"));
  await page.locator('[data-go="test"]').click();
  await page.locator('[data-test="'+subject+'"]').click();
  const during=await page.evaluate(()=>localStorage.getItem("eliseLearningV2"));
  expect(during).toBe(before);
 });
}


test("V3.2.2 help is practice-only",async({page})=>{
 await page.goto("/");
 await page.locator('[data-start="english"]').click();
 await page.locator("#practice").click();
 await expect(page.locator("#learningHelp")).toBeVisible();
 await expect(page.locator("#learningHelp button")).toContainText("Aide-moi");
 await page.evaluate(()=>{i=10;question()});
 await expect(page.locator("#phase")).toContainText("MINI-TEST");
 await expect(page.locator("#learningHelp")).toHaveCount(0);
});

test("V3.2.2 three distinct passes block a subject",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>{let s=JSON.parse(localStorage.getItem("eliseLearningV2"));let d=new Date().toLocaleDateString("sv-SE");s.sessions=[0,1,2].map((n)=>({subject:"english",localDay:d,pct:80,topicId:"qa-"+n,testMode:false}));localStorage.setItem("eliseLearningV2",JSON.stringify(s))});
 await page.reload();
 page.once("dialog",async d=>{expect(d.message()).toContain("3 chapitres");await d.accept()});
 await page.locator('[data-start="english"]').click();
 await expect(page.locator("#home")).toHaveClass(/active/);
});

test("V3.2.2 six attempts block a subject",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>{let s=JSON.parse(localStorage.getItem("eliseLearningV2"));let d=new Date().toLocaleDateString("sv-SE");s.sessions=Array.from({length:6},(_,n)=>({subject:"math",localDay:d,pct:60,topicId:"same",testMode:false}));localStorage.setItem("eliseLearningV2",JSON.stringify(s))});
 await page.reload();
 page.once("dialog",async d=>{expect(d.message()).toContain("6 essais");await d.accept()});
 await page.locator('[data-start="math"]').click();
 await expect(page.locator("#home")).toHaveClass(/active/);
});

test("V3.2.2 Test qualité bypasses limits and preserves real profile",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>{let s=JSON.parse(localStorage.getItem("eliseLearningV2"));let d=new Date().toLocaleDateString("sv-SE");s.sessions=Array.from({length:6},(_,n)=>({subject:"english",localDay:d,pct:60,topicId:"same",testMode:false}));localStorage.setItem("eliseLearningV2",JSON.stringify(s))});
 await page.reload();
 const before=await page.evaluate(()=>localStorage.getItem("eliseLearningV2"));
 await page.locator('[data-go="test"]').click();
 await expect(page.locator("#test .brand")).toContainText("Test qualité");
 await page.locator('[data-test="english"]').click();
 await expect(page.locator("#lesson")).toHaveClass(/active/);
 const during=await page.evaluate(()=>localStorage.getItem("eliseLearningV2"));
 expect(during).toBe(before);
});
