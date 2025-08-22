const { Command } = require('commander');
const chalk = require('chalk');
const { ProjectGenerator } = require('./generator');

/**
 * SuperFastAPI CLI Application
 * 
 * Main CLI class that handles command parsing, validation, and orchestrates
 * the project creation process.
 */
class SuperFastAPICLI {
  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  /**
   * Set up CLI commands and options
   */
  setupCommands() {
    this.program
      .name('superfastapi')
      .description('A minimal command-line tool to quickly scaffold FastAPI projects with Poetry configuration')
      .version('1.0.0')
      .argument('<project-name>', 'name of the FastAPI project to create')
      .action(async (projectName) => {
        await this.createProject(projectName);
      });

    // Add help examples
    this.program.addHelpText('after', `
Examples:
  $ npx superfastapi my-api
  $ superfastapi awesome-project
  $ superfastapi user_service
`);
  }

  /**
   * Run the CLI application
   * @param {string[]} args - Command line arguments
   */
  async run(args) {
    await this.program.parseAsync(args);
  }

  /**
   * Create a new FastAPI project
   * @param {string} projectName - Name of the project to create
   */
  async createProject(projectName) {
    try {
      console.log(chalk.blue(`🚀 Creating FastAPI project: ${projectName}`));
      
      const generator = new ProjectGenerator(projectName);
      await generator.generate();
      
      console.log(chalk.green(`✅ Successfully created ${projectName}!`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Error creating project: ${error.message}`));
      throw error;
    }
  }
}

module.exports = { SuperFastAPICLI };