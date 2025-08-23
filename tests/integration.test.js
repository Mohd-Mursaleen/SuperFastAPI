const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const { SuperFastAPICLI } = require('../src/cli');

describe('SuperFastAPI CLI Integration Tests', () => {
  const testProjectName = 'test-integration-project';
  const testProjectPath = path.resolve(process.cwd(), testProjectName);

  afterEach(async () => {
    // Clean up test project if it exists
    try {
      await fs.rm(testProjectPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  test('should create a complete FastAPI project', async () => {
    const cli = new SuperFastAPICLI();
    
    // Create the project with skipPrompts option
    await cli.createProject(testProjectName, { skipPrompts: true });
    
    // Verify project directory exists
    const projectStats = await fs.stat(testProjectPath);
    expect(projectStats.isDirectory()).toBe(true);
    
    // Verify essential files exist
    const expectedFiles = [
      'pyproject.toml',
      'README.md',
      '.gitignore',
      'app/__init__.py',
      'app/main.py',
      'tests/__init__.py'
    ];
    
    for (const file of expectedFiles) {
      const filePath = path.join(testProjectPath, file);
      const fileStats = await fs.stat(filePath);
      expect(fileStats.isFile()).toBe(true);
    }
    
    // Verify pyproject.toml contains correct project name
    const pyprojectContent = await fs.readFile(
      path.join(testProjectPath, 'pyproject.toml'), 
      'utf8'
    );
    expect(pyprojectContent).toContain(`name = "${testProjectName}"`);
    
    // Verify main.py contains correct project name
    const mainPyContent = await fs.readFile(
      path.join(testProjectPath, 'app/main.py'), 
      'utf8'
    );
    expect(mainPyContent).toContain(`title="${testProjectName}"`);
    expect(mainPyContent).toContain(`Welcome to ${testProjectName}`);
  });

  test('should reject invalid project names', async () => {
    const cli = new SuperFastAPICLI();
    
    await expect(cli.createProject('invalid name!', { skipPrompts: true })).rejects.toThrow(
      'Project name can only contain letters, numbers, hyphens, and underscores'
    );
  });

  test('should reject existing directory names', async () => {
    const cli = new SuperFastAPICLI();
    
    // Create the project first
    await cli.createProject(testProjectName, { skipPrompts: true });
    
    // Try to create it again
    await expect(cli.createProject(testProjectName, { skipPrompts: true })).rejects.toThrow(
      `Directory '${testProjectName}' already exists`
    );
  });

  test('should create project with Supabase options when provided', async () => {
    const cli = new SuperFastAPICLI();
    const supabaseProjectName = 'test-supabase-project';
    const supabaseProjectPath = path.resolve(process.cwd(), supabaseProjectName);
    
    try {
      // Create project with Supabase options
      await cli.createProject(supabaseProjectName, { 
        skipPrompts: true, 
        supabaseDatabase: true, 
        supabaseAuth: true 
      });
      
      // Verify project directory exists
      const projectStats = await fs.stat(supabaseProjectPath);
      expect(projectStats.isDirectory()).toBe(true);
      
      // Verify essential files exist
      const expectedFiles = [
        'pyproject.toml',
        'README.md',
        '.gitignore',
        'app/__init__.py',
        'app/main.py',
        'tests/__init__.py'
      ];
      
      for (const file of expectedFiles) {
        const filePath = path.join(supabaseProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
    } finally {
      // Clean up
      try {
        await fs.rm(supabaseProjectPath, { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});