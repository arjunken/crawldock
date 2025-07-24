#!/usr/bin/env node

// Test script to simulate a web search call
import { spawn } from 'child_process';

console.log('Testing web search with detailed logging...');

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send a test search request
const testSearchRequest = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: {
    name: "web_search",
    arguments: {
      query: "Super Bowl 2025 winner",
      options: {
        maxResults: 5,
        formatForLLM: true
      }
    }
  }
};

// Wait for server to start, then send request
setTimeout(() => {
  server.stdin.write(JSON.stringify(testSearchRequest) + '\n');
}, 2000);

let output = '';
server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('Server response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('Server error:', data.toString());
});

server.on('close', (code) => {
  console.log('Server closed with code:', code);
  console.log('Full output:', output);
});

// Kill after 10 seconds
setTimeout(() => {
  server.kill();
}, 10000); 