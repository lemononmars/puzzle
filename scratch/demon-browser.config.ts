import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'../tests/browser',testMatch:'demon-dice-endless.spec.ts',timeout:180000,use:{baseURL:'http://127.0.0.1:5194',launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-audio-output']}},reporter:'list'});
