// 清理 Next.js 缓存目录的脚本
// 用于 Cloudflare Pages 部署，避免文件过大（超过 25 MiB 限制）

const fs = require('fs');
const path = require('path');

function deleteDir(dir) {
  if (fs.existsSync(dir)) {
    try {
      console.log(`正在删除: ${dir}`);
      fs.readdirSync(dir).forEach(file => {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dir);
      console.log(`✓ 已删除: ${dir}`);
    } catch (error) {
      console.error(`删除失败 ${dir}:`, error.message);
    }
  }
}

function getDirSize(dir) {
  let size = 0;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    });
  }
  return size;
}

console.log('开始清理缓存目录...\n');

// 清理 .next/cache 目录
const cacheDir = '.next/cache';
if (fs.existsSync(cacheDir)) {
  const size = getDirSize(cacheDir);
  console.log(`发现缓存目录: ${cacheDir} (${(size / 1024 / 1024).toFixed(2)} MiB)`);
  deleteDir(cacheDir);
}

// 清理 .vercel/output/static/.next/cache 目录（如果存在）
const outputCacheDir = '.vercel/output/static/.next/cache';
if (fs.existsSync(outputCacheDir)) {
  const size = getDirSize(outputCacheDir);
  console.log(`发现输出缓存目录: ${outputCacheDir} (${(size / 1024 / 1024).toFixed(2)} MiB)`);
  deleteDir(outputCacheDir);
}

// 清理 .vercel/output/static/.next 目录中的 cache 目录（递归查找）
function findAndDeleteCacheDirs(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'cache') {
        const size = getDirSize(fullPath);
        console.log(`发现缓存目录: ${fullPath} (${(size / 1024 / 1024).toFixed(2)} MiB)`);
        deleteDir(fullPath);
      } else {
        findAndDeleteCacheDirs(fullPath);
      }
    }
  });
}

// 递归查找并删除所有 cache 目录
findAndDeleteCacheDirs('.vercel/output/static');

console.log('\n✓ 缓存清理完成');

