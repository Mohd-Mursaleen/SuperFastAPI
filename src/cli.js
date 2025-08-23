const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
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
   * Prompt user for Supabase database integration
   * @returns {Promise<boolean>} Whether to include Supabase database integration
   */
  async promptSupabaseDatabase() {
    const { includeDatabase } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeDatabase',
        message: 'Do you want to include Supabase database integration?',
        default: false
      }
    ]);
    return includeDatabase;
  }

  /**
   * Prompt user for Supabase authentication integration
   * @returns {Promise<boolean>} Whether to include Supabase authentication
   */
  async promptSupabaseAuth() {
    const { includeAuth } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeAuth',
        message: 'Do you want to include Supabase authentication?',
        default: false
      }
    ]);
    return includeAuth;
  }

  /**
   * Display next steps after project creation
   * @param {string} projectName - Name of the created project
   * @param {boolean} supabaseDatabase - Whether Supabase database integration was included
   * @param {boolean} supabaseAuth - Whether Supabase authentication was included
   */
  displayNextSteps(projectName, supabaseDatabase, supabaseAuth) {
    console.log(chalk.blue('\n📋 Next steps:'));
    console.log(`  1. ${chalk.cyan(`cd ${projectName}`)}`);
    console.log(`  2. ${chalk.cyan('cp example.env .env')}`);
    
    if (supabaseDatabase || supabaseAuth) {
      console.log(`  3. ${chalk.cyan('Create a new Supabase project at https://supabase.com/dashboard')}`);
      console.log(`  4. ${chalk.cyan('Update .env with your Supabase project credentials:')}`);
      console.log(`     - ${chalk.yellow('SUPABASE_URL')} (from Project Settings > API)`);
      console.log(`     - ${chalk.yellow('SUPABASE_ANON_KEY')} (from Project Settings > API)`);
      
      if (supabaseAuth) {
        console.log(`     - ${chalk.yellow('SUPABASE_SERVICE_ROLE_KEY')} (from Project Settings > API)`);
      }
      
      console.log(`  5. ${chalk.cyan('poetry install')}`);
      console.log(`  6. ${chalk.cyan('poetry run uvicorn app.main:app --reload')}`);
      
      if (supabaseAuth) {
        console.log(chalk.blue('\n🔐 Supabase Authentication Setup:'));
        console.log(`  • Configure authentication providers in your Supabase dashboard`);
        console.log(`  • Set up Row Level Security (RLS) policies for your tables`);
        console.log(`  • Review the authentication endpoints in ${chalk.cyan('app/api/routes/auth.py')}`);
      }
      
      if (supabaseDatabase) {
        console.log(chalk.blue('\n🗄️  Supabase Database Setup:'));
        console.log(`  • Create your database tables in the Supabase SQL editor`);
        console.log(`  • Review the database client in ${chalk.cyan('app/db/supabase.py')}`);
        console.log(`  • Configure Row Level Security (RLS) policies as needed`);
      }
    } else {
      console.log(`  3. ${chalk.cyan('poetry install')}`);
      console.log(`  4. ${chalk.cyan('poetry run uvicorn app.main:app --reload')}`);
    }
    
    console.log(chalk.blue('\n📚 Documentation:'));
    console.log(`  • Check the ${chalk.cyan('README.md')} for detailed setup instructions`);
    console.log(`  • Visit ${chalk.cyan('http://localhost:8000/docs')} for API documentation`);
    
    if (supabaseDatabase || supabaseAuth) {
      console.log(`  • Supabase documentation: ${chalk.cyan('https://supabase.com/docs')}`);
    }
  }

  /**
   * Create a new FastAPI project
   * @param {string} projectName - Name of the project to create
   * @param {Object} options - Options for project creation
   * @param {boolean} options.skipPrompts - Skip interactive prompts (for testing)
   * @param {boolean} options.supabaseDatabase - Include Supabase database integration
   * @param {boolean} options.supabaseAuth - Include Supabase authentication
   */
  async createProject(projectName, options = {}) {
    try {
      console.log(chalk.blue(`🚀 Creating FastAPI project: ${projectName}`));
      
      let supabaseDatabase = false;
      let supabaseAuth = false;
      
      if (options.skipPrompts) {
        // Use provided options for testing
        supabaseDatabase = options.supabaseDatabase || false;
        supabaseAuth = options.supabaseAuth || false;
      } else {
        // Prompt for Supabase database integration
        supabaseDatabase = await this.promptSupabaseDatabase();
        
        // Conditionally prompt for Supabase authentication if database is selected
        if (supabaseDatabase) {
          supabaseAuth = await this.promptSupabaseAuth();
        }
      }
      
      const generator = new ProjectGenerator(projectName, { supabaseDatabase, supabaseAuth });
      await generator.generate();
      
      console.log(chalk.green(`✅ Successfully created ${projectName}!`));
      
      // Display next steps
      this.displayNextSteps(projectName, supabaseDatabase, supabaseAuth);
      
    } catch (error) {
      console.error(chalk.red(`❌ Error creating project: ${error.message}`));
      throw error;
    }
  }
}

module.exports = { SuperFastAPICLI };