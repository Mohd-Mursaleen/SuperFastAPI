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
   * Prompt user for database setup choice
   * @returns {Promise<string>} Database choice: 'none', 'supabase', or 'postgres'
   */
  async promptDatabaseChoice() {
    const { databaseChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'databaseChoice',
        message: 'Choose your database setup:',
        choices: [
          { name: 'No database setup', value: 'none' },
          { name: 'Supabase (cloud database)', value: 'supabase' },
          { name: 'PostgreSQL with Docker', value: 'postgres' }
        ],
        default: 'none'
      }
    ]);
    return databaseChoice;
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
   * Prompt user for Docker setup
   * @returns {Promise<boolean>} Whether to include Docker setup
   */
  async promptDockerSetup() {
    const { includeDocker } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeDocker',
        message: 'Do you want to include Docker setup (Dockerfile + docker-compose.yml)?',
        default: false
      }
    ]);
    return includeDocker;
  }

  /**
   * Display next steps after project creation
   * @param {string} projectName - Name of the created project
   * @param {Object} options - Project options
   * @param {string} options.databaseChoice - Database choice: 'none', 'supabase', or 'postgres'
   * @param {boolean} options.supabaseAuth - Whether Supabase authentication was included
   * @param {boolean} options.includeDocker - Whether Docker setup was included
   */
  displayNextSteps(projectName, options) {
    const { databaseChoice, supabaseAuth, includeDocker } = options;
    const supabaseDatabase = databaseChoice === 'supabase';
    const postgresDatabase = databaseChoice === 'postgres';
    
    console.log(`  2. ${chalk.cyan('cp example.env .env')}`);
    
    if (includeDocker) {
      console.log(chalk.blue('\n🐳 Docker Setup:'));
      if (postgresDatabase) {
        console.log(`  3. ${chalk.cyan('docker-compose up -d')} - Start PostgreSQL database`);
        console.log(`  4. ${chalk.cyan('poetry install')} - Install Python dependencies`);
        console.log(`  5. ${chalk.cyan('poetry run uvicorn app.main:app --reload')} - Start the API`);
      } else {
        console.log(`  3. ${chalk.cyan('docker-compose up --build')} - Build and start the application`);
        console.log(`  • Or run locally: ${chalk.cyan('poetry install && poetry run uvicorn app.main:app --reload')}`);
      }
    } else {
      console.log(`  3. ${chalk.cyan('poetry install')} - Install dependencies`);
      console.log(`  4. ${chalk.cyan('poetry run uvicorn app.main:app --reload')} - Start the API`);
    }
    
    if (supabaseDatabase || supabaseAuth) {
      const stepNum = includeDocker ? (postgresDatabase ? '6' : '4') : '5';
      console.log(`  ${stepNum}. ${chalk.cyan('Create a new Supabase project at https://supabase.com/dashboard')}`);
      console.log(`  ${parseInt(stepNum) + 1}. ${chalk.cyan('Update .env with your Supabase project credentials:')}`);
      console.log(`     - ${chalk.yellow('SUPABASE_URL')} (from Project Settings > API)`);
      console.log(`     - ${chalk.yellow('SUPABASE_ANON_KEY')} (from Project Settings > API)`);
      
      if (supabaseAuth) {
        console.log(`     - ${chalk.yellow('SUPABASE_SERVICE_ROLE_KEY')} (from Project Settings > API)`);
      }      
      
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
    }
    
    if (postgresDatabase) {
      console.log(chalk.blue('\n🗄️  PostgreSQL Database Setup:'));
      console.log(`  • Database will be available at ${chalk.cyan('localhost:5432')}`);
      console.log(`  • Default credentials: ${chalk.cyan('postgres/postgres')}`);
      console.log(`  • Database name: ${chalk.cyan(projectName.replace(/[^a-zA-Z0-9]/g, '_'))}`);
      console.log(`  • Review the database configuration in ${chalk.cyan('app/core/config.py')}`);
      console.log(`  • Run migrations: ${chalk.cyan('poetry run alembic upgrade head')}`);
    }
    
    console.log(chalk.blue('\n📚 Documentation:'));
    console.log(`  • Check the ${chalk.cyan('README.md')} for detailed setup instructions`);
    console.log(`  • Visit ${chalk.cyan('http://localhost:8000/docs')} for API documentation`);
    
    if (supabaseDatabase || supabaseAuth) {
      console.log(`  • Supabase documentation: ${chalk.cyan('https://supabase.com/docs')}`);
    }
    
    if (includeDocker) {
      console.log(`  • Docker documentation: ${chalk.cyan('https://docs.docker.com/')}`);
    }
  }

  /**
   * Create a new FastAPI project
   * @param {string} projectName - Name of the project to create
   * @param {Object} options - Options for project creation
   * @param {boolean} options.skipPrompts - Skip interactive prompts (for testing)
   * @param {string} options.databaseChoice - Database choice: 'none', 'supabase', or 'postgres'
   * @param {boolean} options.supabaseAuth - Include Supabase authentication
   * @param {boolean} options.includeDocker - Include Docker setup
   */
  async createProject(projectName, options = {}) {
    try {
      console.log(chalk.blue(`🚀 Creating FastAPI project: ${projectName}`));
      
      let databaseChoice = 'none';
      let supabaseAuth = false;
      let includeDocker = false;
      
      if (options.skipPrompts) {
        // Use provided options for testing
        databaseChoice = options.databaseChoice || 'none';
        supabaseAuth = options.supabaseAuth || false;
        includeDocker = options.includeDocker || false;
      } else {
        // Prompt for database choice
        databaseChoice = await this.promptDatabaseChoice();
        
        // Conditionally prompt for Supabase authentication if Supabase is selected
        if (databaseChoice === 'supabase') {
          supabaseAuth = await this.promptSupabaseAuth();
        }
        
        // Prompt for Docker setup
        includeDocker = await this.promptDockerSetup();
        
        // If user chose PostgreSQL but declined Docker, show warning
        if (databaseChoice === 'postgres' && !includeDocker) {
          console.log(chalk.yellow('⚠️  PostgreSQL setup requires Docker. Docker setup will be included automatically.'));
          includeDocker = true;
        }
      }
      
      // Convert database choice to legacy format for generator compatibility
      const supabaseDatabase = databaseChoice === 'supabase';
      const postgresDatabase = databaseChoice === 'postgres';
      
      const generator = new ProjectGenerator(projectName, { 
        supabaseDatabase, 
        supabaseAuth, 
        postgresDatabase,
        includeDocker 
      });
      await generator.generate();
      
      
      // Display next steps
      this.displayNextSteps(projectName, { databaseChoice, supabaseAuth, includeDocker });
      
    } catch (error) {
      console.error(chalk.red(`❌ Error creating project: ${error.message}`));
      throw error;
    }
  }
}

module.exports = { SuperFastAPICLI };