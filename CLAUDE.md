# 🔒 IMPORTANT: Security Guidelines for Claude Instances

## Critical Security Rules

### NEVER Commit Secrets
- **NEVER** add actual API keys, tokens, or passwords to any file that will be committed to git
- **NEVER** include real credentials in code, comments, or documentation
- **ALWAYS** use environment variables or external secret management
- **ALWAYS** check files for accidental secret inclusion before committing

### Authentication Approach
This project uses external authentication via MCP (Model Context Protocol) secrets manager:
- Secrets are managed at `localhost:4180` (MCP secrets manager)
- Credentials are loaded via `~/projects/mcp-servers/mcp-helpers.sh`
- Use `get_secret service key` to retrieve credentials

### For This Repository
- **Fly.io**: Use `get_secret fly org_token` 
- **Cloudflare**: Already authenticated via MCP
- **GitHub**: Use `get_secret github admin_token`
- **NPM**: Use `get_secret npm auth_token`

### Sample Files Only
- Only create `.env.example` or `.env.sample` files with placeholder values
- Document what each variable does but NEVER include actual values
- Add `.env` to `.gitignore` (already done)

### Before Any Commit
1. Review all changed files for secrets
2. Check for hardcoded tokens, keys, or passwords  
3. Ensure only example/sample files are included
4. Verify `.gitignore` excludes sensitive files

## Example of What NOT to Do
```javascript
// ❌ NEVER DO THIS
const API_KEY = "sk-abc123def456"; 
const flyToken = "fly_token_xyz789";

// ✅ DO THIS INSTEAD
const API_KEY = process.env.API_KEY;
const flyToken = process.env.FLY_API_TOKEN;
```

## If Secrets Are Accidentally Committed
1. Immediately revoke the exposed credentials
2. Remove from git history using BFG or git filter-branch
3. Force push to update remote
4. Generate new credentials
5. Notify the repository owner

## Remember
- Treat all credentials as highly sensitive
- When in doubt, don't include it
- Use placeholders and examples instead of real values
- Security is more important than convenience

---
*This file is for Claude instances working on this repository. Follow these guidelines strictly.*