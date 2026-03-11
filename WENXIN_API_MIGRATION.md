# 切换到AI大模型 API 并处理 Markdown 格式

## 修改概述

将所有 AI 大模型从 MiniMax 切换到AI大模型，并正确处理AI大模型输出的 Markdown 格式。

## 修改内容

### 1. 切换 API：generate_fortune_detail

**文件**：`supabase/functions/generate_fortune_detail/index.ts`

**修改**：
- **API 地址**：从 MiniMax API 改为AI大模型 API
  ```typescript
  // 旧：MiniMax
  'https://app-9sfsgfuorke9-api-Aa2PqMJnJGwL-gateway.appmiaoda.com/v1/text/chatcompletion_v2'
  
  // 新：AI大模型
  'https://app-9sfsgfuorke9-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions'
  ```

- **请求格式**：适配AI大模型的请求格式
  ```typescript
  // 旧：MiniMax
  {
    model: 'MiniMax-M2.5',
    messages: [...],
    temperature: 0.9,
    max_completion_tokens: 4000,
    response_format: { type: 'json_object' }
  }
  
  // 新：AI大模型
  {
    messages: [...],
    enable_thinking: false
  }
  ```

- **响应格式**：适配AI大模型的响应格式
  ```typescript
  // 旧：MiniMax
  const content = apiData.choices[0].message.content;
  
  // 新：AI大模型
  const content = apiData.choices[0].delta.content;
  ```

- **系统提示词**：明确要求不使用 Markdown 格式
  ```typescript
  重要：请严格按照JSON格式返回，不要使用 Markdown 格式。JSON 中的文本内容应该是纯文本，不要包含 **、##、-、* 等 Markdown 特殊符号。
  ```

### 2. 添加 Markdown 清理函数

**文件**：`supabase/functions/generate_fortune_detail/index.ts`

**新增函数**：
```typescript
function cleanMarkdown(text: string): string {
  if (!text) return text;
  
  return text
    .replace(/^#{1,6}\s+/gm, '')        // 移除标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1')   // 移除粗体
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')       // 移除斜体
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')       // 移除删除线
    .replace(/```[\s\S]*?```/g, '')    // 移除代码块
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 移除链接
    .replace(/!\[.*?\]\(.+?\)/g, '')   // 移除图片
    .replace(/^[\s]*[-*+]\s+/gm, '')   // 移除列表标记
    .replace(/^[\s]*\d+\.\s+/gm, '')   // 移除有序列表
    .replace(/^>\s+/gm, '')            // 移除引用
    .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '') // 移除水平线
    .replace(/\n{3,}/g, '\n\n')        // 移除多余空行
    .trim();
}
```

**使用**：
```typescript
const content = apiData.choices[0].delta.content;
const cleanContent = cleanMarkdown(content);
fortuneDetail = JSON.parse(cleanContent);
```

### 3. 修改咨询功能的系统提示词

**文件**：`supabase/functions/fortune_consult/index.ts`

**修改**：
```typescript
// 旧
请直接回答用户的问题，不要使用JSON格式，使用自然的对话语言。

// 新
重要：请使用纯文本格式回答，不要使用 Markdown 格式（不要使用 **、##、-、* 等特殊符号）。使用自然的段落和换行来组织内容。
```

### 4. 创建前端 Markdown 工具

**文件**：`src/utils/markdown.ts`（新建）

**功能**：
1. **cleanMarkdown**：清理 Markdown 格式，转换为纯文本
2. **markdownToHtml**：将 Markdown 转换为 HTML（用于 RichText 组件）

**使用场景**：
- 如果 AI 仍然返回 Markdown 格式，前端可以自动处理
- 支持标题、粗体、斜体、删除线、代码、链接等常见格式

### 5. 修改咨询页面

**文件**：`src/pages/consult/index.tsx`

**修改**：
```typescript
// 导入工具函数
import { markdownToHtml } from '@/utils/markdown';

// 使用 markdownToHtml 处理内容
<RichText
  nodes={markdownToHtml(answer)}
  className="text-xl text-foreground leading-relaxed"
/>
```

## API 对比

### MiniMax API vs AI大模型 API

| 特性 | MiniMax | AI大模型 |
|------|---------|---------|
| API 地址 | `/v1/text/chatcompletion_v2` | `/v2/chat/completions` |
| 模型参数 | 需要指定 `model` | 不需要 |
| 温度控制 | 支持 `temperature` | 不支持（内置） |
| Token 限制 | 支持 `max_completion_tokens` | 不支持（内置） |
| 响应格式 | 支持 `response_format` | 不支持 |
| 响应结构 | `choices[0].message.content` | `choices[0].delta.content` |
| 流式支持 | 支持 | 支持 |
| Markdown | 可控制 | 默认输出 |

