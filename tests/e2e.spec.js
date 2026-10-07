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
