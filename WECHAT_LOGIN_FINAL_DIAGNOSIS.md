# 微信登录问题最终诊断报告

## 诊断日期：2026-02-22

---

## 问题现象

用户反馈：点击"微信一键登录"后，依旧显示错误：`edge function returned a non-2xx status code`

---

## 深度诊断过程

### 步骤1：检查控制台和网络日志

**结果**：日志中没有微信登录相关的请求记录

**分析**：用户可能还没有实际测试，或者日志已被清空

### 步骤2：检查 Supabase 客户端代码

**位置**：`src/client/supabase.ts`

**发现**：
- Edge Function 请求使用 `Taro.request` 实现
- 当返回非 2xx 状态码时，代码会返回 `ok: false` 的 Response 对象
- 但没有记录详细的错误信息

**改进**：
```typescript
// 如果状态码不是 2xx，记录详细错误信息
if (res.statusCode < 200 || res.statusCode >= 300) {
  console.error(`❌ Edge Function 返回错误状态码: ${res.statusCode}`);
  console.error('❌ 错误响应数据:', JSON.stringify(res.data));
}
```

### 步骤3：验证 Edge Function 是否正常工作

**方法**：创建测试脚本 `test-wechat-login.js`

**测试结果**：

#### 测试1：OPTIONS 请求（CORS 预检）
```
✅ 成功
状态码: 204
CORS 头: *
```

#### 测试2：POST 请求（缺少 code 参数）
```
✅ 成功
状态码: 400
响应: {"message": "缺少微信登录凭证 code"}
```

#### 测试3：POST 请求（带有测试 code）
```
⚠️  环境变量未配置
状态码: 500
响应: {"message": "微信配置缺失，请联系管理员配置 WECHAT_MINIPROGRAM_LOGIN_APP_ID 和 WECHAT_MINIPROGRAM_LOGIN_APP_SECRET"}
```

### 步骤4：确认根本原因

**结论**：Edge Function 正常工作，问题是环境变量未配置

---

## 根本原因

**微信小程序的 AppID 和 AppSecret 环境变量未配置**

Edge Function 在检测到环境变量缺失时，返回 500 状态码和错误信息：
```json
{
  "message": "微信配置缺失，请联系管理员配置 WECHAT_MINIPROGRAM_LOGIN_APP_ID 和 WECHAT_MINIPROGRAM_LOGIN_APP_SECRET"
}
```

这就是用户看到的 `edge function returned a non-2xx status code` 错误的原因。

---

## 解决方案

### 方案概述

用户需要配置两个环境变量：
1. `WECHAT_MINIPROGRAM_LOGIN_APP_ID`：微信小程序的 AppID
2. `WECHAT_MINIPROGRAM_LOGIN_APP_SECRET`：微信小程序的 AppSecret

### 详细配置步骤

#### 步骤1：获取微信凭证

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入您的小程序管理后台
3. 导航到：**开发** → **开发管理** → **开发设置**
4. 在"开发者ID"部分，找到：
   - **AppID (小程序ID)**：格式类似 `wx1234567890abcdef`
   - **AppSecret (小程序密钥)**：点击"生成"或"重置"按钮获取

⚠️ **重要提示**：
- AppSecret 只显示一次，请立即复制保存
- 如果忘记了 AppSecret，需要重置（会使旧的失效）

#### 步骤2：配置环境变量

系统已经注册了这两个环境变量，会自动提示您输入。

**配置界面会要求输入**：

1. **WECHAT_MINIPROGRAM_LOGIN_APP_ID**
   - 输入您的小程序 AppID
   - 示例：`wx1234567890abcdef`

2. **WECHAT_MINIPROGRAM_LOGIN_APP_SECRET**
   - 输入您的小程序 AppSecret
   - 示例：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

#### 步骤3：测试登录

配置完成后：

1. 在小程序中，点击 **我的** 标签
2. 如果已登录，先点击 **退出登录**
3. 点击 **微信一键登录** 按钮
4. 观察控制台日志

