const { SuperFastAPICLI } = require('../src/cli');
const inquirer = require('inquirer');

// Mock inquirer
jest.mock('inquirer');

describe('CLI Prompt Functionality', () => {
  let cli;
  
  beforeEach(() => {
    cli = new SuperFastAPICLI();
    jest.clearAllMocks();
  });

  describe('promptDatabaseChoice', () => {
    test('should return "supabase" when user selects Supabase', async () => {
      // Mock inquirer to return supabase
      inquirer.prompt.mockResolvedValue({ databaseChoice: 'supabase' });
      
      const result = await cli.promptDatabaseChoice();
      
      expect(result).toBe('supabase');
      expect(inquirer.prompt).toHaveBeenCalledWith([
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
    });

    test('should return "postgres" when user selects PostgreSQL', async () => {
      // Mock inquirer to return postgres
      inquirer.prompt.mockResolvedValue({ databaseChoice: 'postgres' });
      
      const result = await cli.promptDatabaseChoice();
      
      expect(result).toBe('postgres');
    });

    test('should return "none" when user selects no database', async () => {
      // Mock inquirer to return none
      inquirer.prompt.mockResolvedValue({ databaseChoice: 'none' });
      
      const result = await cli.promptDatabaseChoice();
      
      expect(result).toBe('none');
    });

    test('should handle inquirer errors gracefully', async () => {
      const error = new Error('Inquirer error');
      inquirer.prompt.mockRejectedValue(error);
      
      await expect(cli.promptDatabaseChoice()).rejects.toThrow('Inquirer error');
    });

    test('should use correct default value (none)', async () => {
      inquirer.prompt.mockResolvedValue({ databaseChoice: 'none' });
      
      await cli.promptDatabaseChoice();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.default).toBe('none');
    });

    test('should use correct prompt type (list)', async () => {
      inquirer.prompt.mockResolvedValue({ databaseChoice: 'supabase' });
      
      await cli.promptDatabaseChoice();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.type).toBe('list');
    });
  });

  describe('promptSupabaseAuth', () => {
    test('should return true when user confirms authentication integration', async () => {
      // Mock inquirer to return true
      inquirer.prompt.mockResolvedValue({ includeAuth: true });
      
      const result = await cli.promptSupabaseAuth();
      
      expect(result).toBe(true);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeAuth',
          message: 'Do you want to include Supabase authentication?',
          default: false
        }
      ]);
    });

    test('should return false when user declines authentication integration', async () => {
      // Mock inquirer to return false
      inquirer.prompt.mockResolvedValue({ includeAuth: false });
      
      const result = await cli.promptSupabaseAuth();
      
      expect(result).toBe(false);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeAuth',
          message: 'Do you want to include Supabase authentication?',
          default: false
        }
      ]);
    });

    test('should handle inquirer errors gracefully', async () => {
      const error = new Error('Auth prompt error');
      inquirer.prompt.mockRejectedValue(error);
      
      await expect(cli.promptSupabaseAuth()).rejects.toThrow('Auth prompt error');
    });

    test('should use correct default value (false)', async () => {
      inquirer.prompt.mockResolvedValue({ includeAuth: false });
      
      await cli.promptSupabaseAuth();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.default).toBe(false);
    });

    test('should use correct prompt type (confirm)', async () => {
      inquirer.prompt.mockResolvedValue({ includeAuth: true });
      
      await cli.promptSupabaseAuth();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.type).toBe('confirm');
    });

    test('should use correct prompt message', async () => {
      inquirer.prompt.mockResolvedValue({ includeAuth: true });
      
      await cli.promptSupabaseAuth();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.message).toBe('Do you want to include Supabase authentication?');
    });
  });

  describe('promptDockerSetup', () => {
    test('should return true when user confirms Docker setup', async () => {
      // Mock inquirer to return true
      inquirer.prompt.mockResolvedValue({ includeDocker: true });
      
      const result = await cli.promptDockerSetup();
      
      expect(result).toBe(true);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeDocker',
          message: 'Do you want to include Docker setup (Dockerfile + docker-compose.yml)?',
          default: false
        }
      ]);
    });

    test('should return false when user declines Docker setup', async () => {
      // Mock inquirer to return false
      inquirer.prompt.mockResolvedValue({ includeDocker: false });
      
      const result = await cli.promptDockerSetup();
      
      expect(result).toBe(false);
    });

    test('should handle inquirer errors gracefully', async () => {
      const error = new Error('Docker prompt error');
      inquirer.prompt.mockRejectedValue(error);
      
      await expect(cli.promptDockerSetup()).rejects.toThrow('Docker prompt error');
    });

    test('should use correct default value (false)', async () => {
      inquirer.prompt.mockResolvedValue({ includeDocker: false });
      
      await cli.promptDockerSetup();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.default).toBe(false);
    });

    test('should use correct prompt type (confirm)', async () => {
      inquirer.prompt.mockResolvedValue({ includeDocker: true });
      
      await cli.promptDockerSetup();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.type).toBe('confirm');
    });
  });

  describe('createProject with prompts', () => {
    let mockGenerator;
    
    beforeEach(() => {
      // Mock the ProjectGenerator
      mockGenerator = {
        generate: jest.fn().mockResolvedValue()
      };
      
      // Mock console methods
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock the ProjectGenerator constructor
      const { ProjectGenerator } = require('../src/generator');
      jest.spyOn(ProjectGenerator.prototype, 'generate').mockImplementation(mockGenerator.generate);
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should prompt for database choice and Docker when not skipping prompts', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'none' })  // Database choice prompt
        .mockResolvedValueOnce({ includeDocker: false });   // Docker prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(inquirer.prompt).toHaveBeenNthCalledWith(1, [
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
    });

    test('should prompt for auth when Supabase is selected', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'supabase' })  // Database choice prompt
        .mockResolvedValueOnce({ includeAuth: true })           // Auth prompt
        .mockResolvedValueOnce({ includeDocker: false });       // Docker prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(3);
      
      // Check database choice prompt
      expect(inquirer.prompt).toHaveBeenNthCalledWith(1, [
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
      
      // Check auth prompt
      expect(inquirer.prompt).toHaveBeenNthCalledWith(2, [
        {
          type: 'confirm',
          name: 'includeAuth',
          message: 'Do you want to include Supabase authentication?',
          default: false
        }
      ]);
    });

    test('should not prompt for auth when Supabase is not selected', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'postgres' })  // Database choice prompt
        .mockResolvedValueOnce({ includeDocker: true });        // Docker prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
    });

    test('should skip prompts when skipPrompts option is true', async () => {
      await cli.createProject('test-project', { 
        skipPrompts: true,
        databaseChoice: 'supabase',
        supabaseAuth: true,
        includeDocker: false
      });
      
      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    test('should use provided options when skipPrompts is true', async () => {
      const { ProjectGenerator } = require('../src/generator');
      const constructorSpy = jest.spyOn(ProjectGenerator.prototype, 'constructor').mockImplementation(() => {});
      
      await cli.createProject('test-project', { 
        skipPrompts: true,
        databaseChoice: 'postgres',
        supabaseAuth: false,
        includeDocker: true
      });
      
      // The generator should be called with the provided options
      expect(mockGenerator.generate).toHaveBeenCalled();
    });

    test('should handle prompt errors and rethrow them', async () => {
      const error = new Error('Prompt failed');
      inquirer.prompt.mockRejectedValue(error);
      
      await expect(cli.createProject('test-project')).rejects.toThrow('Prompt failed');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Error creating project: Prompt failed')
      );
    });

    test('should handle generator errors and rethrow them', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'none' })
        .mockResolvedValueOnce({ includeDocker: false });
      mockGenerator.generate.mockRejectedValue(new Error('Generator failed'));
      
      await expect(cli.createProject('test-project')).rejects.toThrow('Generator failed');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Error creating project: Generator failed')
      );
    });

    test('should force Docker when PostgreSQL is selected but Docker is declined', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'postgres' })
        .mockResolvedValueOnce({ includeDocker: false });
      
      await cli.createProject('test-project');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('PostgreSQL setup requires Docker. Docker setup will be included automatically.')
      );
    });
  });

  describe('prompt flow integration', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock the ProjectGenerator
      const { ProjectGenerator } = require('../src/generator');
      jest.spyOn(ProjectGenerator.prototype, 'generate').mockResolvedValue();
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should follow correct flow: no database, no auth prompt', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'none' })
        .mockResolvedValueOnce({ includeDocker: false });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      
      // Verify the generator was called with correct options
      const { ProjectGenerator } = require('../src/generator');
      expect(ProjectGenerator.prototype.generate).toHaveBeenCalled();
    });

    test('should follow correct flow: supabase=true, auth=true', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'supabase' })
        .mockResolvedValueOnce({ includeAuth: true })
        .mockResolvedValueOnce({ includeDocker: false });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(3);
      
      // Verify prompts were called in correct order
      const calls = inquirer.prompt.mock.calls;
      expect(calls[0][0][0].name).toBe('databaseChoice');
      expect(calls[1][0][0].name).toBe('includeAuth');
      expect(calls[2][0][0].name).toBe('includeDocker');
    });

    test('should follow correct flow: postgres=true, no auth prompt', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ databaseChoice: 'postgres' })
        .mockResolvedValueOnce({ includeDocker: true });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      
      // Verify prompts were called in correct order
      const calls = inquirer.prompt.mock.calls;
      expect(calls[0][0][0].name).toBe('databaseChoice');
      expect(calls[1][0][0].name).toBe('includeDocker');
    });
  });
});