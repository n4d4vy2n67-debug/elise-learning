const { defineConfig } = require("@playwright/test");
module.exports=defineConfig({use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||"http://127.0.0.1:4173"},reporter:"line",workers:1});
