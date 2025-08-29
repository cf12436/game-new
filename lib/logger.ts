/**
 * 日志工具 - 根据环境控制日志输出
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

export const logger = {
  /**
   * 调试日志 - 仅在开发环境或调试模式下显示
   */
  debug: (...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.log('🐛', ...args);
    }
  },

  /**
   * 信息日志 - 仅在开发环境或调试模式下显示
   */
  info: (...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.log('ℹ️', ...args);
    }
  },

  /**
   * 成功日志 - 仅在开发环境或调试模式下显示
   */
  success: (...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.log('✅', ...args);
    }
  },

  /**
   * 警告日志 - 总是显示
   */
  warn: (...args: any[]) => {
    console.warn('⚠️', ...args);
  },

  /**
   * 错误日志 - 总是显示
   */
  error: (...args: any[]) => {
    console.error('❌', ...args);
  },

  /**
   * 游戏相关日志
   */
  game: {
    load: (...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log('🎮', ...args);
      }
    },
    
    click: (...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log('🎯', ...args);
      }
    },
    
    preload: (...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log('🚀', ...args);
      }
    }
  },

  /**
   * API相关日志
   */
  api: {
    request: (...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log('📡', ...args);
      }
    },
    
    response: (...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log('📊', ...args);
      }
    },
    
    error: (...args: any[]) => {
      console.error('💥', ...args);
    }
  },

  /**
   * 性能相关日志
   */
  perf: {
    start: (label: string) => {
      if (isDevelopment || isDebugMode) {
        console.time(`⏱️ ${label}`);
      }
    },
    
    end: (label: string) => {
      if (isDevelopment || isDebugMode) {
        console.timeEnd(`⏱️ ${label}`);
      }
    }
  }
};

export default logger;