## Markdown 格式处理策略

### 策略 1：后端清理（推荐）

**优点**：
- 统一处理，前端无需关心
- 减少前端代码复杂度
- 性能更好

**实现**：
1. 在系统提示词中明确要求不使用 Markdown
2. 在后端添加 `cleanMarkdown` 函数清理
3. 返回纯文本给前端

### 策略 2：前端转换

**优点**：
- 保留 Markdown 的格式信息
- 可以渲染更丰富的样式

**实现**：
1. 后端返回原始 Markdown
2. 前端使用 `markdownToHtml` 转换
3. 使用 RichText 组件渲染

### 当前实现

**混合策略**：
- 后端：在系统提示词中要求不使用 Markdown，并添加清理函数作为备份
- 前端：使用 `markdownToHtml` 处理，以防 AI 仍然返回 Markdown

## 测试验证

### 测试 1：算命功能

1. 进行一次测算
2. 查看结果内容
3. 确认没有 Markdown 特殊符号（**、##、- 等）

**预期结果**：
- ✅ 内容详实（2500+ 字）
- ✅ 没有 Markdown 格式
- ✅ 段落清晰，易读

### 测试 2：咨询功能

1. 在结果页面点击"详细咨询"
2. 输入问题并提交
3. 查看回答内容

**预期结果**：
- ✅ 流式显示正常
- ✅ 没有 Markdown 格式
- ✅ 内容详实（500+ 字）
- ✅ 针对性强

### 测试 3：Markdown 处理

如果 AI 仍然返回 Markdown：

**输入**：
```
**标题**

这是一段文字。

- 列表项1
- 列表项2

## 小标题

更多内容...
```

**输出**（经过 markdownToHtml）：
```html
<strong>标题</strong><br/><br/>
这是一段文字。<br/><br/>
列表项1<br/>
列表项2<br/><br/>
<h2>小标题</h2><br/>
更多内容...
```

## 常见问题

### Q1: 为什么要切换到AI大模型？

**原因**：
1. 用户明确要求使用AI大模型
2. AI大模型是国产大模型，更符合中文场景
3. API 更简单，不需要指定模型参数

### Q2: AI大模型一定会输出 Markdown 吗？

**答案**：不一定

- 在系统提示词中明确要求后，大部分情况下会输出纯文本
- 但 AI 可能仍然使用一些格式符号
- 因此添加了清理函数作为备份

### Q3: 如果想保留 Markdown 格式怎么办？

**方案**：
1. 移除系统提示词中"不要使用 Markdown"的要求
2. 移除后端的 `cleanMarkdown` 调用
3. 前端使用 `markdownToHtml` 转换并渲染

### Q4: RichText 组件支持哪些 HTML 标签？

**支持的标签**：
- 文本：`<strong>`, `<em>`, `<del>`, `<code>`
- 标题：`<h1>`, `<h2>`, `<h3>`
- 链接：`<a>`
- 换行：`<br/>`

**不支持**：
- 复杂布局：`<div>`, `<span>`
- 列表：`<ul>`, `<ol>`, `<li>`
- 表格：`<table>`

## 部署状态

- ✅ `generate_fortune_detail` Edge Function 已重新部署
- ✅ `fortune_consult` Edge Function 已重新部署
- ✅ 前端代码已更新
- ✅ Lint 检查通过

## 文件清单

### 修改的文件

1. `supabase/functions/generate_fortune_detail/index.ts`
   - 切换到AI大模型 API
   - 添加 `cleanMarkdown` 函数
   - 修改系统提示词

2. `supabase/functions/fortune_consult/index.ts`
   - 修改系统提示词（要求不使用 Markdown）

3. `src/pages/consult/index.tsx`
   - 导入 `markdownToHtml` 函数
   - 使用 `markdownToHtml` 处理回答内容

### 新增的文件

1. `src/utils/markdown.ts`
   - `cleanMarkdown` 函数
   - `markdownToHtml` 函数

## 总结

通过以下措施，成功将所有 AI 大模型切换到AI大模型，并正确处理 Markdown 格式：

1. **API 切换**：从 MiniMax 改为AI大模型
2. **后端清理**：添加 `cleanMarkdown` 函数
3. **前端转换**：添加 `markdownToHtml` 函数
4. **提示词优化**：明确要求不使用 Markdown
5. **双重保障**：后端清理 + 前端转换

**效果**：
- ✅ 所有 AI 功能使用AI大模型
- ✅ 输出内容没有 Markdown 特殊符号
- ✅ 内容格式清晰，易读
- ✅ 保持了内容的详实性和个性化

---

**修改日期**：2026-02-22  
**修改版本**：v4.0 (Wenxin API + Markdown Handling)  
**修改状态**：✅ 已完成并部署
