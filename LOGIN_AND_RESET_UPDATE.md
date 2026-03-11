# 登录页面和密码重置功能更新

## 更新日期
2026-02-21

## 更新内容

### 1. 调整登录页面按钮间距

#### 问题描述
- "立即登录"按钮位置需要往下移动
- "注册"切换链接需要比"立即登录"再往下移动

#### 解决方案

**立即登录按钮**：
- 在按钮前添加 `<View className="mt-6" />`
- 增加 24px（6 * 4px）的上边距
- 使按钮与上方内容有更好的视觉分隔

**注册/登录切换链接**：
- 在切换链接前添加 `<View className="mt-8" />`
- 增加 32px（8 * 4px）的上边距
- 比登录按钮多 8px 的间距
- 形成更清晰的视觉层次

#### 修改代码
```tsx
{/* 提示信息 */}
{!isLogin && (
  <View className="bg-primary/5 rounded-lg p-3 border border-primary/20">
    <Text className="text-sm text-muted-foreground leading-relaxed">
      提示：用户名只能包含字母、数字和下划线。邮箱为可选项，填写后可用于找回密码。
    </Text>
  </View>
)}

{/* 增加间距 */}
<View className="mt-6" />

<Button onClick={handleUsernameAuth}>
  立即登录 / 注册账户
</Button>

{/* 注册/登录切换 - 增加更多间距 */}
<View className="mt-8" />

<View className="text-center" onClick={() => setIsLogin(!isLogin)}>
  <Text>没有账号？立即注册 →</Text>
</View>
```

#### 视觉效果
```
┌─────────────────────────┐
│ 密码输入框               │
├─────────────────────────┤
│ 记住我 / 忘记密码        │
├─────────────────────────┤
│ 提示信息（仅注册模式）    │
├─────────────────────────┤
│                         │  ← 24px 间距
│  [立即登录按钮]          │
│                         │
│                         │  ← 32px 间距
│  没有账号？立即注册 →    │
└─────────────────────────┘
```

### 2. 修复小程序密码重置链接空白问题

#### 问题描述
- 在小程序环境中点击邮件重置链接后页面显示空白
- `window.location.hash` 在小程序中不可用
- 原有的 Token 检测逻辑无法在小程序环境工作

#### 根本原因
小程序环境的限制：
1. 没有 `window.location` 对象
2. 无法直接访问 URL hash
3. 邮件链接可能无法直接打开小程序

#### 解决方案

**添加 Supabase Auth 状态监听器**：
```typescript
// 监听 Supabase auth 状态变化（适用于小程序和H5）
const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth 状态变化:', event, session);
  
  if (event === 'PASSWORD_RECOVERY') {
    console.log('检测到密码恢复事件，切换到重置步骤');
    setStep('reset');
    Taro.showToast({ 
      title: '请设置新密码', 
      icon: 'none',
      duration: 2000
    });
  }
});
```

**工作原理**：
1. Supabase SDK 会自动处理邮件链接中的 token
2. 当检测到密码恢复 token 时，触发 `PASSWORD_RECOVERY` 事件
3. 我们监听这个事件，自动切换到重置密码步骤
4. 这个方法在小程序和 H5 环境都有效

#### 完整的检测机制

现在使用四种方法检测重置令牌：

**方法1：Auth 状态监听（新增，最可靠）**
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    setStep('reset');
  }
});
```
- ✅ 适用于小程序
- ✅ 适用于 H5
- ✅ 自动处理 token
- ✅ 最可靠的方法

**方法2：Session 检测**
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  setStep('reset');
}
```
- ✅ 适用于小程序
- ✅ 适用于 H5
- ⚠️ 可能检测到普通登录

**方法3：URL Hash 检测**
```typescript
if (typeof window !== 'undefined') {
  const hash = window.location.hash;
  if (hash && hash.includes('access_token')) {
    setStep('reset');
  }
}
```
- ❌ 不适用于小程序
- ✅ 适用于 H5
- ⚠️ 仅作为备用方案

**方法4：用户状态检测**
```typescript
if (session?.user) {
  setStep('reset');
}
```
- ✅ 适用于小程序
- ✅ 适用于 H5
- ⚠️ 可能误判

#### 优先级顺序
1. **PASSWORD_RECOVERY 事件**（最优先，最可靠）
2. URL Hash 检测（H5 环境）
3. Session 检测（备用）
4. 用户状态检测（最后）

#### 清理资源
```typescript
// 清理监听器，避免内存泄漏
return () => {
  authListener?.subscription?.unsubscribe();
};
```

### 3. 小程序环境特殊说明

#### 邮件链接限制
⚠️ **重要**：小程序环境中，邮件链接可能无法直接打开小程序。

**原因**：
- 微信小程序需要特殊的 URL Scheme
- 普通的 HTTP 链接无法直接唤起小程序
- 需要配置小程序的 URL Link 或 URL Scheme

**建议方案**：

**方案1：使用 H5 中转页面**
1. 邮件链接指向 H5 页面
2. H5 页面检测环境
3. 如果在微信中，提示用户打开小程序
4. 或使用微信 JS-SDK 跳转到小程序

**方案2：使用小程序 URL Scheme**
1. 在 Supabase 配置中使用小程序 URL Scheme
2. 格式：`weixin://dl/business/?t=xxx`
3. 需要在微信公众平台配置

