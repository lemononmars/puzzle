import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',
 fullyParallel:false,
 workers:1,
 retries:0,
 timeout:60000,
 use:{baseURL:'http://localhost:5186',browserName:'chromium',trace:'retain-on-failure'},
 reporter:[['list'],['html',{open:'never'}]],
 webServer:{command:`"${process.execPath}" --env-file-if-exists=.env build/index.js`,url:'http://localhost:5186/search',env:{PORT:'5186',HOST:'localhost'},reuseExistingServer:false,timeout:180000},
});
