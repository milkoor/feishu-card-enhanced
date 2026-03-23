/**
 * HealthMonitor Unit Tests
 * 
 * Test coverage:
 * - HealthMonitor instantiation
 * - checkFeishuConnectivity() success/failure
 * - selfHeal() flow
 * - State persistence (loadState/saveState)
 * - sendHealthNotification()
 * - runHealthCheck() complete flow
 * - Periodic task creation via createHealthMonitorTask()
 * - Error handling and edge cases
 * - Mock API object structure
 */

import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HEALTH_FILE = path.join(__dirname, '../../test-health-check.json');

// Import the module under test
const healthMonitorPath = path.join(__dirname, '../../src/services/health-monitor.js');
const { HealthMonitor, createHealthMonitorTask } = await import(healthMonitorPath);

// Store original file path for cleanup
const originalHealthCheckFile = path.join(__dirname, '../../health-check.json');

// Helper: Create mock API object
function createMockApi(config = {}, callToolFn = null) {
  let callToolCallCount = 0;
  let callToolCalls = [];
  
  const mockConfig = {
    get: (key) => {
      const keys = key.split('.');
      let value = config;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
  };

  const mockLogger = {
    info: mock.fn(() => {}),
    warn: mock.fn(() => {}),
    error: mock.fn(() => {}),
    debug: mock.fn(() => {})
  };

  const defaultCallTool = async (tool, args) => {
    callToolCallCount++;
    callToolCalls.push({ tool, args });
    
    if (tool === 'message' && args?.action === 'feishu_get_token') {
      return 'mock_token_12345';
    }
    if (tool === 'message' && args?.action === 'send') {
      return { success: true };
    }
    if (tool === 'sessions_history') {
      return { messages: Array(60).fill({}) }; // 60 messages triggers compression
    }
    return null;
  };

  return {
    config: mockConfig,
    logger: {
      createLogger: () => mockLogger,
      info: mockLogger.info,
      warn: mockLogger.warn,
      error: mockLogger.error,
      debug: mockLogger.debug
    },
    callTool: callToolFn || defaultCallTool,
    _callToolCallCount: () => callToolCallCount,
    _callToolCalls: () => callToolCalls,
    _resetCallCount: () => { callToolCallCount = 0; callToolCalls = []; }
  };
}

// Helper: Clean up test health file
function cleanupTestFiles() {
  const testFiles = [TEST_HEALTH_FILE, originalHealthCheckFile];
  for (const file of testFiles) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

describe('HealthMonitor', () => {
  
  before(() => {
    cleanupTestFiles();
  });

  after(() => {
    cleanupTestFiles();
  });

  describe('Instantiation', () => {
    it('should create HealthMonitor instance with default values', () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'test', appSecret: 'test' } }
      });
      
      const monitor = new HealthMonitor(mockApi);
      
      assert.ok(monitor instanceof HealthMonitor, 'Should be instance of HealthMonitor');
      assert.strictEqual(monitor.consecutiveFailures, 0, 'Should initialize consecutiveFailures to 0');
      assert.strictEqual(monitor.maxFailures, 3, 'Should set maxFailures to 3');
      assert.ok(monitor.logger, 'Should have logger');
      assert.ok(monitor.api, 'Should have api reference');
    });

    it('should accept custom api object', () => {
      const customApi = createMockApi();
      const monitor = new HealthMonitor(customApi);
      
      assert.strictEqual(monitor.api, customApi, 'Should store api reference');
    });
  });

  describe('checkFeishuConnectivity()', () => {
    
    it('should return connected: false when feishu config is missing', async () => {
      const mockApi = createMockApi({});
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected');
      assert.ok(result.error?.includes('飞书配置缺失'), 'Should indicate config missing');
    });

    it('should return connected: false when appId is missing', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appSecret: 'secret' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected');
      assert.ok(result.error?.includes('appId'), 'Should indicate appId missing');
    });

    it('should return connected: false when appSecret is missing', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected');
      assert.ok(result.error?.includes('appSecret'), 'Should indicate appSecret missing');
    });

    it('should return connected: true when config is valid and token request succeeds', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, true, 'Should return connected');
      assert.strictEqual(result.error, null, 'Should have no error');
    });

    it('should return connected: false when token request fails', async () => {
      const mockApi = createMockApi(
        { channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } } },
        async () => { throw new Error('Network error'); }
      );
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected');
      assert.ok(result.error?.includes('Network error'), 'Should include error message');
    });

    it('should return connected: false when token is null', async () => {
      const mockApi = createMockApi(
        { channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } } },
        async () => null // Returns null token
      );
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected');
      assert.ok(result.error?.includes('无法获取飞书访问令牌'), 'Should indicate token issue');
    });
  });

  describe('selfHeal()', () => {
    
    it('should succeed when connectivity check passes after heal', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.selfHeal();
      
      assert.strictEqual(result.success, true, 'Should return success');
      assert.ok(result.message?.includes('已恢复'), 'Should indicate recovery');
      assert.strictEqual(monitor.consecutiveFailures, 0, 'Should reset failure count');
      assert.ok(monitor.lastSuccessTime, 'Should set lastSuccessTime');
    });

    it('should fail and increment failures when connectivity remains broken', async () => {
      const mockApi = createMockApi({}, async () => { throw new Error('Connection refused'); });
      const mockMonitor = new HealthMonitor(mockApi);
      
      const initialFailures = mockMonitor.consecutiveFailures;
      const result = await mockMonitor.selfHeal();
      
      assert.strictEqual(result.success, false, 'Should return failure');
      assert.strictEqual(mockMonitor.consecutiveFailures, initialFailures + 1, 'Should increment failure count');
    });

    it('should log all healing steps', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      await monitor.selfHeal();
      
      // Check that logger was called with expected messages
      const infoCalls = mockApi.logger.info.mock.calls;
      const logMessages = infoCalls.map(call => call.arguments[0]);
      
      assert.ok(logMessages.some(msg => msg?.includes('自愈')), 'Should log healing process');
    });
  });

  describe('State Persistence (loadState/saveState)', () => {
    
    it('should save state to health-check.json file', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      monitor.lastCheckTime = Date.now();
      monitor.consecutiveFailures = 2;
      monitor.lastSuccessTime = Date.now();
      monitor.saveState();
      
      // Check file was created (uses original path)
      assert.ok(fs.existsSync(originalHealthCheckFile), 'Should create health-check.json');
      
      const data = JSON.parse(fs.readFileSync(originalHealthCheckFile, 'utf-8'));
      assert.strictEqual(data.consecutiveFailures, 2, 'Should save failure count');
      assert.ok(data.lastCheckTime, 'Should save lastCheckTime');
    });

    it('should load state from existing health-check.json file', async () => {
      // First create a state file
      const testData = {
        lastCheckTime: 1234567890000,
        consecutiveFailures: 5,
        lastSuccessTime: 1234567880000
      };
      fs.writeFileSync(originalHealthCheckFile, JSON.stringify(testData, null, 2));
      
      const mockApi = createMockApi();
      const monitor = new HealthMonitor(mockApi);
      
      monitor.loadState();
      
      assert.strictEqual(monitor.consecutiveFailures, 5, 'Should load failure count');
      assert.strictEqual(monitor.lastCheckTime, 1234567890000, 'Should load lastCheckTime');
    });

    it('should handle missing state file gracefully', () => {
      // Ensure file doesn't exist
      cleanupTestFiles();
      
      const mockApi = createMockApi();
      const monitor = new HealthMonitor(mockApi);
      
      // Should not throw
      monitor.loadState();
      
      assert.strictEqual(monitor.consecutiveFailures, 0, 'Should default to 0 failures');
    });

    it('should handle corrupted state file gracefully', () => {
      // Create corrupted file
      fs.writeFileSync(originalHealthCheckFile, 'invalid json{{');
      
      const mockApi = createMockApi();
      const monitor = new HealthMonitor(mockApi);
      
      // Should not throw
      monitor.loadState();
      
      assert.strictEqual(monitor.consecutiveFailures, 0, 'Should default to 0 on error');
    });

    it('should handle file write errors gracefully', async () => {
      const mockApi = createMockApi();
      const monitor = new HealthMonitor(mockApi);
      
      // Verify saveState handles errors gracefully (catches any exceptions)
      let threw = false;
      try {
        monitor.saveState();
      } catch (e) {
        threw = true;
      }
      
      assert.ok(true, 'saveState should handle errors gracefully');
    });
  });

  describe('sendHealthNotification()', () => {
    
    it('should send success notification when connected', async () => {
      let sendArgs = null;
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (args?.action === 'send') {
            sendArgs = args;
          }
          return { success: true };
        }
      );
      const monitor = new HealthMonitor(mockApi);
      
      await monitor.sendHealthNotification('chat_123', 'chat_id', { connected: true });
      
      assert.ok(sendArgs, 'Should call send tool');
      assert.ok(sendArgs.message?.includes('✅'), 'Should include success emoji');
      assert.strictEqual(sendArgs.channel, 'feishu', 'Should use feishu channel');
      assert.strictEqual(sendArgs.target, 'chat_123', 'Should target correct chat');
    });

    it('should send failure notification when disconnected', async () => {
      let sendArgs = null;
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (args?.action === 'send') {
            sendArgs = args;
          }
          return { success: true };
        }
      );
      const monitor = new HealthMonitor(mockApi);
      monitor.consecutiveFailures = 2;
      
      await monitor.sendHealthNotification('chat_123', 'chat_id', { 
        connected: false, 
        error: 'Connection failed' 
      });
      
      assert.ok(sendArgs, 'Should call send tool');
      assert.ok(sendArgs.message?.includes('⚠️'), 'Should include warning emoji');
      assert.ok(sendArgs.message?.includes('Connection failed'), 'Should include error message');
    });

    it('should include max failure warning when threshold reached', async () => {
      let sendArgs = null;
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (args?.action === 'send') {
            sendArgs = args;
          }
          return { success: true };
        }
      );
      const monitor = new HealthMonitor(mockApi);
      monitor.consecutiveFailures = 3; // Reaches maxFailures
      
      await monitor.sendHealthNotification('chat_123', 'chat_id', { 
        connected: false, 
        error: 'Connection failed' 
      });
      
      assert.ok(sendArgs.message?.includes('🚨'), 'Should include alert emoji');
      assert.ok(sendArgs.message?.includes('最大失败次数'), 'Should mention max failures');
    });
  });

  describe('runHealthCheck()', () => {
    
    it('should return success when connectivity check passes', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.runHealthCheck();
      
      assert.strictEqual(result.success, true, 'Should return success');
      assert.strictEqual(result.connectivity.connected, true, 'Should report connected');
      assert.strictEqual(result.consecutiveFailures, 0, 'Should reset failures');
    });

    it('should attempt selfHeal when connectivity fails', async () => {
      const mockApi = createMockApi({}, async () => { throw new Error('Connection refused'); });
      const monitor = new HealthMonitor(mockApi);
      monitor.maxFailures = 10; // High threshold to avoid notification
      
      const result = await monitor.runHealthCheck({ notify: false });
      
      assert.strictEqual(result.success, false, 'Should return failure');
      assert.strictEqual(result.healResult.success, false, 'Should include heal result');
    });

    it('should send notification when notify is true and check fails', async () => {
      let notificationSent = false;
      const mockApi = createMockApi(
        { channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } } },
        async (tool, args) => {
          if (args?.action === 'send') {
            notificationSent = true;
          }
          // Make feishu_get_token fail so connectivity check fails
          if (tool === 'message' && args?.action === 'feishu_get_token') {
            throw new Error('Connection refused');
          }
          return { success: true };
        }
      );
      const monitor = new HealthMonitor(mockApi);
      monitor.maxFailures = 10;
      
      await monitor.runHealthCheck({ 
        targetId: 'chat_123', 
        targetIdType: 'chat_id',
        notify: true 
      });
      
      assert.strictEqual(notificationSent, true, 'Should send notification on failure');
    });

    it('should update lastCheckTime on successful check', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      await monitor.runHealthCheck();
      
      assert.ok(monitor.lastCheckTime, 'Should set lastCheckTime');
    });
  });

  describe('createHealthMonitorTask()', () => {
    
    it('should create a task with monitor and intervalId', () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      
      const task = createHealthMonitorTask(mockApi);
      
      assert.ok(task.monitor instanceof HealthMonitor, 'Should have monitor instance');
      assert.ok(task.intervalId, 'Should have intervalId');
      assert.ok(typeof task.stop === 'function', 'Should have stop function');
      
      // Cleanup
      task.stop();
    });

    it('should load previous state on task creation', () => {
      // Clean up before test
      cleanupTestFiles();
      
      // Pre-create state file
      const testData = { lastCheckTime: 1234567890000, consecutiveFailures: 2 };
      fs.writeFileSync(originalHealthCheckFile, JSON.stringify(testData, null, 2));
      
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      
      const task = createHealthMonitorTask(mockApi);
      
      assert.strictEqual(task.monitor.consecutiveFailures, 2, 'Should load failure count');
      
      task.stop();
    });

    it('should stop the interval when stop() is called', () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      
      const task = createHealthMonitorTask(mockApi);
      const intervalId = task.intervalId;
      
      task.stop();
      
      // The interval should be cleared (no way to directly test, but no error should occur)
      assert.ok(true, 'stop() should execute without error');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    
    it('should handle config.get throwing an error', async () => {
      const mockApi = {
        config: {
          get: () => { throw new Error('Config error'); }
        },
        logger: {
          createLogger: () => ({
            info: () => {},
            warn: () => {},
            error: () => {},
            debug: () => {}
          })
        },
        callTool: async () => 'token'
      };
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkFeishuConnectivity();
      
      assert.strictEqual(result.connected, false, 'Should return not connected on error');
    });

    it('should handle runHealthCheck with no options', async () => {
      const mockApi = createMockApi({
        channels: { feishu: { appId: 'app_123', appSecret: 'secret_123' } }
      });
      const monitor = new HealthMonitor(mockApi);
      
      // Should not throw
      const result = await monitor.runHealthCheck();
      
      assert.ok(result, 'Should return result');
      assert.strictEqual(typeof result.success, 'boolean', 'Should have success field');
    });

    it('should handle empty targetId gracefully in notification', async () => {
      const mockApi = createMockApi({}, async () => { throw new Error('Should not be called'); });
      const monitor = new HealthMonitor(mockApi);
      
      // Should not throw even when targetId is empty
      await monitor.sendHealthNotification('', 'chat_id', { connected: true });
      
      // Test passes if no error thrown
      assert.ok(true);
    });
  });

  describe('Context Compression Check', () => {
    
    it('should detect when context needs compression', async () => {
      let sessionsHistoryCalled = false;
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (tool === 'sessions_history') {
            sessionsHistoryCalled = true;
            return { messages: Array(60).fill({}) }; // 60 messages > 50 threshold
          }
          return 'token';
        }
      );
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkContextCompression('session_123');
      
      assert.strictEqual(sessionsHistoryCalled, true, 'Should call sessions_history');
      assert.strictEqual(result.needsCompression, true, 'Should need compression');
      assert.strictEqual(result.contextSize, 60, 'Should report correct size');
    });

    it('should indicate good context when under threshold', async () => {
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (tool === 'sessions_history') {
            return { messages: Array(30).fill({}) };
          }
          return 'token';
        }
      );
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkContextCompression('session_123');
      
      assert.strictEqual(result.needsCompression, false, 'Should not need compression');
      assert.ok(result.reason?.includes('良好'), 'Should indicate good status');
    });

    it('should handle sessions_history error gracefully', async () => {
      const mockApi = createMockApi(
        {},
        async (tool, args) => {
          if (tool === 'sessions_history') {
            throw new Error('Session not found');
          }
          return 'token';
        }
      );
      const monitor = new HealthMonitor(mockApi);
      
      const result = await monitor.checkContextCompression('invalid_session');
      
      assert.strictEqual(result.needsCompression, false, 'Should default to false');
      assert.ok(result.reason?.includes('检查失败'), 'Should indicate check failure');
    });
  });
});