# 手机验证码登录功能说明

## 更新日期
2026-02-21

## 功能概述

已成功添加手机验证码登录功能，所有用户注册时都需要绑定手机号。用户可以选择使用账号密码登录或手机验证码登录。

## 主要功能

### 1. 手机验证码登录
- 用户输入手机号
- 点击"获取验证码"按钮
- 输入收到的6位验证码
- 点击"立即登录"完成登录

### 2. 手机号注册
- 用户输入手机号
- 输入用户名和密码
- 输入邮箱（可选）
- 获取并输入验证码
- 完成注册并自动绑定手机号

### 3. 双登录方式
- **账号登录**：使用用户名+密码登录
- **手机登录**：使用手机号+验证码登录

## 技术实现

### 数据库结构

#### user_phones 表
```sql
CREATE TABLE public.user_phones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**字段说明**：
- `id`: 主键
- `user_id`: 关联的用户ID
- `phone`: 手机号（唯一）
- `verified`: 是否已验证
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**：
- `idx_user_phones_user_id`: 用户ID索引
- `idx_user_phones_phone`: 手机号索引

**RLS 策略**：
- 用户可以查看自己的手机号
- 用户可以插入自己的手机号
- 用户可以更新自己的手机号

### Edge Functions

#### 1. send-sms-code
**功能**：发送短信验证码

**请求参数**：
```json
{
  "mobile": "18600737571",
  "sessionId": "可选，用于关联发送和验证"
}
```

**响应**：
```json
{
  "success": true,
  "sessionId": "e325ea68-02c1-47ad-8844-c7b93cafaeba",
  "message": "验证码已发送"
}
```

**API 调用**：
- URL: `https://app-9sfsgfuorke9-api-W9z3M74x6ZNL-gateway.appmiaoda.com/v1/code/send_message`
- Method: POST
- Headers: 
  - `Content-Type: application/json`
  - `X-Gateway-Authorization: Bearer ${INTEGRATIONS_API_KEY}`

#### 2. verify-sms-code
**功能**：验证短信验证码

**请求参数**：
```json
{
  "mobile": "18600737571",
  "sessionId": "e325ea68-02c1-47ad-8844-c7b93cafaeba",
  "code": "123456"
}
```

**响应**：
```json
{
  "success": true,
  "message": "验证成功"
}
```

**API 调用**：
- URL: `https://app-9sfsgfuorke9-api-Xa6JZxjyqK0a-gateway.appmiaoda.com/v1/code/verify_message_code`
- Method: POST
- Headers:
  - `Content-Type: application/json`
  - `X-Gateway-Authorization: Bearer ${INTEGRATIONS_API_KEY}`

#### 3. phone-login
**功能**：手机号登录

**请求参数**：
```json
{
  "mobile": "18600737571",
  "code": "123456",
  "sessionId": "e325ea68-02c1-47ad-8844-c7b93cafaeba"
}
```

