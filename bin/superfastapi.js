#!/usr/bin/env node

/**
 * SuperFastAPI CLI Entry Point
 * 
 * This is the main executable script that initializes and runs the CLI application.
 * It handles top-level error catching and imports the main CLI logic.
 */

const { SuperFastAPICLI } = require('../src/cli');

async function main() {
  try {
    const cli = new SuperFastAPICLI();
    await cli.run(process.argv);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}