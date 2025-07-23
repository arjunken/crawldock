# Security Guide for CrowlDock

## 🔒 API Key Protection Best Practices

### Google API Key Security

#### 1. **API Restrictions (CRITICAL)**
In Google Cloud Console, under "API restrictions":
- ✅ Select **"Restrict key"**
- ✅ Enable only **"Custom Search API"**
- ✅ Enable **"Custom Search API v1"**
- ❌ Do NOT enable other APIs

#### 2. **Application Restrictions**
For local development:
- **Option A**: Select "IP addresses" and add your local IP
- **Option B**: Keep "None" selected (acceptable for local use)

#### 3. **Environment Variables**
Create a `.env` file in your project root:

```env
# Google Custom Search API Configuration
GOOGLE_API_KEY=your_actual_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Search Settings
MAX_RESULTS=10
SEARCH_TIMEOUT=10000
USER_AGENT=Mozilla/5.0 (compatible; CrowlDock/1.0)

# Logging
LOG_LEVEL=info

# Performance Settings
MAX_RETRIES=3
RETRY_DELAY=1000

# Rate Limiting
MAX_REQUESTS_PER_DAY=500
RATE_LIMIT_WINDOW_HOURS=24
```

### 🔐 Security Checklist

- [ ] API key restricted to Custom Search API only
- [ ] `.env` file created with your actual keys
- [ ] `.env` file added to `.gitignore`
- [ ] Never commit API keys to version control
- [ ] Use environment variables, not hardcoded keys
- [ ] Regularly rotate API keys if needed

### 🚨 What NOT to Do

- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env` files to git
- ❌ Never share API keys publicly
- ❌ Don't enable unnecessary Google APIs
- ❌ Don't use unrestricted API keys in production

### 📁 File Structure
```
crowldock/
├── .env                    # Your actual API keys (not in git)
├── .env.example           # Template (safe to commit)
├── .gitignore             # Should include .env
└── src/
```

### 🔍 Verification
To verify your setup is secure:
1. Check that `.env` is in `.gitignore`
2. Verify API restrictions in Google Cloud Console
3. Test that CrowlDock works with your keys
4. Ensure no API keys appear in your git history 