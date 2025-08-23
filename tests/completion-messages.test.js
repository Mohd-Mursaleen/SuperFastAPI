const { SuperFastAPICLI } = require('../src/cli');

describe('CLI Completion Messages', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should display basic next steps for projects without Supabase', () => {
    const cli = new SuperFastAPICLI();
    cli.displayNextSteps('test-project', false, false);
    
    const logCalls = consoleSpy.mock.calls.map(call => call[0]);
    
    // Check for basic next steps
    expect(logCalls.some(call => call.includes('📋 Next steps:'))).toBe(true);
    expect(logCalls.some(call => call.includes('cd test-project'))).toBe(true);
    expect(logCalls.some(call => call.includes('cp example.env .env'))).toBe(true);
    expect(logCalls.some(call => call.includes('poetry install'))).toBe(true);
    expect(logCalls.some(call => call.includes('poetry run uvicorn app.main:app --reload'))).toBe(true);
    
    // Should not include Supabase-specific instructions
    expect(logCalls.some(call => call.includes('Supabase'))).toBe(false);
  });

  test('should display Supabase database setup instructions when database is selected', () => {
    const cli = new SuperFastAPICLI();
    cli.displayNextSteps('test-project', true, false);
    
    const logCalls = consoleSpy.mock.calls.map(call => call[0]);
    
    // Check for Supabase database instructions
    expect(logCalls.some(call => call.includes('Create a new Supabase project'))).toBe(true);
    expect(logCalls.some(call => call.includes('SUPABASE_URL'))).toBe(true);
    expect(logCalls.some(call => call.includes('SUPABASE_ANON_KEY'))).toBe(true);
    expect(logCalls.some(call => call.includes('🗄️  Supabase Database Setup:'))).toBe(true);
    expect(logCalls.some(call => call.includes('app/db/supabase.py'))).toBe(true);
    
    // Should not include auth-specific instructions
    expect(logCalls.some(call => call.includes('SUPABASE_SERVICE_ROLE_KEY'))).toBe(false);
    expect(logCalls.some(call => call.includes('🔐 Supabase Authentication Setup:'))).toBe(false);
  });

  test('should display full Supabase instructions when both database and auth are selected', () => {
    const cli = new SuperFastAPICLI();
    cli.displayNextSteps('test-project', true, true);
    
    const logCalls = consoleSpy.mock.calls.map(call => call[0]);
    
    // Check for all Supabase instructions
    expect(logCalls.some(call => call.includes('Create a new Supabase project'))).toBe(true);
    expect(logCalls.some(call => call.includes('SUPABASE_URL'))).toBe(true);
    expect(logCalls.some(call => call.includes('SUPABASE_ANON_KEY'))).toBe(true);
    expect(logCalls.some(call => call.includes('SUPABASE_SERVICE_ROLE_KEY'))).toBe(true);
    expect(logCalls.some(call => call.includes('🔐 Supabase Authentication Setup:'))).toBe(true);
    expect(logCalls.some(call => call.includes('🗄️  Supabase Database Setup:'))).toBe(true);
    expect(logCalls.some(call => call.includes('app/api/routes/auth.py'))).toBe(true);
    expect(logCalls.some(call => call.includes('app/db/supabase.py'))).toBe(true);
    expect(logCalls.some(call => call.includes('https://supabase.com/docs'))).toBe(true);
  });

  test('should display auth-only instructions when only auth is selected', () => {
    const cli = new SuperFastAPICLI();
    cli.displayNextSteps('test-project', false, true);
    
    const logCalls = consoleSpy.mock.calls.map(call => call[0]);
    
    // Check for auth instructions
    expect(logCalls.some(call => call.includes('SUPABASE_SERVICE_ROLE_KEY'))).toBe(true);
    expect(logCalls.some(call => call.includes('🔐 Supabase Authentication Setup:'))).toBe(true);
    
    // Should not include database-specific instructions
    expect(logCalls.some(call => call.includes('🗄️  Supabase Database Setup:'))).toBe(false);
  });
});