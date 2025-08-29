/**
 * 站点地图管理器 - 渐进式SEO策略
 * 
 * 核心策略：
 * 1. 从少量高质量页面开始（10个）
 * 2. 观察Google收录和排名情况
 * 3. 根据表现逐步增加页面数量
 * 4. 确保每个页面都围绕特定关键词优化
 */

export interface SitemapConfig {
  initialGameCount: number;
  maxGameCount: number;
  incrementDays: number;
  qualityThreshold: number;
  batchSize: number;
}

export interface GameSEOData {
  namespace: string;
  title: string;
  category: string;
  quality_score: number;
  keywords: string[];
  lastmod: string;
  priority: number;
}

export class SitemapManager {
  private config: SitemapConfig;

  constructor(config: Partial<SitemapConfig> = {}) {
    this.config = {
      initialGameCount: 10,      // 初始10个游戏
      maxGameCount: 100,         // 最大100个游戏
      incrementDays: 7,          // 每7天增加一批
      qualityThreshold: 0.75,    // 质量分数阈值
      batchSize: 10,             // 每批增加10个
      ...config
    };
  }

  /**
   * 计算当前应该包含的游戏数量
   * 基于时间的渐进式增长策略
   */
  getCurrentGameCount(): number {
    const now = new Date();
    const startDate = new Date('2025-08-29'); // 项目实际开始日期
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 每incrementDays天增加一批
    const batches = Math.floor(daysSinceStart / this.config.incrementDays);
    const currentCount = this.config.initialGameCount + (batches * this.config.batchSize);
    
    return Math.min(currentCount, this.config.maxGameCount);
  }

  /**
   * 获取SEO优化的游戏列表
   * 优先选择高质量、有明确关键词的游戏
   */
  async getOptimizedGameList(count: number): Promise<GameSEOData[]> {
    const games: GameSEOData[] = [];
    const seenNamespaces = new Set<string>();
    
    try {
      // 按质量排序获取游戏
      const response = await fetch(
        `https://feeds.gamepix.com/v2/json?sid=34E14&pagination=48&page=1&order=quality`,
        { next: { revalidate: 3600 } }
      );
      
      if (!response.ok) return games;
      
      const data = await response.json();
      if (!data.items) return games;
      
      for (const game of data.items) {
        if (games.length >= count) break;
        
        // 过滤条件
        if (
          !game.namespace ||
          !game.title ||
          game.quality_score < this.config.qualityThreshold ||
          seenNamespaces.has(game.namespace)
        ) {
          continue;
        }
        
        seenNamespaces.add(game.namespace);
        
        // 生成SEO关键词
        const keywords = this.generateSEOKeywords(game);
        
        games.push({
          namespace: game.namespace,
          title: game.title,
          category: game.category || 'games',
          quality_score: game.quality_score,
          keywords,
          lastmod: this.formatSitemapDate(game.date_modified),
          priority: this.calculatePriority(game.quality_score, game.category)
        });
      }
      
      return games;
    } catch (error) {
      console.error('获取优化游戏列表失败:', error);
      return games;
    }
  }

  /**
   * 为游戏生成SEO关键词
   * 遵循"一个关键词一个页面"原则
   */
  private generateSEOKeywords(game: any): string[] {
    const keywords: string[] = [];
    
    // 主关键词：游戏名称
    keywords.push(game.title.toLowerCase());
    
    // 长尾关键词：游戏名 + 类型
    if (game.category) {
      keywords.push(`${game.title.toLowerCase()} ${game.category}`);
      keywords.push(`play ${game.title.toLowerCase()}`);
      keywords.push(`${game.title.toLowerCase()} game`);
      keywords.push(`free ${game.title.toLowerCase()}`);
    }
    
    // 分类关键词
    if (game.category) {
      keywords.push(`${game.category} games`);
      keywords.push(`free ${game.category} games`);
    }
    
    return keywords.slice(0, 5); // 限制关键词数量
  }

  /**
   * 格式化站点地图日期为标准格式
   * 确保符合XML站点地图规范 (YYYY-MM-DD)
   */
  private formatSitemapDate(dateString?: string): string {
    try {
      if (!dateString) {
        return new Date().toISOString().split('T')[0];
      }
      
      // 解析日期并格式化为 YYYY-MM-DD
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      // 如果日期解析失败，返回当前日期
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * 计算页面优先级
   */
  private calculatePriority(qualityScore: number, category: string): number {
    let priority = 0.5;
    
    // 基于质量分数
    if (qualityScore >= 0.9) priority = 0.9;
    else if (qualityScore >= 0.8) priority = 0.8;
    else if (qualityScore >= 0.7) priority = 0.7;
    else priority = 0.6;
    
    // 热门分类加权
    const popularCategories = ['action', 'puzzle', 'racing', 'sports', 'adventure'];
    if (popularCategories.includes(category?.toLowerCase())) {
      priority += 0.1;
    }
    
    return Math.min(priority, 1.0);
  }

  /**
   * 生成分类页面的SEO数据
   */
  getCategorySEOData(): Array<{url: string, priority: number, keywords: string[]}> {
    const categories = [
      { name: 'action', priority: 0.9, keywords: ['action games', 'free action games', 'online action games'] },
      { name: 'puzzle', priority: 0.9, keywords: ['puzzle games', 'brain games', 'free puzzle games'] },
      { name: 'racing', priority: 0.8, keywords: ['racing games', 'car games', 'free racing games'] },
      { name: 'sports', priority: 0.8, keywords: ['sports games', 'free sports games', 'online sports'] },
      { name: 'adventure', priority: 0.8, keywords: ['adventure games', 'free adventure games'] },
      { name: 'arcade', priority: 0.7, keywords: ['arcade games', 'classic arcade games'] },
      { name: 'shooting', priority: 0.7, keywords: ['shooting games', 'free shooting games'] },
      { name: 'strategy', priority: 0.7, keywords: ['strategy games', 'free strategy games'] },
      { name: 'casual', priority: 0.6, keywords: ['casual games', 'easy games'] },
      { name: 'educational', priority: 0.6, keywords: ['educational games', 'learning games'] }
    ];
    
    return categories.map(cat => ({
      url: `/category/${cat.name}`,
      priority: cat.priority,
      keywords: cat.keywords
    }));
  }

  /**
   * 获取当前站点地图统计信息
   */
  getSitemapStats(): {
    currentGameCount: number;
    maxGameCount: number;
    progress: number;
    nextIncrementDays: number;
  } {
    const currentCount = this.getCurrentGameCount();
    const progress = (currentCount / this.config.maxGameCount) * 100;
    
    const now = new Date();
    const startDate = new Date('2025-08-29'); // 项目实际开始日期
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const nextIncrementDays = this.config.incrementDays - (daysSinceStart % this.config.incrementDays);
    
    return {
      currentGameCount: currentCount,
      maxGameCount: this.config.maxGameCount,
      progress: Math.round(progress),
      nextIncrementDays
    };
  }
}

// 默认实例
export const sitemapManager = new SitemapManager();
