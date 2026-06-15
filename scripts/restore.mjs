import { readFileSync } from 'fs';

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';
const filePath = process.argv[2] || 'backups/backup_2026-06-15_10-43-39.json';

console.log(`正在从 ${filePath} 恢复数据...`);
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

const res = await fetch(API, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

if (res.ok) {
  const result = await res.json();
  console.log('恢复成功！');
  console.log(`  物品数: ${result.items?.length || 0}`);
  console.log(`  空间数: ${result.rooms?.length || 0}`);
  console.log(`  预算: ${JSON.stringify(result.budget)}`);
} else {
  console.error('恢复失败:', res.status, await res.text());
}
