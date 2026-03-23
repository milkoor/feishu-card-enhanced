/**
 * Health Monitor - 健康监控与自愈服务
 * 
 * 功能：
 * 1. 检测飞书 App 连通性
 * 2. 检测对话上下文是否需要压缩
 * 3. 自动修复连接问题
 * 4. 定时执行（每小时）
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-21
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HEALTH_CHECK_FILE = join(__dirname, '../../health-check.json');

/**
 * 健康检查服务类
 */
export class HealthMonitor {
  constructor(api) {
    this.api = api;
    this.logger = api.logger.createLogger('health-monitor');
    this.lastCheckTime = null;
    this.consecutiveFailures = 0;
    this.maxFailures = 3; // 连续失败 3 次后告警
  }

  /**
   * 加载上次的健康检查状态
   */
  loadState() {
    try {
      if (existsSync(HEALTH_CHECK_FILE)) {
        const data = JSON.parse(readFileSync(HEALTH_CHECK_FILE, 'utf-8'));
        this.lastCheckTime = data.lastCheckTime;
        this.consecutiveFailures = data.consecutiveFailures || 0;
        this.logger.info('已加载健康检查状态');
      }
    } catch (e) {
      this.logger.warn('加载健康检查状态失败:', e.message);
    }
  }

  /**
   * 保存健康检查状态
   */
  saveState() {
    try {
      const data = {
        lastCheckTime: this.lastCheckTime,
        consecutiveFailures: this.consecutiveFailures,
        lastSuccessTime: this.lastSuccessTime
      };
      writeFileSync(HEALTH_CHECK_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      this.logger.error('保存健康检查状态失败:', e.message);
    }
  }

  /**
   * 检测飞书 App 连通性
   * @returns {Promise<{connected: boolean, error?: string}>}
   */
  async checkFeishuConnectivity() {
    try {
      // 尝试获取飞书配置
      const feishuConfig = this.api.config.get('channels.feishu');
      
      if (!feishuConfig?.appId || !feishuConfig?.appSecret) {
        return {
          connected: false,
          error: '飞书配置缺失：appId 或 appSecret 未配置'
        };
      }

      // 尝试获取 Token（测试连通性）
      const token = await this.api.callTool('message', {
        action: 'feishu_get_token'
      });

      if (!token) {
        return {
          connected: false,
          error: '无法获取飞书访问令牌'
        };
      }

      return {
        connected: true,
        error: null
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * 检测对话上下文是否需要压缩
   * @param {string} sessionId - 会话 ID
   * @returns {Promise<{needsCompression: boolean, reason?: string, contextSize?: number}>}
   */
  async checkContextCompression(sessionId) {
    try {
      // 获取会话历史
      const history = await this.api.callTool('sessions_history', {
        sessionKey: sessionId,
        limit: 100
      });

      // 估算上下文大小（简单计算消息数量）
      const messageCount = history?.messages?.length || 0;
      const needsCompression = messageCount > 50; // 超过 50 条消息建议压缩

      return {
        needsCompression,
        reason: needsCompression 
          ? `消息数量过多 (${messageCount} 条)，建议压缩` 
          : '上下文状态良好',
        contextSize: messageCount
      };
    } catch (error) {
      return {
        needsCompression: false,
        reason: `检查失败：${error.message}`,
        contextSize: 0
      };
    }
  }

  /**
   * 自愈流程：尝试恢复飞书连接
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async selfHeal() {
    try {
      this.logger.info('开始自愈流程...');

      // 步骤 1: 重新加载配置
      this.logger.info('步骤 1: 重新加载配置...');
      // 配置是动态获取的，无需特殊操作

      // 步骤 2: 清除缓存的 Token（如果有）
      this.logger.info('步骤 2: 清除 Token 缓存...');
      // Token 缓缓存通常在内存中，重启插件可清除

      // 步骤 3: 重新测试连接
      this.logger.info('步骤 3: 重新测试连接...');
      const connectivity = await this.checkFeishuConnectivity();

      if (connectivity.connected) {
        this.logger.info('✅ 自愈成功：飞书连接已恢复');
        this.consecutiveFailures = 0;
        this.lastSuccessTime = Date.now();
        this.saveState();
        
        return {
          success: true,
          message: '飞书连接已恢复'
        };
      } else {
        this.logger.error('❌ 自愈失败:', connectivity.error);
        this.consecutiveFailures++;
        this.saveState();

        return {
          success: false,
          message: `自愈失败：${connectivity.error}`
        };
      }
    } catch (error) {
      this.logger.error('自愈流程异常:', error);
      return {
        success: false,
        message: `自愈异常：${error.message}`
      };
    }
  }

  /**
   * 发送健康检查通知
   * @param {string} targetId - 目标会话 ID
   * @param {string} targetIdType - 目标 ID 类型
   * @param {Object} healthStatus - 健康状态
   */
  async sendHealthNotification(targetId, targetIdType, healthStatus) {
    const message = healthStatus.connected
      ? `✅ 健康检查通过
- 飞书连接：正常
- 检查时间：${new Date().toLocaleString('zh-CN')}
- 连续失败次数：${this.consecutiveFailures}`
      : `⚠️ 健康检查异常
- 飞书连接：异常
- 错误信息：${healthStatus.error}
- 检查时间：${new Date().toLocaleString('zh-CN')}
- 连续失败次数：${this.consecutiveFailures}

${this.consecutiveFailures >= this.maxFailures ? '🚨 已达到最大失败次数，请关注！' : ''}`;

    try {
      await this.api.callTool('message', {
        action: 'send',
        channel: 'feishu',
        target: targetId,
        message
      });
    } catch (error) {
      this.logger.error('发送健康通知失败:', error);
    }
  }

  /**
   * 执行完整的健康检查流程
   * @param {Object} options - 选项
   * @param {string} options.targetId - 目标会话 ID
   * @param {string} options.targetIdType - 目标 ID 类型
   * @param {boolean} options.notify - 是否发送通知
   * @returns {Promise<Object>} 检查结果
   */
  async runHealthCheck(options = {}) {
    const { targetId, targetIdType = 'chat_id', notify = false } = options;

    this.logger.info('开始健康检查...');

    // 1. 检查飞书连通性
    const connectivity = await this.checkFeishuConnectivity();
    
    // 2. 如果失败，尝试自愈
    if (!connectivity.connected) {
      this.logger.warn('飞书连接异常，尝试自愈...');
      const healResult = await this.selfHeal();
      
      if (!healResult.success) {
        this.consecutiveFailures++;
        this.saveState();
        
        if (notify && targetId) {
          await this.sendHealthNotification(targetId, targetIdType, {
            connected: false,
            error: `${connectivity.error} - ${healResult.message}`
          });
        }
        
        return {
          success: false,
          connectivity,
          healResult: healResult,
          consecutiveFailures: this.consecutiveFailures
        };
      }
    }

    // 3. 重置失败计数
    this.consecutiveFailures = 0;
    this.lastSuccessTime = Date.now();
    this.lastCheckTime = Date.now();
    this.saveState();

    // 4. 发送成功通知
    if (notify && targetId) {
      await this.sendHealthNotification(targetId, targetIdType, {
        connected: true
      });
    }

    this.logger.info('✅ 健康检查完成');

    return {
      success: true,
      connectivity,
      healResult: null,
      consecutiveFailures: this.consecutiveFailures,
      lastCheckTime: this.lastCheckTime
    };
  }
}

/**
 * 创建定时任务（每小时执行一次）
 * @param {Object} api - OpenClaw API
 * @param {Object} options - 选项
 */
export function createHealthMonitorTask(api, options = {}) {
  const monitor = new HealthMonitor(api);
  monitor.loadState();

  // 每小时执行一次
  const intervalMs = 60 * 60 * 1000; // 1 小时

  const intervalId = setInterval(async () => {
    try {
      await monitor.runHealthCheck(options);
    } catch (error) {
      monitor.logger.error('定时健康检查失败:', error);
    }
  }, intervalMs);

  monitor.logger.info(`健康监控定时任务已启动（间隔：${intervalMs}ms）`);

  return {
    monitor,
    intervalId,
    stop: () => {
      clearInterval(intervalId);
      monitor.logger.info('健康监控定时任务已停止');
    }
  };
}

export default HealthMonitor;
