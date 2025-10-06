#!/usr/bin/env node

/**
 * Environment Verification Script
 * 
 * This script helps verify that all required environment variables are properly configured
 * for both local development and Cloudflare deployment.
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_ENV_VARS = {
    // Authentication
    BETTER_AUTH_SECRET: 'Secret key for Better Auth (32+ characters)',
    
    // Cloudflare
    CLOUDFLARE_ACCOUNT_ID: 'Your Cloudflare Account ID',
    CLOUDFLARE_API_TOKEN: 'Cloudflare API token with Workers and D1 permissions',
    CLOUDFLARE_D1_TOKEN: 'Cloudflare D1 database token',
    
    // R2 Storage
    CLOUDFLARE_R2_URL: 'R2 public URL (optional, will use default if not set)',
    
    // Google OAuth (optional)
    GOOGLE_CLIENT_ID: 'Google OAuth client ID (optional)',
    GOOGLE_CLIENT_SECRET: 'Google OAuth client secret (optional)',
    
    // AI Services (optional)
    ANTHROPIC_API_KEY: 'Anthropic API key for AI features (optional)'
};

const OPTIONAL_ENV_VARS = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'CLOUDFLARE_R2_URL',
    'ANTHROPIC_API_KEY'
];

function checkEnvFile() {
    console.log('🔍 Checking environment files...\n');
    
    const envFiles = ['.dev.vars', '.env.local', '.env'];
    const foundFiles = [];
    
    envFiles.forEach(file => {
        if (fs.existsSync(file)) {
            foundFiles.push(file);
            console.log(`✅ Found: ${file}`);
        } else {
            console.log(`❌ Missing: ${file}`);
        }
    });
    
    if (foundFiles.length === 0) {
        console.log('\n⚠️  No environment files found!');
        console.log('   Please create .dev.vars with your environment variables.');
        console.log('   Copy .env.example to .dev.vars and fill in your values.');
        console.log('   See docs/ENVIRONMENT_SETUP.md for instructions.\n');
        return false;
    }
    
    return foundFiles;
}

function validateEnvVars(envFile) {
    console.log(`\n🔍 Validating environment variables in ${envFile}...\n`);
    
    const envContent = fs.readFileSync(envFile, 'utf8');
    const envVars = {};
    
    // Parse environment variables
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
    
    let allValid = true;
    const missing = [];
    const invalid = [];
    
    // Check required variables (excluding optional ones)
    Object.keys(REQUIRED_ENV_VARS).forEach(key => {
        // Skip optional variables in required check
        if (OPTIONAL_ENV_VARS.includes(key)) {
            return;
        }
        
        if (!envVars[key] || envVars[key] === `your-${key.toLowerCase().replace(/_/g, '-')}`) {
            missing.push(key);
            allValid = false;
        } else if (key === 'BETTER_AUTH_SECRET' && envVars[key].length < 32) {
            invalid.push(`${key} (too short, needs 32+ characters)`);
            allValid = false;
        }
    });
    
    // Report results
    if (missing.length > 0) {
        console.log('❌ Missing or placeholder values:');
        missing.forEach(key => {
            console.log(`   - ${key}: ${REQUIRED_ENV_VARS[key]}`);
        });
        console.log('');
    }
    
    if (invalid.length > 0) {
        console.log('❌ Invalid values:');
        invalid.forEach(issue => {
            console.log(`   - ${issue}`);
        });
        console.log('');
    }
    
    // Check optional variables
    const optionalMissing = OPTIONAL_ENV_VARS.filter(key => 
        !envVars[key] || envVars[key] === `your-${key.toLowerCase().replace(/_/g, '-')}`
    );
    
    if (optionalMissing.length > 0) {
        console.log('⚠️  Optional variables not set:');
        optionalMissing.forEach(key => {
            console.log(`   - ${key}: ${REQUIRED_ENV_VARS[key]}`);
        });
        console.log('');
    }
    
    // Summary
    if (allValid) {
        console.log('✅ All required environment variables are properly configured!\n');
    } else {
        console.log('❌ Environment configuration incomplete.\n');
    }
    
    return allValid;
}

function checkWranglerConfig() {
    console.log('🔍 Checking Wrangler configuration...\n');
    
    const wranglerPath = 'wrangler.jsonc';
    if (!fs.existsSync(wranglerPath)) {
        console.log('❌ wrangler.jsonc not found!\n');
        return false;
    }
    
    try {
        const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
        const config = JSON.parse(wranglerContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''));
        
        console.log('✅ wrangler.jsonc found');
        console.log(`   - Project name: ${config.name}`);
        console.log(`   - Compatibility date: ${config.compatibility_date}`);
        
        // Check D1 database
        if (config.d1_databases && config.d1_databases.length > 0) {
            console.log(`   - D1 databases: ${config.d1_databases.length} configured`);
            config.d1_databases.forEach(db => {
                console.log(`     * ${db.database_name} (${db.database_id})`);
            });
        }
        
        // Check R2 buckets
        if (config.r2_buckets && config.r2_buckets.length > 0) {
            console.log(`   - R2 buckets: ${config.r2_buckets.length} configured`);
            config.r2_buckets.forEach(bucket => {
                console.log(`     * ${bucket.bucket_name} (${bucket.binding})`);
            });
        }
        
        console.log('');
        return true;
    } catch (error) {
        console.log('❌ Error reading wrangler.jsonc:', error.message, '\n');
        return false;
    }
}

function main() {
    console.log('🚀 Ideagraph Environment Verification\n');
    console.log('=====================================\n');
    
    // Check environment files
    const envFiles = checkEnvFile();
    if (!envFiles) {
        process.exit(1);
    }
    
    // Validate environment variables
    let envValid = true;
    envFiles.forEach(file => {
        envValid = validateEnvVars(file) && envValid;
    });
    
    // Check Wrangler config
    const wranglerValid = checkWranglerConfig();
    
    // Final summary
    console.log('📋 Summary\n');
    console.log('==========\n');
    
    if (envValid && wranglerValid) {
        console.log('✅ Environment setup is complete!');
        console.log('   You can now run:');
        console.log('   - pnpm run dev:cf (for local development)');
        console.log('   - pnpm run deploy:preview (for preview deployment)');
        console.log('   - pnpm run deploy (for production deployment)');
    } else {
        console.log('❌ Environment setup incomplete.');
        console.log('   Please fix the issues above and run this script again.');
        console.log('   See docs/ENVIRONMENT_SETUP.md for detailed instructions.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
