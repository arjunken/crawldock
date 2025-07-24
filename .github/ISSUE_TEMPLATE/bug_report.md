---
name: 🐛 Bug Report
about: Create a report to help us improve CrowlDock
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## 🐛 **Bug Description**

**A clear and concise description of what the bug is.**

## 🔄 **Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ **Expected Behavior**

**A clear and concise description of what you expected to happen.**

## ❌ **Actual Behavior**

**A clear and concise description of what actually happened.**

## 📸 **Screenshots**

**If applicable, add screenshots to help explain your problem.**

## 🖥️ **Environment Information**

### **System Information**
- **OS**: [e.g. Windows 11, macOS 14.0, Ubuntu 22.04]
- **Node.js Version**: [e.g. 18.17.0]
- **npm Version**: [e.g. 9.6.7]
- **CrowlDock Version**: [e.g. 1.0.0]

### **MCP Client Information**
- **Client**: [e.g. LM Studio, Claude Desktop, Ollama]
- **Client Version**: [e.g. 0.2.0]
- **MCP Configuration**: [Share your mcp.json or relevant config]

### **Search Engine Configuration**
- **Google API Key**: [Configured/Not Configured]
- **Google Search Engine ID**: [Configured/Not Configured]
- **DuckDuckGo**: [Working/Not Working]
- **Web Scraper**: [Working/Not Working]

## 📋 **Additional Context**

### **Logs**
**Please include relevant logs from:**
- Server startup logs
- Search request logs
- Error logs
- MCP client logs

```bash
# Example: Recent server logs
Get-Content logs/combined.log -Tail 20
```

### **Configuration Files**
**Please share your configuration (remove sensitive information):**

```json
// mcp.json (remove API keys)
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/crowldock"
    }
  }
}
```

### **Search Query**
**What search query caused the issue?**
```
Example: "latest AI developments 2024"
```

## 🔍 **Troubleshooting Steps Taken**

- [ ] Checked environment variables with `node test-env.js`
- [ ] Verified server startup with `node dist/index.js`
- [ ] Tested search functionality with `node test-search.js`
- [ ] Checked running processes
- [ ] Reviewed server logs
- [ ] Restarted MCP client
- [ ] Cleared MCP cache

## 💡 **Additional Information**

**Add any other context about the problem here.**

---

**Thank you for reporting this bug! We'll investigate and get back to you soon.** 🚀 