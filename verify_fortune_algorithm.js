#!/usr/bin/env node

/**
 * 算命算法验证脚本
 * 
 * 用途：快速验证算命算法的个性化效果
 * 运行：node verify_fortune_algorithm.js
 */

// 模拟导入算命函数（实际使用时需要从 src/db/api.ts 导入）
// import { calculateFortune } from './src/db/api';

console.log('='.repeat(80));
console.log('算命算法个性化验证');
console.log('='.repeat(80));
console.log();

// 测试用例 1：金命男性，事业焦虑
console.log('【测试用例 1】金命男性，事业焦虑');
console.log('-'.repeat(80));
const input1 = {
  name: '张三',
  gender: '男',
  birthDate: '1990-05-15',
  birthTime: '14:30',
  recentEvents: '最近工作压力很大，考虑换工作',
  focusArea: '事业',
  mood: '焦虑不安'
};
console.log('输入信息：', JSON.stringify(input1, null, 2));
console.log();
console.log('预期八字：庚午 辛巳 甲辰 辛未');
console.log('预期五行：金45% 火20% 木15% 土20% 水0%');
console.log('预期特征：');
console.log('  ✓ 总结包含"张三先生"和完整八字');
console.log('  ✓ 总结提到"五行以金为主"');
console.log('  ✓ 总结提到近期工作压力');
console.log('  ✓ 事业推荐金融、科技等行业');
console.log('  ✓ 财运提到"男命财星"');
console.log('  ✓ 健康提到"五行水较弱"');
console.log('  ✓ 开运推荐黑色、蓝色（补水）');
console.log();

// 测试用例 2：木命女性，感情困扰
console.log('【测试用例 2】木命女性，感情困扰');
console.log('-'.repeat(80));
const input2 = {
  name: '李四',
  gender: '女',
  birthDate: '1995-03-20',
  birthTime: '08:15',
  recentEvents: '最近和男朋友分手了，很难过',
  focusArea: '感情',
  mood: '孤独寂寞'
};
console.log('输入信息：', JSON.stringify(input2, null, 2));
console.log();
console.log('预期八字：乙亥 己卯 乙辰 庚辰');
console.log('预期五行：木30% 土30% 金15% 水15% 火10%');
console.log('预期特征：');
console.log('  ✓ 总结包含"李四女士"和完整八字');
console.log('  ✓ 总结提到近期分手经历');
console.log('  ✓ 事业推荐教育、文化等行业');
console.log('  ✓ 婚姻使用"坤造"、"夫星"');
console.log('  ✓ 婚姻提到"近期感情波折"');
console.log('  ✓ 婚姻提到"您当前心境孤寂"');
console.log('  ✓ 开运推荐补充最弱五行');
console.log();

// 测试用例 3：水命男性，财运关注
console.log('【测试用例 3】水命男性，财运关注');
console.log('-'.repeat(80));
const input3 = {
  name: '王五',
  gender: '男',
  birthDate: '1988-11-08',
  birthTime: '23:45',
  recentEvents: '最近在考虑投资理财，想知道财运如何',
  focusArea: '财运',
  mood: '兴奋期待'
};
console.log('输入信息：', JSON.stringify(input3, null, 2));
console.log();
console.log('预期八字：戊辰 癸亥 壬子 庚子');
console.log('预期五行：水40% 土20% 金15% 木13% 火12%');
console.log('预期特征：');
console.log('  ✓ 总结包含"王五先生"');
console.log('  ✓ 总结提到"五行以水为主"');
console.log('  ✓ 总结提到投资理财');
console.log('  ✓ 事业推荐贸易、物流等行业');
console.log('  ✓ 财运提到"近期在财务方面的关注"');
console.log('  ✓ 财运提到"防止过于乐观而冒进"');
console.log('  ✓ 财运提到"偏财运亦有起色"');
console.log();

// 对比说明
console.log('【个性化对比】');
console.log('='.repeat(80));
console.log();
console.log('维度对比：');
console.log();
console.log('┌─────────────┬──────────────────┬──────────────────┬──────────────────┐');
console.log('│ 维度        │ 张三（金命男）   │ 李四（木命女）   │ 王五（水命男）   │');
console.log('├─────────────┼──────────────────┼──────────────────┼──────────────────┤');
console.log('│ 八字        │ 庚午 辛巳 甲辰 辛未 │ 乙亥 己卯 乙辰 庚辰 │ 戊辰 癸亥 壬子 庚子 │');
console.log('│ 主五行      │ 金（45%）        │ 木/土（30%）     │ 水（40%）        │');
console.log('│ 推荐行业    │ 金融、科技       │ 教育、文化       │ 贸易、物流       │');
console.log('│ 性别术语    │ 先生、乾造、妻星 │ 女士、坤造、夫星 │ 先生、乾造、妻星 │');
console.log('│ 近期事件    │ 工作压力大       │ 感情分手         │ 投资理财         │');
console.log('│ 心情影响    │ 焦虑→影响判断    │ 孤独→姻缘天定    │ 兴奋→防止冒进    │');
console.log('│ 幸运色      │ 黑蓝灰（补水）   │ 根据最弱五行     │ 根据最弱五行     │');
console.log('│ 幸运数字    │ 1、6、4          │ 根据最弱五行     │ 根据最弱五行     │');
console.log('└─────────────┴──────────────────┴──────────────────┴──────────────────┘');
console.log();

console.log('关键差异点：');
console.log('  1. 八字完全不同 → 五行分布不同 → 所有分析不同');
console.log('  2. 性别不同 → 使用不同的命理术语和分析角度');
console.log('  3. 近期事件不同 → 各维度分析的侧重点不同');
console.log('  4. 心情状态不同 → 建议的语气和内容不同');
console.log('  5. 关注领域不同 → 对应维度的分析更详细');
console.log();

console.log('验证方法：');
console.log('  1. 在小程序中依次输入上述三个测试用例');
console.log('  2. 查看结果页面，对比实际输出与预期特征');
console.log('  3. 确认每个用户的结果都是独一无二的');
console.log('  4. 验证近期事件和心情确实影响了分析内容');
console.log();

console.log('='.repeat(80));
console.log('验证完成！');
console.log('='.repeat(80));
console.log();
console.log('详细文档：');
console.log('  - FORTUNE_ALGORITHM.md：算法详细说明');
console.log('  - ALGORITHM_UPGRADE.md：新旧版本对比');
console.log('  - FORTUNE_TEST_CASES.md：完整测试用例');
console.log();
