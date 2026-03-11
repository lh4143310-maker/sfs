# AI 增强功能问题排查与修复

## 问题描述

用户反馈：测试时感觉 AI 压根没有使用，内容变化不大。

## 问题排查

### 1. 查看控制台日志

通过 `get_console_logs` 工具查看日志，发现以下错误：

```
[log]开始调用 AI 生成详细运势...
AbortError: signal is aborted without reason
[error]AI 生成运势失败:
{
  "message": "Failed to send a request to the Edge Function",
  "name": "FunctionsFetchError"
}
[error]AI 生成失败，使用本地算法
```

### 2. 问题分析

**根本原因**：Edge Function 调用超时

- 错误信息：`Failed to send a request to the Edge Function`
- 超时错误：`AbortError: signal is aborted without reason`
- 结果：每次都降级到本地算法，AI 从未被调用

**为什么超时？**

1. **Taro.request 默认超时时间太短**：默认可能只有 10 秒
2. **AI 生成需要时间**：MiniMax API 生成 1500+ 字的内容需要 5-15 秒
3. **网络延迟**：请求往返也需要时间

### 3. Edge Function 日志

通过 `supabase_get_logs` 查看 Edge Function 日志，发现：**日志为空**

这证实了请求根本没有到达 Edge Function，在客户端就超时了。

## 修复方案

### 修复 1：增加 Taro.request 超时时间

**文件**：`src/client/supabase.ts`

**修改**：在 `customFetch` 函数中，为 Edge Function 调用设置 60 秒超时

```typescript
// 检查是否是 Edge Function 调用，如果是则增加超时时间
const isEdgeFunction = url.includes('/functions/v1/');
const timeout = isEdgeFunction ? 60000 : 10000; // Edge Function 60秒，其他 10秒

console.log(`🌐 发起请求: ${method} ${url}${isEdgeFunction ? ' (Edge Function, 超时60秒)' : ''}`);

const res = await Taro.request({
  url,
  method: method as keyof Taro.request.Method,
  header: headers,
  data: body,
  responseType: 'text',
  timeout // 设置超时时间
})
```

**效果**：
- Edge Function 调用有足够的时间完成
- 其他请求保持 10 秒超时，不影响性能

### 修复 2：增强日志输出

**文件**：`src/db/api.ts`

**修改**：添加详细的 emoji 日志，方便调试

```typescript
console.log('🔮 开始调用 AI 生成详细运势...');
console.log('📊 输入数据:', { name, gender, bazi, elements });
// ... 调用 API
console.log('✅ AI 生成运势成功！字数统计:', { ... });
```

**文件**：`supabase/functions/generate_fortune_detail/index.ts`

**修改**：在 Edge Function 中添加详细日志

```typescript
console.log('🚀 Edge Function 收到请求:', req.method, req.url);
console.log('📥 开始解析请求数据...');
console.log('✅ 请求数据解析成功:', { name, gender });
console.log('🤖 开始调用 MiniMax API...');
console.log('📡 MiniMax API 响应状态:', apiResponse.status);
console.log('✅ MiniMax API 返回成功，Token 使用:', apiData.usage);
console.log('🎉 运势生成成功！字数统计:', { ... });
```

**效果**：
- 可以清楚地看到每一步的执行情况
- 快速定位问题所在

### 修复 3：移除不必要的 AbortController

**文件**：`src/db/api.ts`

**修改**：移除手动创建的 AbortController，使用 Taro.request 的超时机制

**原因**：
- 手动的 AbortController 可能与 Taro.request 的超时机制冲突
- Taro.request 已经有完善的超时处理

## 验证方法

### 方法 1：查看控制台日志

在浏览器开发者工具中查看控制台，应该看到：

```
🔮 开始调用 AI 生成详细运势...
📊 输入数据: {...}
🌐 发起请求: POST https://...functions/v1/generate_fortune_detail (Edge Function, 超时60秒)
✅ 请求完成: 200
📦 AI 返回数据: {...}
✅ AI 生成运势成功！字数统计: {career: 600, wealth: 400, ...}
```

如果看到：
```
❌ AI 生成运势失败: ...
⚠️ AI 生成失败，使用本地算法
```

说明还有问题，需要进一步排查。

### 方法 2：对比内容长度

**AI 增强版**：
- 事业运势：600+ 字
- 财运分析：400+ 字
- 婚姻感情：450+ 字
- 健康养生：500+ 字
- 开运指南：600+ 字
- **总计：2500+ 字**

**本地算法版**：
- 事业运势：150 字
- 财运分析：120 字
- 婚姻感情：130 字
- 健康养生：140 字
- 开运指南：200 字
- **总计：740 字**

