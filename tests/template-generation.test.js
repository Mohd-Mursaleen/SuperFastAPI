const fs = require('fs').promises;
const path = require('path');
const { ProjectGenerator } = require('../src/generator');

describe('Template Generation Integration Tests', () => {
  const testProjectName = 'test-template-project';
  const testProjectPath = path.resolve(process.cwd(), testProjectName);

  afterEach(async () => {
    // Clean up test project if it exists
    try {
      await fs.rm(testProjectPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Basic project generation (no database, no Docker)', () => {
    test('should generate correct file structure without database or Docker features', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify basic project structure
      const expectedFiles = [
        'pyproject.toml',
        'README.md',
        '.gitignore',
        'example.env',
        'start.sh',
        'app/__init__.py',
        'app/main.py',
        'app/core/__init__.py',
        'app/core/config.py',
        'app/api/__init__.py',
        'app/api/routes/__init__.py',
        'app/api/schemas/__init__.py',
        'app/services/__init__.py',
        'app/models/__init__.py',
        'app/db/__init__.py',
        'app/utils/__init__.py',
        'tests/__init__.py'
      ];
      
      for (const file of expectedFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
      
      // Verify database-specific files are NOT created
      const databaseFiles = [
        'app/db/supabase.py',
        'app/db/postgres.py',
        'app/services/auth.py',
        'app/api/middleware/auth.py',
        'app/api/routes/auth.py',
        'app/models/user.py'
      ];
      
      for (const file of databaseFiles) {
        const filePath = path.join(testProjectPath, file);
        try {
          await fs.stat(filePath);
          fail(`File ${file} should not exist when database features are disabled`);
        } catch (error) {
          expect(error.code).toBe('ENOENT');
        }
      }
      
      // Verify Docker files are NOT created
      const dockerFiles = [
        'Dockerfile',
        'docker-compose.yml',
        '.dockerignore'
      ];
      
      for (const file of dockerFiles) {
        const filePath = path.join(testProjectPath, file);
        try {
          await fs.stat(filePath);
          fail(`File ${file} should not exist when Docker is disabled`);
        } catch (error) {
          expect(error.code).toBe('ENOENT');
        }
      }
    });

    test('should generate templates with correct variables for basic project', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Check pyproject.toml content
      const pyprojectContent = await fs.readFile(
        path.join(testProjectPath, 'pyproject.toml'), 
        'utf8'
      );
      expect(pyprojectContent).toContain(`name = "${testProjectName}"`);
      expect(pyprojectContent).not.toContain('supabase');
      
      // Check example.env content
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      expect(envContent).not.toContain('SUPABASE_URL');
      expect(envContent).not.toContain('SUPABASE_ANON_KEY');
      expect(envContent).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
      
      // Check config.py content
      const configContent = await fs.readFile(
        path.join(testProjectPath, 'app/core/config.py'), 
        'utf8'
      );
      expect(configContent).not.toContain('SUPABASE');
    });
  });

  describe('Supabase database only generation', () => {
    test('should generate correct file structure with database only', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify basic files exist
      const basicFiles = [
        'pyproject.toml',
        'README.md',
        'example.env',
        'app/core/config.py',
        'app/db/supabase.py'  // Should be included
      ];
      
      for (const file of basicFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
      
      // Verify auth-specific files are NOT created
      const authFiles = [
        'app/services/auth.py',
        'app/api/middleware/auth.py',
        'app/api/routes/auth.py',
        'app/models/user.py'
      ];
      
      for (const file of authFiles) {
        const filePath = path.join(testProjectPath, file);
        try {
          await fs.stat(filePath);
          fail(`File ${file} should not exist when auth is disabled`);
        } catch (error) {
          expect(error.code).toBe('ENOENT');
        }
      }
    });

    test('should generate templates with correct Supabase database variables', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Check pyproject.toml includes Supabase dependency
      const pyprojectContent = await fs.readFile(
        path.join(testProjectPath, 'pyproject.toml'), 
        'utf8'
      );
      expect(pyprojectContent).toContain('supabase');
      
      // Check example.env includes database variables but not auth variables
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      expect(envContent).toContain('SUPABASE_URL');
      expect(envContent).toContain('SUPABASE_ANON_KEY');
      expect(envContent).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
      
      // Check config.py includes Supabase settings
      const configContent = await fs.readFile(
        path.join(testProjectPath, 'app/core/config.py'), 
        'utf8'
      );
      expect(configContent).toContain('supabase_url');
      expect(configContent).toContain('supabase_anon_key');
      expect(configContent).not.toContain('supabase_service_role_key');
      
      // Check Supabase client file exists and has correct content
      const supabaseContent = await fs.readFile(
        path.join(testProjectPath, 'app/db/supabase.py'), 
        'utf8'
      );
      expect(supabaseContent).toContain('from supabase import create_client');
      expect(supabaseContent).toContain('class SupabaseClient');
    });
  });

  describe('PostgreSQL database generation', () => {
    test('should generate correct file structure with PostgreSQL', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: false,
        postgresDatabase: true,
        includeDocker: true
      });
      
      await generator.generate();
      
      // Verify PostgreSQL-specific files are created
      const postgresFiles = [
        'app/db/postgres.py',
        'alembic.ini',
        'alembic/env.py',
        'alembic/script.py.mako',
        'init.sql'
      ];
      
      for (const file of postgresFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
      
      // Verify Docker files are created
      const dockerFiles = [
        'Dockerfile',
        'docker-compose.yml',
        '.dockerignore'
      ];
      
      for (const file of dockerFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
    });

    test('should generate templates with correct PostgreSQL variables', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: false,
        postgresDatabase: true,
        includeDocker: true
      });
      
      await generator.generate();
      
      // Check pyproject.toml includes PostgreSQL dependency
      const pyprojectContent = await fs.readFile(
        path.join(testProjectPath, 'pyproject.toml'), 
        'utf8'
      );
      expect(pyprojectContent).toContain('psycopg2-binary');
      
      // Check example.env includes database variables
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      expect(envContent).toContain('DATABASE_URL');
      expect(envContent).toContain('postgresql://');
      
      // Check config.py includes PostgreSQL settings
      const configContent = await fs.readFile(
        path.join(testProjectPath, 'app/core/config.py'), 
        'utf8'
      );
      expect(configContent).toContain('database_url');
      
      // Check PostgreSQL client file exists and has correct content
      const postgresContent = await fs.readFile(
        path.join(testProjectPath, 'app/db/postgres.py'), 
        'utf8'
      );
      expect(postgresContent).toContain('from sqlalchemy import create_engine');
      expect(postgresContent).toContain('class DatabaseManager');
    });
  });

  describe('Docker only generation', () => {
    test('should generate Docker files without database', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: true
      });
      
      await generator.generate();
      
      // Verify Docker files are created
      const dockerFiles = [
        'Dockerfile',
        'docker-compose.yml',
        '.dockerignore'
      ];
      
      for (const file of dockerFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
    });
  });

  describe('Supabase authentication only generation', () => {
    test('should generate correct file structure with auth only', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify auth-specific files are created
      const authFiles = [
        'app/services/auth.py',
        'app/api/middleware/auth.py',
        'app/api/routes/auth.py',
        'app/models/user.py'
      ];
      
      for (const file of authFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
      
      // Verify database-specific file is NOT created
      const dbFile = 'app/db/supabase.py';
      const dbFilePath = path.join(testProjectPath, dbFile);
      try {
        await fs.stat(dbFilePath);
        fail(`File ${dbFile} should not exist when database is disabled`);
      } catch (error) {
        expect(error.code).toBe('ENOENT');
      }
    });

    test('should generate templates with correct auth variables', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Check example.env includes auth variables
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      expect(envContent).toContain('SUPABASE_URL');
      expect(envContent).toContain('SUPABASE_ANON_KEY');
      expect(envContent).toContain('SUPABASE_SERVICE_ROLE_KEY');
      
      // Check config.py includes auth settings
      const configContent = await fs.readFile(
        path.join(testProjectPath, 'app/core/config.py'), 
        'utf8'
      );
      expect(configContent).toContain('supabase_service_role_key');
      
      // Check auth service file content
      const authServiceContent = await fs.readFile(
        path.join(testProjectPath, 'app/services/auth.py'), 
        'utf8'
      );
      expect(authServiceContent).toContain('class AuthService');
      expect(authServiceContent).toContain('validate_jwt_token');
      
      // Check auth middleware content
      const authMiddlewareContent = await fs.readFile(
        path.join(testProjectPath, 'app/api/middleware/auth.py'), 
        'utf8'
      );
      expect(authMiddlewareContent).toContain('class AuthMiddleware');
      
      // Check auth routes content
      const authRoutesContent = await fs.readFile(
        path.join(testProjectPath, 'app/api/routes/auth.py'), 
        'utf8'
      );
      expect(authRoutesContent).toContain('router = APIRouter');
      expect(authRoutesContent).toContain('/login');
      expect(authRoutesContent).toContain('/register');
      
      // Check user models content
      const userModelsContent = await fs.readFile(
        path.join(testProjectPath, 'app/models/user.py'), 
        'utf8'
      );
      expect(userModelsContent).toContain('class UserBase');
      expect(userModelsContent).toContain('class UserCreate');
      expect(userModelsContent).toContain('class UserResponse');
    });
  });

  describe('Full Supabase integration generation', () => {
    test('should generate correct file structure with both database and auth', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify all Supabase files are created
      const supabaseFiles = [
        'app/db/supabase.py',
        'app/services/auth.py',
        'app/api/middleware/auth.py',
        'app/api/routes/auth.py',
        'app/models/user.py'
      ];
      
      for (const file of supabaseFiles) {
        const filePath = path.join(testProjectPath, file);
        const fileStats = await fs.stat(filePath);
        expect(fileStats.isFile()).toBe(true);
      }
    });

    test('should generate templates with all Supabase variables', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Check pyproject.toml includes Supabase dependency
      const pyprojectContent = await fs.readFile(
        path.join(testProjectPath, 'pyproject.toml'), 
        'utf8'
      );
      expect(pyprojectContent).toContain('supabase');
      
      // Check example.env includes all variables
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      expect(envContent).toContain('SUPABASE_URL');
      expect(envContent).toContain('SUPABASE_ANON_KEY');
      expect(envContent).toContain('SUPABASE_SERVICE_ROLE_KEY');
      
      // Check config.py includes all settings
      const configContent = await fs.readFile(
        path.join(testProjectPath, 'app/core/config.py'), 
        'utf8'
      );
      expect(configContent).toContain('supabase_url');
      expect(configContent).toContain('supabase_anon_key');
      expect(configContent).toContain('supabase_service_role_key');
      
      // Check README includes Supabase documentation
      const readmeContent = await fs.readFile(
        path.join(testProjectPath, 'README.md'), 
        'utf8'
      );
      expect(readmeContent).toContain('Supabase');
      expect(readmeContent).toContain('authentication');
      expect(readmeContent).toContain('database');
    });
  });

  describe('Template variable substitution', () => {
    test('should correctly substitute project name in all templates', async () => {
      const customProjectName = 'my-custom-api-project';
      const customProjectPath = path.resolve(process.cwd(), customProjectName);
      
      try {
        const generator = new ProjectGenerator(customProjectName, {
          supabaseDatabase: true,
          supabaseAuth: true,
          postgresDatabase: false,
          includeDocker: false
        });
        
        await generator.generate();
        
        // Check pyproject.toml
        const pyprojectContent = await fs.readFile(
          path.join(customProjectPath, 'pyproject.toml'), 
          'utf8'
        );
        expect(pyprojectContent).toContain(`name = "${customProjectName}"`);
        
        // Check main.py
        const mainContent = await fs.readFile(
          path.join(customProjectPath, 'app/main.py'), 
          'utf8'
        );
        expect(mainContent).toContain(`title="${customProjectName}"`);
        
        // Check README.md
        const readmeContent = await fs.readFile(
          path.join(customProjectPath, 'README.md'), 
          'utf8'
        );
        expect(readmeContent).toContain(customProjectName);
        
      } finally {
        // Clean up
        try {
          await fs.rm(customProjectPath, { recursive: true, force: true });
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    test('should correctly substitute Supabase feature flags in templates', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: false,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Check that conditional blocks work correctly in templates
      const envContent = await fs.readFile(
        path.join(testProjectPath, 'example.env'), 
        'utf8'
      );
      
      // Should include database variables
      expect(envContent).toContain('SUPABASE_URL');
      expect(envContent).toContain('SUPABASE_ANON_KEY');
      
      // Should not include auth-only variables
      expect(envContent).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
    });
  });

  describe('Directory structure creation', () => {
    test('should create all necessary directories', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify all directories exist
      const expectedDirs = [
        'app',
        'app/core',
        'app/api',
        'app/api/routes',
        'app/api/middleware',
        'app/api/schemas',
        'app/services',
        'app/models',
        'app/db',
        'app/utils',
        'tests'
      ];
      
      for (const dir of expectedDirs) {
        const dirPath = path.join(testProjectPath, dir);
        const dirStats = await fs.stat(dirPath);
        expect(dirStats.isDirectory()).toBe(true);
      }
    });

    test('should create directories even when only some features are enabled', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: false,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await generator.generate();
      
      // Verify auth-specific directories exist
      const authDirs = [
        'app/api/middleware',
        'app/api/routes',
        'app/services',
        'app/models'
      ];
      
      for (const dir of authDirs) {
        const dirPath = path.join(testProjectPath, dir);
        const dirStats = await fs.stat(dirPath);
        expect(dirStats.isDirectory()).toBe(true);
      }
    });
  });

  describe('Error handling', () => {
    test('should handle template rendering errors gracefully', async () => {
      // Create a generator with invalid template variables
      const generator = new ProjectGenerator('', {  // Empty project name should cause issues
        supabaseDatabase: true,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      await expect(generator.generate()).rejects.toThrow();
    });

    test('should handle file system errors gracefully', async () => {
      const generator = new ProjectGenerator(testProjectName, {
        supabaseDatabase: true,
        supabaseAuth: true,
        postgresDatabase: false,
        includeDocker: false
      });
      
      // Create the project directory first to cause a conflict
      await fs.mkdir(testProjectPath, { recursive: true });
      
      await expect(generator.generate()).rejects.toThrow(
        `Directory '${testProjectName}' already exists`
      );
    });
  });
});