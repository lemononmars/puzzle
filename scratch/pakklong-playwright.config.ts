import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'../tests/browser',testMatch:'pakklongboard.spec.ts',timeout:60000,workers:1,use:{baseURL:'http://localhost:5173',browserName:'chromium',trace:'retain-on-failure'},reporter:'list'});
