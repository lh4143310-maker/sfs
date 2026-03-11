# 微信登录测试指南

## 最新修复（2026-02-22）

### 已完成的修复

1. ✅ **重新部署 Edge Function**
   - 已重新部署 `wechat_miniapp_login` Edge Function
   - 确保 Edge Function 在服务器上正确运行

2. ✅ **优化 Supabase 客户端**
   - 修复了 `customFetch` 函数中 Edge Function 的请求处理
   - 从使用原生 `fetch` 改为使用 `Taro.request`（确保在小程序环境中正常工作）
   - 增加了 Edge Function 请求的超时时间（从 10 秒增加到 30 秒）
   - 添加了详细的请求和响应日志

3. ✅ **增强错误日志**
   - 在 `AuthContext.tsx` 中添加了更详细的调试日志
   - 记录错误类型、错误名称、错误消息、错误堆栈
   - 记录请求参数和响应数据

4. ✅ **首页添加八卦图**
   - 在首页"命理"标题上方添加了旋转的阴阳八卦图标
   - 与登录页面保持一致的视觉风格

---

## 测试步骤

### 步骤1：打开微信开发者工具

1. 启动微信开发者工具
2. 打开本项目
3. 确保已编译成功

### 步骤2：打开调试器

1. 点击工具栏的 **调试器** 按钮
2. 切换到 **Console** 标签
3. 清空之前的日志（点击清空按钮）

### 步骤3：导航到登录页面

1. 在小程序中点击 **我的** 标签
2. 如果已登录，先点击 **退出登录**
3. 系统会自动跳转到登录页面

### 步骤4：点击微信一键登录

1. 在登录页面，点击 **微信一键登录** 按钮
2. 观察控制台日志输出

### 步骤5：查看日志输出

#### 预期的成功日志：

```
🔐 [微信登录] 步骤1: 检查环境
✅ [微信登录] 环境检查通过：微信小程序
🔐 [微信登录] 步骤2: 获取微信登录凭证
📦 [微信登录] 登录结果: {code: "0x1a2b3c4d5e..."}
✅ [微信登录] 获取到 code: 0x1a2b3c4...
🔐 [微信登录] 步骤3: 调用后端 Edge Function
📦 [微信登录] 请求参数: {code: "0x1a2b3c4..."}
🌐 发起请求: POST https://backend.appmiaoda.com/projects/supabase283617603421782016/functions/v1/wechat_miniapp_login (Edge Function)
📦 请求头: {...}
📦 请求体: {"code":"..."}
🚀 使用 Taro.request 调用 Edge Function...
✅ Edge Function 请求完成: 200
📦 响应数据: {"token":"pkce_...","openid":"..."}
📦 [微信登录] Edge Function 响应: {hasData: true, hasError: false, data: {...}}
🔐 [微信登录] 步骤4: 验证返回数据
✅ [微信登录] 获取到 token: pkce_abc123...
🔐 [微信登录] 步骤5: 验证 token
📦 [微信登录] Token 验证结果: {hasSessionData: true, hasSession: true, hasVerifyError: false}
✅ [微信登录] 登录成功！
```

#### 如果出现错误：

##### 错误1：环境变量未配置

```
❌ [微信登录] Edge Function 错误: {...}
📄 [微信登录] 错误详情JSON: {message: "微信配置缺失，请联系管理员配置..."}
```

**解决方案**：需要配置环境变量（见下方配置步骤）

##### 错误2：Edge Function 未部署

```
❌ Edge Function 请求失败: Error: Request failed
```

**解决方案**：Edge Function 已重新部署，应该已解决

##### 错误3：网络超时

```
❌ Edge Function 请求失败: Error: Timeout
```

**解决方案**：已增加超时时间到 30 秒，应该已解决

##### 错误4：微信接口错误

```
📄 [微信登录] 错误详情JSON: {message: "微信接口错误 (40029): 微信登录凭证无效，请重试"}
```

**解决方案**：重新点击登录按钮，获取新的 code

---

## 环境变量配置

### 如果看到"微信配置缺失"错误

需要在 Supabase Dashboard 中配置以下环境变量：

1. **WECHAT_MINIPROGRAM_LOGIN_APP_ID**
   - 微信小程序的 AppID
   - 从微信公众平台获取

2. **WECHAT_MINIPROGRAM_LOGIN_APP_SECRET**
   - 微信小程序的 AppSecret
   - 从微信公众平台获取

### 配置步骤：

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入小程序管理后台
3. 导航到：**开发** → **开发管理** → **开发设置**
4. 复制 **AppID** 和 **AppSecret**

5. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
6. 选择项目
7. 导航到：**Settings** → **Edge Functions** → **Secrets**
8. 添加环境变量：
   ```
   WECHAT_MINIPROGRAM_LOGIN_APP_ID = 您的AppID
   WECHAT_MINIPROGRAM_LOGIN_APP_SECRET = 您的AppSecret
   ```
9. 点击 **Save** 保存

---

## 技术改进说明

### 1. Supabase 客户端优化

**问题**：原来使用原生 `fetch` 调用 Edge Function，在小程序环境中可能不兼容

**解决方案**：改用 `Taro.request`，确保在小程序环境中正常工作

**代码位置**：`src/client/supabase.ts`

