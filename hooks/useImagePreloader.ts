import { useEffect } from 'react';
import { Game } from '@/types/game';

/**
 * 预加载游戏图片的Hook
 * 主动预加载首屏游戏图片，确保快速显示
 */
export function useImagePreloader(games: Game[], preloadCount: number = 30) {
  useEffect(() => {
    if (games.length === 0) return;

    console.log(`🚀 开始预加载前${preloadCount}个游戏图片`);

    // 预加载前N个游戏的图片
    const gamesToPreload = games.slice(0, preloadCount);

    // 分批预加载，避免一次性发起太多请求
    const batchSize = 6;
    const batches: Game[][] = [];
    for (let i = 0; i < gamesToPreload.length; i += batchSize) {
      batches.push(gamesToPreload.slice(i, i + batchSize));
    }

    const preloadBatch = async (batch: Game[], batchIndex: number) => {
      const batchPromises = batch.map((game, index) => {
        return new Promise<void>((resolve) => {
          // 确保在浏览器环境中使用原生Image构造函数
          if (typeof window === 'undefined') {
            resolve();
            return;
          }

          const img = new window.Image();

          img.onload = () => {
            console.log(`✅ 批次${batchIndex + 1}-${index + 1} 预加载成功: ${game.title}`);
            resolve();
          };

          img.onerror = () => {
            console.warn(`⚠️ 批次${batchIndex + 1}-${index + 1} 预加载失败: ${game.title}`);
            resolve(); // 即使失败也resolve，不阻塞其他图片
          };

          // 设置超时，避免长时间等待
          setTimeout(() => {
            console.warn(`⏰ 批次${batchIndex + 1}-${index + 1} 预加载超时: ${game.title}`);
            resolve();
          }, 3000); // 减少超时时间到3秒

          img.src = game.banner_image;
        });
      });

      return Promise.allSettled(batchPromises);
    };

    // 顺序执行批次，避免网络拥塞
    const executeBatches = async () => {
      let totalSuccess = 0;

      for (let i = 0; i < batches.length; i++) {
        const results = await preloadBatch(batches[i], i);
        const batchSuccess = results.filter(r => r.status === 'fulfilled').length;
        totalSuccess += batchSuccess;

        // 批次间稍微延迟，避免网络拥塞
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`🎮 所有批次预加载完成: ${totalSuccess}/${gamesToPreload.length}`);
    };

    executeBatches();

  }, [games, preloadCount]);
}
