#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Environment Test:');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET');
console.log('GOOGLE_SEARCH_ENGINE_ID:', process.env.GOOGLE_SEARCH_ENGINE_ID ? 'SET' : 'NOT SET');
console.log('Current working directory:', process.cwd());
console.log('.env file exists:', import('fs').then(fs => fs.existsSync('.env'))); 