**方案3：提示用户手动操作**
1. 邮件中提示用户
2. 打开小程序
3. 进入"个人中心"
4. 点击"重置密码"

#### 当前实现
- ✅ H5 环境完全支持
- ✅ 小程序环境支持（如果能正确跳转）
- ⚠️ 需要配置小程序 URL Scheme

## 测试指南

### 测试1：登录页面按钮间距

**测试步骤**：
1. 打开登录页面
2. 观察"立即登录"按钮位置
3. 观察"没有账号？立即注册"链接位置

**预期结果**：
- ✅ "立即登录"按钮与上方内容有明显间距
- ✅ "立即注册"链接与登录按钮有更大间距
- ✅ 视觉层次清晰

### 测试2：H5 环境密码重置

**测试步骤**：
1. 在 H5 环境访问密码找回页面
2. 输入邮箱发送重置链接
3. 打开邮箱点击重置链接
4. 观察页面显示

**预期结果**：
- ✅ 页面自动切换到重置步骤
- ✅ 显示重置密码表单
- ✅ 可以输入新密码

### 测试3：小程序环境密码重置

**测试步骤**：
1. 在小程序中访问密码找回页面
2. 使用调试按钮切换到重置步骤
3. 测试重置表单功能

**预期结果**：
- ✅ 调试按钮正常工作
- ✅ 重置表单正常显示
- ✅ 可以输入和提交密码

**注意**：
- ⚠️ 邮件链接可能无法直接打开小程序
- ⚠️ 需要配置小程序 URL Scheme

### 测试4：Auth 状态监听

**测试步骤**：
1. 打开浏览器控制台
2. 访问密码找回页面
3. 查看控制台日志

**预期日志**：
```
开始检查重置令牌...
Auth 状态变化: SIGNED_OUT null
当前 session: null
URL hash: #/pages/reset-password/index
```

## 技术细节

### Supabase Auth 事件类型

```typescript
type AuthChangeEvent =
  | 'SIGNED_IN'           // 用户登录
  | 'SIGNED_OUT'          // 用户登出
  | 'TOKEN_REFRESHED'     // Token 刷新
  | 'USER_UPDATED'        // 用户信息更新
  | 'PASSWORD_RECOVERY'   // 密码恢复（我们需要的）
```

### 监听器生命周期

```typescript
useEffect(() => {
  // 创建监听器
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    // 处理事件
  });
  
  // 清理函数
  return () => {
    authListener?.subscription?.unsubscribe();
  };
}, []); // 空依赖数组，只在组件挂载时执行一次
```

### 内存泄漏预防

- ✅ 使用 `useEffect` 的清理函数
- ✅ 在组件卸载时取消订阅
- ✅ 避免重复创建监听器

## 已知问题和限制

### 问题1：小程序邮件链接
**描述**：邮件链接无法直接打开小程序

**影响**：用户需要手动打开小程序

**解决方案**：
- 配置小程序 URL Scheme
- 或使用 H5 中转页面
- 或提示用户手动操作

### 问题2：调试界面
**描述**：调试界面会在生产环境显示

**影响**：用户体验不佳

**解决方案**：
- 部署前移除调试代码
- 或使用环境变量控制

### 问题3：多次触发
**描述**：Auth 状态监听器可能多次触发

**影响**：可能显示多次 Toast

**解决方案**：
- 添加状态标记
- 防止重复切换

## 后续优化

### 短期优化
- [ ] 移除调试界面
- [ ] 配置小程序 URL Scheme
- [ ] 添加防重复触发逻辑
- [ ] 优化 Toast 提示

### 长期优化
- [ ] 创建 H5 中转页面
- [ ] 支持多种找回方式
- [ ] 添加邮箱绑定功能
- [ ] 改进小程序体验

## 文件清单

### 修改的文件
1. `/src/pages/login/index.tsx`
   - 添加登录按钮上方间距（mt-6）
   - 添加注册切换上方间距（mt-8）

2. `/src/pages/reset-password/index.tsx`
   - 添加 Auth 状态监听器
   - 监听 PASSWORD_RECOVERY 事件
   - 添加监听器清理逻辑

### 创建的文档
1. `LOGIN_AND_RESET_UPDATE.md` - 本文档

## 验证清单

### 代码验证
- [x] Lint 检查通过
- [x] 登录按钮间距已添加
- [x] 注册切换间距已添加
- [x] Auth 监听器已添加
- [x] 清理逻辑已添加

### 功能验证
- [ ] 登录页面布局正确
- [ ] H5 密码重置正常
- [ ] 小程序调试功能正常
- [ ] 控制台日志正确

## 总结

### 已完成
- ✅ 调整登录页面按钮间距
- ✅ 添加 Auth 状态监听器
- ✅ 支持 PASSWORD_RECOVERY 事件
- ✅ 代码通过 Lint 检查

### 待测试
- ⏳ 登录页面视觉效果
- ⏳ H5 密码重置流程
- ⏳ 小程序密码重置流程
- ⏳ Auth 监听器是否正常工作

### 待配置
- ⏳ 小程序 URL Scheme
- ⏳ Supabase redirectTo 配置
- ⏳ 邮件模板优化

## 更新日期
2026-02-21

## 状态
✅ 代码已修改并通过 Lint 检查
⏳ 等待实际测试验证
📝 已提供详细的更新说明
