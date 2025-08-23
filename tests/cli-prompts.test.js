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

  describe('promptSupabaseDatabase', () => {
    test('should return true when user confirms database integration', async () => {
      // Mock inquirer to return true
      inquirer.prompt.mockResolvedValue({ includeDatabase: true });
      
      const result = await cli.promptSupabaseDatabase();
      
      expect(result).toBe(true);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeDatabase',
          message: 'Do you want to include Supabase database integration?',
          default: false
        }
      ]);
    });

    test('should return false when user declines database integration', async () => {
      // Mock inquirer to return false
      inquirer.prompt.mockResolvedValue({ includeDatabase: false });
      
      const result = await cli.promptSupabaseDatabase();
      
      expect(result).toBe(false);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeDatabase',
          message: 'Do you want to include Supabase database integration?',
          default: false
        }
      ]);
    });

    test('should handle inquirer errors gracefully', async () => {
      const error = new Error('Inquirer error');
      inquirer.prompt.mockRejectedValue(error);
      
      await expect(cli.promptSupabaseDatabase()).rejects.toThrow('Inquirer error');
    });

    test('should use correct default value (false)', async () => {
      inquirer.prompt.mockResolvedValue({ includeDatabase: false });
      
      await cli.promptSupabaseDatabase();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.default).toBe(false);
    });

    test('should use correct prompt type (confirm)', async () => {
      inquirer.prompt.mockResolvedValue({ includeDatabase: true });
      
      await cli.promptSupabaseDatabase();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.type).toBe('confirm');
    });

    test('should use correct prompt message', async () => {
      inquirer.prompt.mockResolvedValue({ includeDatabase: true });
      
      await cli.promptSupabaseDatabase();
      
      const promptConfig = inquirer.prompt.mock.calls[0][0][0];
      expect(promptConfig.message).toBe('Do you want to include Supabase database integration?');
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

    test('should prompt for database only when not skipping prompts', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ includeDatabase: false }); // Database prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'includeDatabase',
          message: 'Do you want to include Supabase database integration?',
          default: false
        }
      ]);
    });

    test('should prompt for both database and auth when database is selected', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ includeDatabase: true })  // Database prompt
        .mockResolvedValueOnce({ includeAuth: true });     // Auth prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      
      // Check database prompt
      expect(inquirer.prompt).toHaveBeenNthCalledWith(1, [
        {
          type: 'confirm',
          name: 'includeDatabase',
          message: 'Do you want to include Supabase database integration?',
          default: false
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

    test('should not prompt for auth when database is not selected', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ includeDatabase: false }); // Database prompt
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    });

    test('should skip prompts when skipPrompts option is true', async () => {
      await cli.createProject('test-project', { 
        skipPrompts: true,
        supabaseDatabase: true,
        supabaseAuth: true
      });
      
      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    test('should use provided options when skipPrompts is true', async () => {
      const { ProjectGenerator } = require('../src/generator');
      const constructorSpy = jest.spyOn(ProjectGenerator.prototype, 'constructor').mockImplementation(() => {});
      
      await cli.createProject('test-project', { 
        skipPrompts: true,
        supabaseDatabase: true,
        supabaseAuth: false
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
      inquirer.prompt.mockResolvedValue({ includeDatabase: false });
      mockGenerator.generate.mockRejectedValue(new Error('Generator failed'));
      
      await expect(cli.createProject('test-project')).rejects.toThrow('Generator failed');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Error creating project: Generator failed')
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

    test('should follow correct flow: database=false, no auth prompt', async () => {
      inquirer.prompt.mockResolvedValueOnce({ includeDatabase: false });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
      
      // Verify the generator was called with correct options
      const { ProjectGenerator } = require('../src/generator');
      expect(ProjectGenerator.prototype.generate).toHaveBeenCalled();
    });

    test('should follow correct flow: database=true, auth=true', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ includeDatabase: true })
        .mockResolvedValueOnce({ includeAuth: true });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      
      // Verify prompts were called in correct order
      const calls = inquirer.prompt.mock.calls;
      expect(calls[0][0][0].name).toBe('includeDatabase');
      expect(calls[1][0][0].name).toBe('includeAuth');
    });

    test('should follow correct flow: database=true, auth=false', async () => {
      inquirer.prompt
        .mockResolvedValueOnce({ includeDatabase: true })
        .mockResolvedValueOnce({ includeAuth: false });
      
      await cli.createProject('test-project');
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
    });
  });
});