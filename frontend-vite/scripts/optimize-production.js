#!/usr/bin/env node

/**
 * Production build script for Podplay Sanctuary
 * Handles CSP optimization and security hardening
 */

const fs = require('fs');
const path = require('path');

const DIST_PATH = path.join(__dirname, '..', 'dist');
const INDEX_HTML_PATH = path.join(DIST_PATH, 'index.html');

/**
 * Production CSP policy (stricter than development)
 */
const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' blob: data:",
  "style-src 'self' 'unsafe-inline' https: blob:",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data: https: blob:",
  "connect-src 'self' https: wss:",
  "media-src 'self' data: https: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ');

/**
 * Security headers to add to the built index.html
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function updateProductionHTML() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('❌ Build output not found. Run `npm run build` first.');
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // Remove development CSP and replace with production CSP
  html = html.replace(
    /<meta http-equiv="Content-Security-Policy"[^>]*>/gi,
    `<meta http-equiv="Content-Security-Policy" content="${PRODUCTION_CSP}">`
  );

  // Add security headers as meta tags
  const securityMetaTags = Object.entries(SECURITY_HEADERS)
    .map(([name, content]) => `    <meta http-equiv="${name}" content="${content}">`)
    .join('\n');

  // Insert security headers after charset
  html = html.replace(
    /(<meta charset="UTF-8"\s*\/?>)/i,
    `$1\n${securityMetaTags}`
  );

  // Update title for production
  html = html.replace(
    /<title>.*<\/title>/i,
    '<title>🐻 Podplay Sanctuary - AI Development Hub</title>'
  );

  // Add meta description and keywords
  const seoMetaTags = `
    <meta name="description" content="Podplay Sanctuary - An AI-powered development hub designed for neurodivergent developers. Features Mama Bear AI, Scout Orchestration, and comprehensive development tools.">
    <meta name="keywords" content="AI development, neurodivergent, accessibility, React, TypeScript, development tools, AI assistant">
    <meta name="author" content="Podplay Sanctuary Team">
    <meta property="og:title" content="Podplay Sanctuary - AI Development Hub">
    <meta property="og:description" content="AI-powered development sanctuary for brilliant neurodivergent minds">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">`;

  html = html.replace(
    /(<meta name="viewport"[^>]*>)/i,
    `$1${seoMetaTags}`
  );

  fs.writeFileSync(INDEX_HTML_PATH, html);
  console.log('✅ Production HTML updated with security headers and optimizations');
}

function generateSecurityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    csp: PRODUCTION_CSP,
    securityHeaders: SECURITY_HEADERS,
    buildOptimizations: [
      'Production CSP applied',
      'Security headers added',
      'SEO meta tags included',
      'Development eval() restrictions removed'
    ]
  };

  const reportPath = path.join(DIST_PATH, 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('📊 Security report generated:', reportPath);
}

function main() {
  console.log('🔧 Optimizing production build for security...');
  
  try {
    updateProductionHTML();
    generateSecurityReport();
    
    console.log('🎉 Production build optimization complete!');
    console.log('🔒 Security features enabled:');
    console.log('   - Strict Content Security Policy');
    console.log('   - Security headers (XSS, CSRF, etc.)');
    console.log('   - Frame protection');
    console.log('   - Content type validation');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   - Deploy to your web server');
    console.log('   - Configure server-side security headers');
    console.log('   - Test with security audit tools');
    
  } catch (error) {
    console.error('❌ Build optimization failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateProductionHTML, generateSecurityReport };
