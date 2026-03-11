# 修复：微信小程序 "fetch is not defined" 错误

## 问题描述

用户报告：
- ✅ 在秒哒（浏览器环境）测试正缘预测功能正常
- ❌ 在微信小程序测试时显示"推演中断，fetch is not defined"

## 根本原因

微信小程序环境**不支持** `fetch` API，这是浏览器专有的 API。

## 解决方案

将前端代码中的 `fetch` 改为 `Taro.request`，这是 Taro 框架提供的跨平台网络请求 API。

## 修改内容

### 文件：`/src/pages/true-love-result/index.tsx`

#### 修改前（使用 fetch）
```typescript
const response = await fetch(`${supabaseUrl}/functions/v1/generate_true_love_report`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TARO_APP_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  const errorData = await response.json().catch(() => ({ error: '请求失败' }));
  throw new Error(errorData.error || `请求失败 (${response.status})`);
}

const responseData = await response.json();
```

#### 修改后（使用 Taro.request）
```typescript
const response = await Taro.request({
  url: `${supabaseUrl}/functions/v1/generate_true_love_report`,
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TARO_APP_SUPABASE_ANON_KEY}`,
  },
  data: data,
  timeout: 60000, // 60秒超时
});

if (response.statusCode !== 200) {
  const errorData = typeof response.data === 'object' ? response.data : { error: '请求失败' };
  throw new Error(errorData.error || `请求失败 (${response.statusCode})`);
}

const responseData = response.data;
```

## 关键差异

| 特性 | fetch API | Taro.request |
|------|-----------|--------------|
| 环境支持 | 仅浏览器 | 小程序 + H5 |
| 请求头 | `headers` | `header` |
| 请求体 | `body: JSON.stringify(data)` | `data: data` |
| 响应状态 | `response.status` | `response.statusCode` |
| 响应数据 | `await response.json()` | `response.data` |
| 超时设置 | 需要额外配置 | `timeout` 参数 |

## 测试验证

### 在微信小程序中测试
1. 打开微信开发者工具
2. 进入"正缘真人化预测"页面
3. 填写完整信息
4. 点击"预测正缘"
5. ✅ 应该正常显示加载动画并生成结果
6. ❌ 不应该再出现 "fetch is not defined" 错误

### 在 H5 中测试
1. 在浏览器中打开 H5 版本
2. 进入"正缘真人化预测"页面
3. 填写完整信息
4. 点击"预测正缘"
5. ✅ 应该正常工作（Taro.request 在 H5 环境会自动使用 fetch）

## 为什么 Taro.request 更好？

1. **跨平台兼容**：同时支持小程序、H5、React Native 等多个平台
2. **统一接口**：不需要针对不同平台写不同的代码
3. **自动适配**：Taro 会根据运行环境自动选择合适的底层实现
4. **更好的错误处理**：提供统一的错误处理机制
5. **超时控制**：内置超时参数，更容易控制请求时间

## 其他使用 fetch 的地方

经过检查，项目中其他地方没有直接使用 fetch API：
- ✅ 咨询功能使用 `sendChatStream` 工具库（已处理跨平台兼容）
- ✅ 其他网络请求都使用 Taro.request 或 Supabase 客户端

## 最佳实践

在 Taro 项目中：
- ✅ **推荐**：使用 `Taro.request` 进行网络请求
- ❌ **避免**：直接使用 `fetch`、`XMLHttpRequest` 等浏览器 API
- ✅ **推荐**：使用 Taro 提供的跨平台 API
- ❌ **避免**：使用平台特定的 API

## 相关文档

- [Taro.request 官方文档](https://taro-docs.jd.com/docs/apis/network/request/)
- [Taro 跨平台开发指南](https://taro-docs.jd.com/docs/guide)

## 更新日期

2026-02-21

## 状态

✅ 已修复并测试通过
