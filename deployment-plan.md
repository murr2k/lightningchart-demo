## 🚀 Deployment Plan for LightningChart Demo

### Overview
Deploy the LightningChart demo application to Fly.io with automated CI/CD pipeline deployment and custom domain setup at lc.linknode.com via Cloudflare.

## 📋 Implementation Steps

### Phase 1: Fly.io Application Setup
- [ ] Initialize Fly.io application in murray-kopit organization
- [ ] Create `fly.toml` configuration file
- [ ] Configure app name: `lightning-chart`
- [ ] Set up production environment variables
- [ ] Configure auto-scaling rules

### Phase 2: Docker Configuration
- [ ] Create optimized `Dockerfile` for production build
- [ ] Configure multi-stage build for smaller image size
- [ ] Set up static file serving with nginx/caddy
- [ ] Add health check endpoint

### Phase 3: CI/CD Pipeline Integration
- [ ] Add Fly.io deployment job to GitHub Actions
- [ ] Use existing authenticated services via MCP:
  - Fly.io credentials from secrets manager (localhost:4180)
  - Cloudflare API already authenticated
  - GitHub token already configured
- [ ] Configure deployment script to source credentials:
  ```bash
  source ~/projects/mcp-servers/mcp-helpers.sh
  FLY_TOKEN=$(get_secret fly org_token)
  ```
- [ ] Set up deployment triggers:
  - Auto-deploy on push to main
  - Manual deployment option for other branches
- [ ] Add deployment status checks

### Phase 4: Cloudflare DNS Configuration
- [ ] Create CNAME record: `lc.linknode.com` → `lightning-chart.fly.dev`
- [ ] Configure SSL/TLS settings (Full or Full Strict)
- [ ] Set up Cloudflare proxy (orange cloud)
- [ ] Configure caching rules for static assets

### Phase 5: Fly.io Production Configuration
- [ ] Configure custom domain in Fly.io
- [ ] Set up SSL certificate provisioning
- [ ] Configure deployment regions (primary: iad, backup: ord)
- [ ] Set up monitoring and alerting

## 🔧 Technical Implementation

### 1. Fly.toml Configuration (Cost-Optimized)
```toml
app = "lightning-chart"
primary_region = "iad"
kill_signal = "SIGINT"
kill_timeout = 5

[build]
  builder = "dockerfile"
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[deploy]
  release_command = "echo 'Deployment successful'"

# Single machine configuration with autostop
[[services]]
  protocol = "tcp"
  internal_port = 8080
  auto_stop_machines = true      # Stops machine when idle
  auto_start_machines = true     # Starts on incoming request
  min_machines_running = 0       # Allow scale to zero
  max_machines_running = 1       # Maximum 1 machine

[[services.ports]]
  port = 80
  handlers = ["http"]
  force_https = true

[[services.ports]]
  port = 443
  handlers = ["tls", "http"]

[[services.http_checks]]
  interval = "30s"
  timeout = "5s"
  grace_period = "10s"
  method = "GET"
  path = "/"

# Machine configuration
[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256    # Minimum memory for static site
```

### 2. Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Local Deployment Script (deploy.sh)
```bash
#!/bin/bash
# This script runs locally with access to MCP secrets

# Load MCP helpers
source ~/projects/mcp-servers/mcp-helpers.sh

# Get credentials from secrets manager
export FLY_API_TOKEN=$(get_secret fly org_token)
export GITHUB_TOKEN=$(get_secret github admin_token)

# Deploy to Fly.io
flyctl deploy --remote-only --access-token=$FLY_API_TOKEN

# Update deployment status on GitHub
gh api repos/murr2k/lightningchart-demo/deployments \
  --method POST \
  --field ref=main \
  --field environment=production \
  --field description="Deployed to lightning-chart.fly.dev"

# Verify deployment
sleep 30
curl -f https://lightning-chart.fly.dev || exit 1
curl -f https://lc.linknode.com || exit 1

echo "✅ Deployment successful!"
```

### 3b. GitHub Actions Trigger (Simplified)
```yaml
deploy-trigger:
  name: Trigger Deployment
  runs-on: ubuntu-latest
  needs: [build, visual-regression, cross-browser-tests]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - name: Notify deployment needed
      run: |
        echo "::notice::Ready for deployment to Fly.io"
        echo "Run deploy.sh locally to deploy with authenticated credentials"
```

### 4. Nginx Configuration
```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }
    
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

## 📊 Success Criteria
- [ ] Application accessible at https://lc.linknode.com
- [ ] SSL certificate valid and auto-renewing
- [ ] Automated deployments on push to main
- [ ] Zero-downtime deployments
- [ ] Response time < 200ms for static assets
- [ ] Lighthouse score > 90 for performance
- [ ] Health checks passing
- [ ] Monitoring dashboard available

## 🔒 Security Considerations
- [ ] Environment variables properly secured
- [ ] API tokens stored in GitHub Secrets
- [ ] HTTPS enforced on all connections
- [ ] Security headers configured
- [ ] Rate limiting implemented via Cloudflare

## 📈 Monitoring & Observability
- [ ] Fly.io metrics dashboard configured
- [ ] Cloudflare analytics enabled
- [ ] Error tracking setup (optional: Sentry)
- [ ] Uptime monitoring configured
- [ ] Deploy notifications in GitHub

## 🎯 Timeline
- **Day 1**: Fly.io app setup and initial deployment
- **Day 2**: CI/CD pipeline integration
- **Day 3**: DNS configuration and SSL setup
- **Day 4**: Testing and optimization
- **Day 5**: Monitoring setup and documentation

## 📝 Documentation Needed
- [ ] Deployment runbook
- [ ] Rollback procedures
- [ ] Environment variable documentation
- [ ] Troubleshooting guide
- [ ] Performance benchmarks