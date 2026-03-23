#!/usr/bin/env node
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const testFiles = [
  'test/person.test.js',
  'test/display/components-display.test.js',
  'test/components-batch-render.test.js',
  'test/utils/retry.test.js',
  'test/services/health-monitor.test.js',
  'test/hooks/hook-integration.test.js'
];

console.log('========================================');
console.log('  Feishu Card Enhanced - Test Runner');
console.log('========================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const testFile of testFiles) {
  const testPath = join(projectRoot, testFile);
  console.log(`\n▶ Running: ${testFile}`);
  console.log('-'.repeat(40));
  
  try {
    execSync(`node --test ${testPath}`, { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log(`✓ ${testFile} passed`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${testFile} failed`);
    failedTests++;
  }
}

console.log('\n========================================');
console.log('  Test Summary');
console.log('========================================');
console.log(`Total test files: ${testFiles.length}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log('========================================\n');

process.exit(failedTests > 0 ? 1 : 0);
