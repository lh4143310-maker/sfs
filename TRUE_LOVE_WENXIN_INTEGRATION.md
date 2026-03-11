# 正缘真人化预测 - AI大模型集成说明

## 功能概述

正缘真人化预测功能已成功集成AI大模型，用户填写个人信息后，系统将所有信息传递给AI大模型API，由AI生成详细的正缘预测报告。**采用一次性输出模式**，等待完整内容生成后一次性返回，确保稳定性和可靠性。

## 技术实现

### 1. 前端数据收集 (`/src/pages/true-love/index.tsx`)

用户在表单中填写以下信息：
- **姓名** (`name`)
- **性别** (`gender`)
- **出生日期** (`birthDate`)
- **出生时辰** (`birthTime`)
- **出生地** (`birthPlace`)
- **生活地** (`livePlace`)
- **现在工作** (`currentJob`)

点击"预测正缘"按钮后，所有信息存储到 localStorage 并跳转到结果页面。

### 2. Edge Function 调用

Edge Function 接收前端传递的所有用户信息，构造详细的系统提示词，然后调用AI大模型 API。

#### 2.1 接收用户信息
```typescript
const { name, birthDate, birthTime, gender, birthPlace, livePlace, currentJob } = await req.json();
```

#### 2.2 调用AI大模型 API
```typescript
const response = await fetch('https://app-9sfsgfuorke9-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Gateway-Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '请为我进行正缘真人化预测，我已准备好接收。' }
    ]
  }),
});
```

#### 2.3 一次性返回完整结果
Edge Function 读取AI大模型的流式响应，累积完整内容后一次性返回 JSON 格式：
```typescript
return new Response(
  JSON.stringify({ result: fullContent }),
  {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  }
);
```

### 3. 前端接收完整结果

前端使用简单的 fetch + await response.json() 获取完整结果：
```typescript
const response = await fetch(`${supabaseUrl}/functions/v1/generate_true_love_report`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TARO_APP_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify(data),
});

const responseData = await response.json();
setResult(responseData.result);
setComplete(true);
```

## 数据流程图

```
用户填写表单
    ↓
存储到 localStorage
    ↓
跳转到结果页面
    ↓
读取用户信息
    ↓
调用 Edge Function (generate_true_love_report)
    ↓
Edge Function 构造 Prompt
    ↓
调用AI大模型 API
    ↓
AI大模型返回流式响应
    ↓
Edge Function 累积完整内容
    ↓
一次性返回 JSON 格式结果
    ↓
前端显示完整报告
    ↓
保存到数据库
```

## 预测内容

AI大模型会根据用户信息生成以下详细预测：

1. **对方姓名与基本特征**
   - 姓名（姓氏必给，全名推测）
   - 年纪（与求测者差距）
   - 身高（精确到厘米）
   - 体型长相描述（黑痣、单双眼皮、肤色等）

2. **家庭与背景**
   - 家庭条件（贫富情况、父母职业）
   - 兄弟姐妹情况

3. **事业与才干**
   - 工作类型
   - 职位级别
   - 大致收入范围

4. **性格与喜好**
   - 脾气秉性
   - 抽烟喝酒等嗜好
   - 主要兴趣爱好

5. **关键的时间与空间**
   - 相遇时间（精确到月份或周）
   - 相遇地点（具体场景描述）
   - 对方居住地（方位和社区类型）

6. **婚恋进程**
   - 恋爱周期
   - 结婚时间

7. **婚后生活**
   - 家庭地位
   - 婚后财运变化
   - 是否有子女

## 特点

- ✅ **一次性输出**：等待完整内容生成后一次性返回，避免流式输出的兼容性问题
- ✅ **稳定可靠**：使用标准 JSON 格式返回，确保数据完整性
- ✅ **个性化**：基于用户的真实信息进行预测
- ✅ **详细具体**：预测内容详细且具体，不使用模糊词汇
- ✅ **时间准确**：确保预测的时间都在未来
- ✅ **纯文本输出**：不使用 Markdown 格式，便于阅读

## 测试验证

### 测试步骤
1. 打开小程序，进入"正缘真人化预测"页面
2. 填写完整的个人信息
3. 点击"预测正缘"按钮
4. 等待加载动画（大师正在闭目推演...）
5. 查看一次性显示的完整预测报告

### 预期结果
- 页面显示加载动画和提示文字
- 等待约10-30秒（取决于网络和AI生成速度）
- 完整报告一次性显示
- 报告内容详细，包含所有要求的预测项
- 可以进行大师咨询功能

## 注意事项

1. **API Key 配置**：确保 Supabase 项目中已配置 `INTEGRATIONS_API_KEY` 环境变量
2. **网络连接**：需要稳定的网络连接，生成时间约10-30秒
3. **加载等待**：用户需要耐心等待完整内容生成，期间显示加载动画
4. **错误处理**：所有错误都会通过 Toast 提示用户，并提供重试按钮
5. **输出模式**：采用一次性输出而非流式输出，确保兼容性和稳定性

## 相关文件

- 前端表单：`/src/pages/true-love/index.tsx`
- 结果页面：`/src/pages/true-love-result/index.tsx`
- Edge Function：`/supabase/functions/generate_true_love_report/index.ts`
- 数据库表：`true_love_records`

## 更新日期

2026-02-21

## 更新记录

- **2026-02-21 v2**：改为一次性输出模式，解决流式输出兼容性问题
- **2026-02-21 v1**：初始版本，使用流式输出