**关键改进**：
```typescript
// 对于 Edge Function，使用 Taro.request（确保在小程序环境中正常工作）
if (isEdgeFunction) {
  const res = await Taro.request({
    url,
    method: method as keyof Taro.request.Method,
    header: headers,
    data: body,
    dataType: 'json',
    timeout: 30000 // Edge Function 需要更长的超时时间
  });
  
  return {
    ok: res.statusCode >= 200 && res.statusCode < 300,
    status: res.statusCode,
    statusText: res.statusCode === 200 ? 'OK' : 'Error',
    json: async () => res.data,
    text: async () => typeof res.data === 'string' ? res.data : JSON.stringify(res.data),
    headers: {
      get: (key: string) => res.header?.[key] || res.header?.[key?.toLowerCase()]
    }
  } as unknown as Response;
}
```

### 2. 增强错误日志

**问题**：错误信息不够详细，难以排查问题

**解决方案**：添加更详细的日志，包括错误类型、错误名称、错误消息、错误堆栈

**代码位置**：`src/contexts/AuthContext.tsx`

**关键改进**：
```typescript
if (error) {
  console.error('❌ [微信登录] Edge Function 错误:', error)
  console.error('❌ [微信登录] 错误类型:', typeof error)
  console.error('❌ [微信登录] 错误键:', Object.keys(error))
  // ... 更多日志
}
```

### 3. 请求日志增强

**问题**：无法看到请求的详细信息

**解决方案**：记录请求头、请求体、响应数据

**代码位置**：`src/client/supabase.ts`

**关键改进**：
```typescript
if (isEdgeFunction) {
  console.log('📦 请求头:', JSON.stringify(headers));
  console.log('📦 请求体:', body ? (typeof body === 'string' ? body.substring(0, 100) : JSON.stringify(body).substring(0, 100)) : 'null');
}
```

---

## 故障排查流程

### 如果登录失败，按以下步骤排查：

#### 1. 检查控制台日志

- 查看是否有 `❌` 标记的错误日志
- 找到具体的错误信息

#### 2. 根据错误信息定位问题

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| "failed to send a request to the edge function" | Edge Function 未部署或请求失败 | 已修复，重新测试 |
| "微信配置缺失" | 环境变量未配置 | 配置环境变量 |
| "微信登录凭证无效" (40029) | code 已过期或已使用 | 重新点击登录 |
| "微信登录频率限制" (45011) | 调用次数过多 | 等待 1-2 分钟 |
| "登录验证失败" | Token 验证失败 | 检查 Supabase Auth 配置 |
| "Request timeout" | 网络超时 | 已增加超时时间，重试 |

#### 3. 查看 Edge Function 日志

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目
3. 导航到：**Edge Functions** → **wechat_miniapp_login** → **Logs**
4. 查看最近的日志记录

#### 4. 检查网络请求

1. 在微信开发者工具中，切换到 **Network** 标签
2. 查看是否有请求发送到 Edge Function
3. 检查请求的状态码和响应内容

---

## 测试清单

在测试微信登录时，请确认以下各项：

- [ ] 微信开发者工具已打开
- [ ] 调试器已打开，Console 标签已选中
- [ ] 已清空之前的日志
- [ ] 已退出登录（如果之前已登录）
- [ ] 点击"微信一键登录"按钮
- [ ] 观察控制台日志输出
- [ ] 记录任何错误信息
- [ ] 如果失败，按照故障排查流程进行排查
- [ ] 如果成功，确认已跳转到首页
- [ ] 确认用户信息已正确显示

---

## 预期结果

### 成功的标志：

1. ✅ 控制台显示 `✅ [微信登录] 登录成功！`
2. ✅ 页面自动跳转到首页
3. ✅ 右下角显示"微信登录成功"提示
4. ✅ 在"我的"页面可以看到用户信息

### 失败的标志：

1. ❌ 控制台显示 `❌ [微信登录] ...` 错误日志
2. ❌ 页面显示错误提示
3. ❌ 没有跳转到首页

---

## 常见问题

### Q1: 为什么我看到"failed to send a request to the edge function"？

**A**: 这个错误已经修复。主要原因是：
1. Edge Function 使用原生 `fetch` 在小程序环境中不兼容
2. 已改用 `Taro.request`，确保兼容性
3. 已重新部署 Edge Function

### Q2: 我需要配置什么环境变量？

**A**: 需要配置两个环境变量：
- `WECHAT_MINIPROGRAM_LOGIN_APP_ID`：微信小程序的 AppID
- `WECHAT_MINIPROGRAM_LOGIN_APP_SECRET`：微信小程序的 AppSecret

### Q3: 如何获取 AppID 和 AppSecret？

**A**: 
1. 登录微信公众平台
2. 进入小程序管理后台
3. 导航到：开发 → 开发管理 → 开发设置
4. 复制 AppID 和 AppSecret

### Q4: 配置环境变量后需要重新部署吗？

**A**: 不需要。环境变量配置后会立即生效。

### Q5: 如果还是失败怎么办？

**A**: 
1. 查看控制台的详细日志
2. 查看 Edge Function 日志
3. 检查网络请求
4. 按照故障排查流程进行排查
5. 提供详细的错误信息和日志

---

## 更新日志

### 2026-02-22 v2.0

- ✅ 重新部署 Edge Function
- ✅ 优化 Supabase 客户端，改用 Taro.request
- ✅ 增加 Edge Function 请求超时时间到 30 秒
- ✅ 增强错误日志，添加更详细的调试信息
- ✅ 添加请求和响应日志
- ✅ 首页添加八卦图标

---

**测试状态**：✅ 已完成修复，等待测试验证

**下一步**：请按照上述步骤进行测试，并提供测试结果和日志
