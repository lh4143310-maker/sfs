# 登录功能说明文档

## 功能概述

算命大师小程序支持两种登录方式：
1. **用户名密码登录/注册**（所有环境可用）
2. **微信一键登录**（仅微信小程序环境）

## 用户名密码认证

### 注册功能

**注册流程**：
1. 用户输入用户名和密码
2. 前端验证：
   - 用户名：3-20个字符，只能包含字母、数字、下划线
   - 密码：至少6个字符
3. 后端处理：
   - 将用户名转换为邮箱格式：`{username}@miaoda.com`
   - 创建 Supabase Auth 用户
   - 自动触发 `handle_new_user()` 函数创建 profile 记录
4. 注册成功后自动登录并跳转

**用户名规则**：
- 长度：3-20个字符
- 允许字符：字母（a-z, A-Z）、数字（0-9）、下划线（_）
- 不允许：中文、特殊符号、空格

**密码规则**：
- 最小长度：6个字符
- 无其他限制

### 登录功能

**登录流程**：
1. 用户输入用户名和密码
2. 前端验证格式
3. 后端验证凭证
4. 登录成功后跳转到之前访问的页面或首页

**错误处理**：
- "用户名或密码错误"：凭证不匹配
- "用户名格式不正确"：包含非法字符
- 其他错误会显示具体错误信息

## 微信一键登录

### 环境检测

小程序会自动检测运行环境：
- **微信小程序环境**：显示"微信一键登录"按钮
- **网页环境**：显示提示信息，引导用户使用用户名密码登录

### 登录流程

1. 用户点击"微信一键登录"按钮
2. 调用 `Taro.login()` 获取微信登录 code
3. 将 code 发送到后端 Edge Function `wechat_miniapp_login`
4. Edge Function 调用微信 API 获取 openid
5. 生成 magic link token
6. 前端使用 token 验证登录
7. 自动创建或关联用户账号

### 技术实现

**Edge Function**: `wechat_miniapp_login`
- 接收参数：`{ code: string }`
- 调用微信 API：`jscode2session`
- 返回：`{ token: string, openid: string }`

**环境变量**（需要配置）：
- `WECHAT_MINIPROGRAM_LOGIN_APP_ID`：微信小程序 AppID
- `WECHAT_MINIPROGRAM_LOGIN_APP_SECRET`：微信小程序 AppSecret

### 错误处理

- "微信登录仅支持微信小程序环境"：在非小程序环境尝试登录
- "获取微信登录凭证失败"：Taro.login() 失败
- "微信登录失败: {具体原因}"：后端处理失败
- "登录验证失败"：token 验证失败

## 隐私协议

### 必须同意

用户在登录或注册前必须勾选"我已阅读并同意《用户协议》和《隐私政策》"复选框。

### 验证逻辑

- 未勾选时点击登录/注册：显示提示"请先阅读并同意用户协议和隐私政策"
- 已勾选：允许继续认证流程

## 登录状态管理

### AuthContext

全局认证状态由 `src/contexts/AuthContext.tsx` 管理：

**状态**：
- `user`: 当前登录用户信息
- `userId`: 用户 ID
- `loading`: 加载状态

**方法**：
- `signInWithUsername(username, password)`: 用户名密码登录
- `signUpWithUsername(username, password)`: 用户名密码注册
- `signInWithWechat()`: 微信登录
- `signOut()`: 退出登录

### 路由守卫

`src/components/RouteGuard.tsx` 保护需要登录的页面：

**公开页面**（无需登录）：
- `/pages/index/index` - 首页
- `/pages/login/index` - 登录页

**受保护页面**（需要登录）：
- `/pages/input/index` - 测算输入页
- `/pages/result/index` - 测算结果页
- `/pages/history/index` - 历史记录页
- `/pages/profile/index` - 个人中心

### 登录跳转

**跳转逻辑**：
1. 用户访问受保护页面时，如未登录会被重定向到登录页
2. 登录页会保存原始访问路径到 `loginRedirectPath`
3. 登录成功后：
   - 如果原始路径是 TabBar 页面，使用 `Taro.switchTab()`
   - 如果是普通页面，使用 `Taro.navigateTo()`
   - 如果没有原始路径，跳转到首页

## 数据库同步

### 触发器

**触发器名称**: `on_auth_user_created`
**触发时机**: 用户注册时（INSERT）
**执行函数**: `handle_new_user()`

### Profile 创建

注册时自动创建 profile 记录：
```sql
INSERT INTO profiles (id, nickname, avatar_url, role, openid)
VALUES (
  NEW.id,
  COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.raw_user_meta_data->>'username', '用户_' || substr(NEW.id::text, 1, 6)),
  COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
  CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END,
  COALESCE((NEW.raw_user_meta_data->>'openid')::text, NULL)
);
```

**字段说明**：
- `id`: 与 auth.users.id 相同
- `nickname`: 优先使用 metadata 中的 nickname 或 username，否则生成默认昵称
- `avatar_url`: 从 metadata 获取（可选）
- `role`: 第一个用户为 admin，其他为 user
- `openid`: 微信登录时保存 openid

## 安全配置

### 邮箱验证

**状态**: 已禁用
**原因**: 使用虚拟邮箱（@miaoda.com），无需验证

### RLS 策略

Profiles 表的行级安全策略：
- 管理员：完全访问权限
- 普通用户：只能查看和修改自己的记录

## 用户体验优化

### 加载状态

- 登录/注册按钮在处理时显示加载动画
- 按钮文字变为"处理中..."或"登录中..."
- 禁用按钮防止重复提交

### 成功反馈

- 显示成功提示（1.5秒）
- 延迟跳转，让用户看到成功信息

### 错误提示

- 友好的中文错误信息
- 显示时长3秒
- 控制台输出详细错误日志

### 表单提示

- 输入框显示格式要求
- 注册模式下显示用户名规则提示
- 实时字符长度限制（用户名最多20字符）

## 测试建议

### 用户名密码测试

1. **注册新用户**：
   - 用户名：`testuser`
   - 密码：`123456`
   - 预期：注册成功，自动登录

2. **登录已有用户**：
   - 使用上述凭证登录
   - 预期：登录成功

3. **错误测试**：
   - 用户名包含中文：显示格式错误
   - 密码少于6位：显示长度错误
   - 错误密码：显示凭证错误

### 微信登录测试

1. **小程序环境**：
   - 点击微信登录按钮
   - 预期：调用微信授权，登录成功

2. **网页环境**：
   - 预期：显示提示信息，不显示登录按钮

## 常见问题

### Q: 为什么注册后需要再次登录？
A: 已修复。现在注册成功后会自动登录。

### Q: 微信登录在网页端不可用？
A: 正常。微信登录仅支持微信小程序环境，网页端请使用用户名密码登录。

### Q: 忘记密码怎么办？
A: 当前版本暂不支持密码重置。建议记住密码或联系管理员。

### Q: 可以修改用户名吗？
A: 用户名作为登录凭证，注册后不可修改。可以修改昵称（nickname）。

### Q: 第一个注册的用户是管理员吗？
A: 是的。第一个注册的用户自动获得 admin 角色。

---

**更新日期**: 2026-02-21
**版本**: 1.0