**预期的成功日志**：
```
🔐 [微信登录] 步骤1: 检查环境
✅ [微信登录] 环境检查通过：微信小程序
🔐 [微信登录] 步骤2: 获取微信登录凭证
✅ [微信登录] 获取到 code: 0x1a2b3c4...
🔐 [微信登录] 步骤3: 调用后端 Edge Function
🌐 发起请求: POST https://backend.appmiaoda.com/.../functions/v1/wechat_miniapp_login (Edge Function)
🚀 使用 Taro.request 调用 Edge Function...
✅ Edge Function 请求完成: 200
📦 响应数据: {"token":"pkce_...","openid":"..."}
🔐 [微信登录] 步骤4: 验证返回数据
✅ [微信登录] 获取到 token: pkce_abc123...
🔐 [微信登录] 步骤5: 验证 token
✅ [微信登录] 登录成功！
```

---

## 已完成的改进

### 1. 缩小删除按钮的粉色框

**位置**：`src/pages/history/index.tsx`

**修改**：
- 内边距从 `p-1` 改为 `px-2 py-1`（更精确的控制）
- 图标大小从 `text-xl` 改为 `text-lg`（更小）

**效果**：删除按钮的粉色背景框变小，更加精致

### 2. 增强 Edge Function 错误日志

**位置**：`src/client/supabase.ts`

**修改**：
```typescript
// 如果状态码不是 2xx，记录详细错误信息
if (res.statusCode < 200 || res.statusCode >= 300) {
  console.error(`❌ Edge Function 返回错误状态码: ${res.statusCode}`);
  console.error('❌ 错误响应数据:', JSON.stringify(res.data));
}
```

**效果**：当 Edge Function 返回错误时，控制台会显示详细的错误信息

### 3. 创建 Edge Function 测试脚本

**位置**：`test-wechat-login.js`

**功能**：
- 测试 OPTIONS 请求（CORS 预检）
- 测试 POST 请求（缺少参数）
- 测试 POST 请求（带有测试 code）
- 自动诊断问题并给出配置建议

**使用方法**：
```bash
node test-wechat-login.js
```

---

## 为什么微信登录一直失败？

### 技术原因

1. **Edge Function 正常工作**
   - 测试脚本验证了 Edge Function 可以正常接收请求
   - CORS 配置正确
   - 错误处理逻辑正确

2. **环境变量未配置**
   - Edge Function 需要两个环境变量才能调用微信接口
   - 这两个变量包含敏感信息（AppID 和 AppSecret）
   - 出于安全考虑，不能硬编码在代码中

3. **错误提示不够明确**
   - 原来的错误提示只显示 "edge function returned a non-2xx status code"
   - 用户不知道具体是什么问题
   - 现在已优化，会显示 "微信登录功能需要配置，请联系管理员完成配置后再试"

### 用户视角

从用户的角度看：
1. 点击"微信一键登录"
2. 前端调用 `Taro.login()` 获取 code
3. 前端将 code 发送到 Edge Function
4. Edge Function 检查环境变量，发现未配置
5. Edge Function 返回 500 错误
6. 前端显示错误提示

**关键点**：第4步失败了，因为环境变量未配置

---

## 配置后的预期流程

配置环境变量后，完整的登录流程：

1. **前端**：用户点击"微信一键登录"
2. **前端**：调用 `Taro.login()` 获取临时登录凭证 `code`
3. **前端**：将 `code` 发送到 Edge Function
4. **Edge Function**：检查环境变量 ✅ 已配置
5. **Edge Function**：使用 `code`、`AppID`、`AppSecret` 调用微信接口
6. **微信接口**：验证凭证，返回用户的 `openid` 和 `session_key`
7. **Edge Function**：使用 `openid` 生成 Supabase 登录令牌
8. **Edge Function**：返回令牌给前端
9. **前端**：使用令牌完成登录
10. **前端**：跳转到首页，显示"微信登录成功"

---

## 常见问题

### Q1: 我已经配置了环境变量，为什么还是失败？

