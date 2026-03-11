/**
 * 测试 Edge Function 是否正常工作
 */

import { supabase } from './src/client/supabase.js';

console.log('='.repeat(80));
console.log('测试 Edge Function: generate_fortune_detail');
console.log('='.repeat(80));
console.log();

const testData = {
  name: '测试用户',
  gender: '男',
  birthDate: '1990-05-15',
  birthTime: '14:30',
  bazi: '庚午 辛巳 甲辰 辛未',
  elements: {
    metal: 45,
    wood: 15,
    water: 0,
    fire: 20,
    earth: 20
  },
  recentEvents: '最近工作压力很大',
  focusArea: '事业',
  mood: '焦虑',
  personality: '果断刚毅'
};

console.log('📤 发送测试数据:', testData);
console.log();

console.log('⏳ 调用 Edge Function...');
const startTime = Date.now();

try {
  const { data, error } = await supabase.functions.invoke('generate_fortune_detail', {
    body: testData
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log();
  console.log('⏱️  耗时:', duration, '秒');
  console.log();

  if (error) {
    console.error('❌ 调用失败:', error);
    process.exit(1);
  }

  if (data && data.success) {
    console.log('✅ 调用成功！');
    console.log();
    console.log('📊 字数统计:');
    console.log('  - 事业运势:', data.data.career?.length || 0, '字');
    console.log('  - 财运分析:', data.data.wealth?.length || 0, '字');
    console.log('  - 婚姻感情:', data.data.love?.length || 0, '字');
    console.log('  - 健康养生:', data.data.health?.length || 0, '字');
    console.log('  - 开运指南:', data.data.advice?.length || 0, '字');
    console.log('  - 总计:', 
      (data.data.career?.length || 0) + 
      (data.data.wealth?.length || 0) + 
      (data.data.love?.length || 0) + 
      (data.data.health?.length || 0) + 
      (data.data.advice?.length || 0), '字');
    console.log();
    
    if (data.usage) {
      console.log('🔢 Token 使用:');
      console.log('  - 总计:', data.usage.total_tokens);
      console.log('  - 输入:', data.usage.prompt_tokens);
      console.log('  - 输出:', data.usage.completion_tokens);
      console.log();
    }
    
    console.log('📝 事业运势预览:');
    console.log(data.data.career?.substring(0, 200) + '...');
    console.log();
    
    console.log('='.repeat(80));
    console.log('✅ 测试通过！AI 增强功能正常工作');
    console.log('='.repeat(80));
  } else {
    console.error('❌ 返回数据格式错误:', data);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ 测试失败:', err);
  process.exit(1);
}