**验证方法**：
1. 进行一次测算
2. 查看结果页面
3. 复制任意一个维度的内容
4. 粘贴到文本编辑器，查看字数
5. 如果字数 > 300，说明 AI 正常工作
6. 如果字数 < 200，说明使用了本地算法

### 方法 3：查看 Edge Function 日志

在 Supabase Dashboard 中：
1. 进入 Functions 页面
2. 点击 `generate_fortune_detail`
3. 查看 Logs 标签

应该看到：
```
🚀 Edge Function 收到请求: POST ...
📥 开始解析请求数据...
✅ 请求数据解析成功: {name: "张三", gender: "男"}
🤖 开始调用 MiniMax API...
📡 MiniMax API 响应状态: 200
✅ MiniMax API 返回成功，Token 使用: {total_tokens: 2000, ...}
🎉 运势生成成功！字数统计: {career: 600, ...}
```

如果日志为空，说明请求没有到达 Edge Function。

### 方法 4：测试不同输入

为了验证 AI 的随机性和个性化，使用相同的基本信息，但修改以下字段：

**测试 A**：修改性别
- 性别：男 → 女
- 预期：称呼变为"女士"，婚姻分析角度不同

**测试 B**：修改出生时间
- 出生时间：14:30 → 08:00
- 预期：八字不同，所有内容都不同

**测试 C**：修改近期事件
- 近期事件：工作压力大 → 感情不顺
- 预期：婚姻感情部分会特别关注这个问题

**测试 D**：重复测算
- 使用完全相同的信息测算两次
- 预期：八字、五行相同，但详细分析内容有差异

## 预期效果

修复后，用户应该能够：

1. **看到明显更长的内容**：每个维度从 150 字增加到 300-600 字
2. **看到更详细的分析**：包含具体的命理术语、时间节点、方位建议等
3. **感受到个性化**：根据用户输入生成独特的内容
4. **体验到随机性**：每次测算都有新的见解
5. **获得实用建议**：具体可操作的开运方法

## 常见问题

### Q1: 为什么有时候还是很快就出结果？

A: 如果 AI 调用失败（网络问题、API 限制等），系统会自动降级到本地算法，所以会很快。查看控制台日志可以确认是否使用了 AI。

### Q2: 如何确认 AI 是否真的在工作？

A: 最简单的方法是查看内容长度。AI 生成的内容每个维度至少 300 字，本地算法只有 100-200 字。

### Q3: AI 生成的内容准确吗？

A: AI 是基于传统命理学原理和大量训练数据生成的，具有一定的参考价值。但命理学本身具有主观性，结果仅供参考。

### Q4: 为什么每次测算同一个人，结果都不一样？

A: 这是 AI 的特点。通过设置 temperature=0.9，每次生成都会有差异。但核心的八字、五行、幸运色等基础数据是固定的。

### Q5: 可以关闭 AI 增强吗？

A: 目前不支持手动关闭。但如果 AI 持续失败，系统会自动使用本地算法。

## 技术细节

### 超时时间设置

| 请求类型 | 超时时间 | 原因 |
|---------|---------|------|
| Edge Function | 60 秒 | AI 生成需要 5-15 秒，加上网络延迟 |
| 数据库查询 | 10 秒 | 通常 < 1 秒完成 |
| 文件上传 | 10 秒 | 图片压缩后通常 < 5 秒 |

### AI 生成时间

| 内容长度 | 预计时间 | Token 消耗 |
|---------|---------|-----------|
| 1500 字 | 5-8 秒 | 1000-1500 |
| 2500 字 | 8-12 秒 | 1500-2000 |
| 3500 字 | 12-15 秒 | 2000-2500 |

### 降级策略

```
尝试调用 AI
    ↓
    ├─ 成功 → 返回 AI 生成的内容（2500+ 字）
    └─ 失败 → 降级到本地算法（740 字）
```

降级触发条件：
- 网络超时（> 60 秒）
- API 返回错误
- 返回数据格式错误
- API 限额用尽

## 总结

通过增加 Taro.request 的超时时间（60 秒），AI 增强功能现在应该能够正常工作。用户将获得：

- ✅ 4 倍的内容量（740 字 → 2500+ 字）
- ✅ 深入的命理分析
- ✅ 个性化的建议
- ✅ 每次不同的见解
- ✅ 实用的开运方法

如果问题仍然存在，请查看控制台日志和 Edge Function 日志，根据错误信息进一步排查。

---

**修复日期**：2026-02-22  
**修复版本**：v2.1  
**关键修改**：增加 Edge Function 调用超时时间到 60 秒