**A**: 请检查：
1. 变量名是否正确（区分大小写）
   - `WECHAT_MINIPROGRAM_LOGIN_APP_ID`
   - `WECHAT_MINIPROGRAM_LOGIN_APP_SECRET`
2. 变量值是否正确（无多余空格）
3. 是否已保存配置
4. 重新测试登录

### Q2: 如何验证环境变量是否配置成功？

**A**: 查看控制台日志：
```
📦 [微信登录] 环境变量状态: {
    hasAppId: true,      // ← 应该是 true
    hasAppSecret: true,  // ← 应该是 true
    appIdLength: 18,
    appSecretLength: 32
}
```

如果 `hasAppId` 和 `hasAppSecret` 都是 `true`，说明配置成功。

### Q3: 配置后还是返回错误怎么办？

**A**: 可能的原因：
1. **微信接口错误 (40029)**：code 无效或已过期
   - 解决方案：重新点击登录按钮
2. **微信接口错误 (45011)**：调用频率限制
   - 解决方案：等待 1-2 分钟
3. **AppID 或 AppSecret 错误**
   - 解决方案：检查配置的值是否正确

### Q4: 测试脚本显示什么结果才算正常？

**A**: 
- 测试1（OPTIONS）：状态码 204 ✅
- 测试2（缺少 code）：状态码 400，提示"缺少微信登录凭证 code" ✅
- 测试3（测试 code）：
  - 未配置：状态码 500，提示"微信配置缺失" ⚠️
  - 已配置：状态码 500，提示"微信接口错误" ✅（因为使用了测试 code）

---

## 测试清单

### 配置前测试
- [x] 运行测试脚本 `node test-wechat-login.js`
- [x] 确认 Edge Function 正常工作
- [x] 确认错误是环境变量未配置

### 配置环境变量
- [ ] 登录微信公众平台
- [ ] 获取 AppID 和 AppSecret
- [ ] 在系统提示时输入配置
- [ ] 保存配置

### 配置后测试
- [ ] 重新运行测试脚本
- [ ] 确认环境变量已配置（测试3返回微信接口错误而非配置缺失）
- [ ] 在小程序中测试登录
- [ ] 查看控制台日志
- [ ] 确认登录成功

---

## 修改文件清单

### 1. src/pages/history/index.tsx
- 缩小删除按钮的内边距和图标大小

### 2. src/client/supabase.ts
- 增强 Edge Function 错误日志

### 3. test-wechat-login.js（新建）
- 创建 Edge Function 测试脚本

### 4. WECHAT_LOGIN_FINAL_DIAGNOSIS.md（本文件）
- 创建最终诊断报告

---

## 代码质量

✅ **Lint 检查通过**：33 个文件，无错误

---

## 总结

### 问题本质

微信登录功能的 Edge Function 需要两个环境变量（AppID 和 AppSecret）才能正常工作。这两个变量未配置时，Edge Function 返回 500 状态码，导致前端显示 "edge function returned a non-2xx status code" 错误。

### 解决方案

用户需要：
1. 从微信公众平台获取 AppID 和 AppSecret
2. 在系统提示时输入这两个值
3. 测试微信登录功能

### 验证方法

1. **运行测试脚本**：`node test-wechat-login.js`
2. **查看控制台日志**：确认环境变量状态
3. **实际测试登录**：在小程序中点击"微信一键登录"

### 预期结果

配置完成后：
- ✅ 点击"微信一键登录"
- ✅ 自动跳转到首页
- ✅ 显示"微信登录成功"
- ✅ 用户信息正确显示

---

**状态**：✅ 诊断完成，Edge Function 正常工作，等待用户配置环境变量

**下一步**：用户配置环境变量后，重新测试登录功能

**相关文档**：
- 配置指南：`WECHAT_LOGIN_SETUP.md`
- 测试指南：`WECHAT_LOGIN_TEST.md`
- 修复总结：`WECHAT_LOGIN_FIX_SUMMARY.md`
- 综合修复：`WECHAT_LOGIN_COMPREHENSIVE_FIX.md`
- 最终诊断：`WECHAT_LOGIN_FINAL_DIAGNOSIS.md`（本文件）