**响应**：
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "phone": "18600737571",
    "email": "user@example.com"
  },
  "message": "登录成功"
}
```

**流程**：
1. 验证验证码是否正确
2. 查找手机号对应的用户
3. 如果用户不存在，返回错误
4. 如果用户存在，生成登录令牌
5. 返回用户信息

### 前端实现

#### 数据库 API (src/db/phone.ts)

**主要方法**：
- `sendSmsCode(mobile, sessionId?)`: 发送短信验证码
- `verifySmsCode(mobile, code, sessionId)`: 验证短信验证码
- `loginWithPhone(mobile, code, sessionId)`: 手机号登录
- `bindPhoneToUser(userId, phone)`: 绑定手机号到用户
- `getUserPhone(userId)`: 获取用户的手机号
- `checkPhoneExists(phone)`: 检查手机号是否已注册
- `updateUserPhone(userId, phone)`: 更新手机号

#### AuthContext 更新

**新增方法**：
```typescript
signInWithPhone: (phone: string, code: string, sessionId: string) => Promise<{error: Error | null}>
```

**功能**：
- 调用 phone-login Edge Function
- 验证验证码
- 完成登录
- 刷新用户 session

#### 登录页面 (src/pages/login/index.tsx)

**新增状态**：
- `phone`: 手机号
- `smsCode`: 短信验证码
- `sessionId`: 会话ID
- `loginType`: 登录方式（'username' | 'phone'）
- `countdown`: 验证码倒计时

**新增方法**：
- `handleSendSmsCode()`: 发送短信验证码
- `handlePhoneAuth()`: 手机号登录/注册

**UI 更新**：
- 添加登录方式选择（账号登录 / 手机登录）
- 添加手机号输入框
- 添加验证码输入框
- 添加获取验证码按钮（带60秒倒计时）
- 注册模式下需要输入用户名、密码和手机号

## 使用流程

### 手机号登录流程

1. **选择登录方式**
   - 点击"手机登录"选项卡

2. **输入手机号**
   - 输入11位手机号
   - 格式：1[3-9]xxxxxxxxx

3. **获取验证码**
   - 点击"获取验证码"按钮
   - 等待短信验证码
   - 按钮显示60秒倒计时

4. **输入验证码**
   - 输入收到的6位验证码

5. **完成登录**
   - 点击"立即登录"按钮
   - 系统验证验证码
   - 登录成功后跳转到首页

### 手机号注册流程

1. **选择注册模式**
   - 点击"没有账号？立即注册"

2. **选择手机登录**
   - 点击"手机登录"选项卡

3. **填写注册信息**
   - 输入手机号
   - 输入用户名（3-20个字符）
   - 输入密码（至少6个字符）
   - 输入邮箱（可选）

4. **获取验证码**
   - 点击"获取验证码"按钮
   - 系统检查手机号是否已注册
   - 发送验证码到手机

5. **输入验证码**
   - 输入收到的6位验证码

6. **完成注册**
   - 点击"注册账户"按钮
   - 系统验证验证码
   - 创建账户并绑定手机号
   - 自动登录并跳转到首页

## 验证规则

### 手机号验证
- 格式：1[3-9]xxxxxxxxx
- 长度：11位
- 必须是中国大陆手机号

### 验证码验证
- 长度：6位数字
- 有效期：根据短信服务商设置
- 每个 sessionId 只能使用一次

### 注册验证
- 用户名：3-20个字符，只能包含字母、数字、下划线
- 密码：至少6个字符
- 手机号：必填，且不能重复
- 邮箱：可选，用于找回密码

## 安全机制

### 1. 验证码发送限制
- 60秒倒计时，防止频繁发送
- sessionId 机制，确保发送和验证的一致性

### 2. 手机号唯一性
- 数据库层面的 UNIQUE 约束
- 注册前检查手机号是否已存在

### 3. RLS 安全策略
- 用户只能查看和修改自己的手机号
- 防止数据泄露

### 4. API 认证
- 所有 API 调用都需要 INTEGRATIONS_API_KEY
- 密钥存储在 Edge Function 环境变量中
- 前端无法直接访问第三方 API

## 错误处理

### 常见错误

#### 1. 手机号格式错误
**错误信息**：请输入有效的手机号

**解决方案**：
- 检查手机号是否为11位
- 检查是否以1开头
- 检查第二位是否为3-9

#### 2. 手机号已注册
**错误信息**：该手机号已注册

**解决方案**：
- 使用手机号登录
- 或使用其他手机号注册

#### 3. 验证码错误
**错误信息**：验证码错误

**解决方案**：
- 检查验证码是否正确
- 检查验证码是否过期
- 重新获取验证码

#### 4. 手机号未注册
**错误信息**：该手机号未注册，请先注册

**解决方案**：
- 切换到注册模式
- 使用手机号注册账户

#### 5. 发送验证码失败
**错误信息**：发送验证码失败

**可能原因**：
- 网络问题
- 短信服务商问题
- API 配置问题

**解决方案**：
- 检查网络连接
- 稍后重试
- 联系技术支持

## 测试指南

### 测试1：手机号登录

**步骤**：
1. 打开登录页面
2. 点击"手机登录"选项卡
3. 输入已注册的手机号
4. 点击"获取验证码"
5. 输入收到的验证码
6. 点击"立即登录"

**预期结果**：
- ✅ 验证码发送成功
- ✅ 倒计时正常显示
- ✅ 登录成功
- ✅ 跳转到首页

### 测试2：手机号注册

**步骤**：
1. 打开登录页面
2. 点击"没有账号？立即注册"
3. 点击"手机登录"选项卡
4. 输入未注册的手机号
5. 输入用户名和密码
6. 点击"获取验证码"
7. 输入收到的验证码
8. 点击"注册账户"

**预期结果**：
- ✅ 验证码发送成功
- ✅ 注册成功
- ✅ 手机号绑定成功
- ✅ 自动登录
- ✅ 跳转到首页

### 测试3：验证码倒计时

**步骤**：
1. 点击"获取验证码"
2. 观察按钮状态

**预期结果**：
- ✅ 按钮显示"60秒"
- ✅ 每秒递减
- ✅ 倒计时期间按钮禁用
- ✅ 倒计时结束后按钮恢复

### 测试4：手机号重复检查

**步骤**：
1. 使用已注册的手机号注册
2. 点击"获取验证码"

**预期结果**：
- ✅ 显示"该手机号已注册"
- ✅ 不发送验证码

### 测试5：验证码错误

**步骤**：
1. 获取验证码
2. 输入错误的验证码
3. 点击"立即登录"

**预期结果**：
- ✅ 显示"验证码错误"
- ✅ 不允许登录

## 文件清单

### 数据库迁移
- `supabase/migrations/*_add_phone_to_users.sql`

### Edge Functions
- `supabase/functions/send-sms-code/index.ts`
- `supabase/functions/verify-sms-code/index.ts`
- `supabase/functions/phone-login/index.ts`

### 前端代码
- `src/db/phone.ts` - 手机号相关数据库操作
- `src/contexts/AuthContext.tsx` - 认证上下文（更新）
- `src/pages/login/index.tsx` - 登录页面（更新）

### 文档
- `PHONE_LOGIN_FEATURE.md` - 本文档

## 后续优化

### 短期优化
- [ ] 添加手机号绑定页面（个人中心）
- [ ] 支持更换手机号
- [ ] 添加手机号验证状态显示
- [ ] 优化错误提示信息

### 长期优化
- [ ] 支持国际手机号
- [ ] 添加语音验证码
- [ ] 实现手机号找回密码
- [ ] 添加手机号登录记录
- [ ] 实现多设备管理

## 注意事项

### 1. 短信费用
- 每条短信都会产生费用
- 建议设置发送频率限制
- 监控短信发送量

### 2. 安全建议
- 定期更换 API 密钥
- 监控异常登录行为
- 实现登录日志记录

### 3. 用户体验
- 验证码输入框自动聚焦
- 倒计时结束后自动重置
- 提供清晰的错误提示

### 4. 兼容性
- 确保在小程序和 H5 环境都能正常工作
- 测试不同手机号格式
- 处理网络异常情况

## 更新日期
2026-02-21

## 状态
✅ 数据库迁移已完成
✅ Edge Functions 已部署
✅ 前端代码已更新
✅ Lint 检查通过
⏳ 等待功能测试
