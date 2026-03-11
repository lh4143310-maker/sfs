# 功能更新说明

## 更新日期
2026-02-21

## 更新内容

### 1. 运势预测页面添加页面标题设计

#### 修改文件
- `/src/pages/input/index.tsx`

#### 更新内容
在运势预测页面顶部添加了与姻缘配对和正缘预测页面一致的标题设计：

```tsx
{/* 页面标题 */}
<View className="mb-10 text-center">
  <View className="i-mdi-chart-timeline-variant text-7xl text-primary mx-auto mb-4" />
  <Text className="text-4xl font-bold text-foreground">运势预测</Text>
  <Text className="text-xl text-muted-foreground mt-2 block">洞察未来趋势，把握人生机遇</Text>
</View>
```

#### 设计特点
- **图标**：使用 `i-mdi-chart-timeline-variant`（趋势图标），大小 `text-7xl`
- **主标题**：运势预测，字体大小 `text-4xl`，加粗
- **副标题**：洞察未来趋势，把握人生机遇，字体大小 `text-xl`，柔和色调

#### 与其他页面对比

| 页面 | 图标 | 主标题 | 副标题 |
|------|------|--------|--------|
| 运势预测 | i-mdi-chart-timeline-variant | 运势预测 | 洞察未来趋势，把握人生机遇 |
| 姻缘配对 | i-mdi-heart-multiple | 姻缘八字合婚 | 前世缘定，今生相守 |
| 正缘预测 | i-mdi-heart-multiple | 正缘真人化预测 | 精准推演您的命中之人 |

### 2. 添加密码找回功能

#### 新增文件
- `/src/pages/reset-password/index.tsx` - 密码找回页面
- `/src/pages/reset-password/index.config.ts` - 页面配置

#### 修改文件
- `/src/pages/login/index.tsx` - 添加"忘记密码"链接
- `/src/app.config.ts` - 添加密码找回页面路由

#### 功能流程

##### 步骤1：输入邮箱
- 用户在登录页面点击"忘记密码？"
- 跳转到密码找回页面
- 输入注册时使用的邮箱地址
- 点击"发送重置链接"

##### 步骤2：发送邮件
- 系统调用 Supabase Auth API 发送密码重置邮件
- 邮件包含重置链接，有效期24小时
- 显示倒计时（60秒），防止频繁发送

##### 步骤3：检查邮箱
- 页面提示用户检查邮箱
- 显示发送的邮箱地址
- 提供重新发送功能（倒计时结束后）

##### 步骤4：重置密码
- 用户点击邮件中的链接
- 在 Supabase 提供的页面重置密码
- 或在应用内完成重置（如果配置了自定义重置页面）

#### 页面设计

##### 视觉风格
- 与登录页面保持一致的设计风格
- 使用 `i-mdi-lock-reset` 图标
- 主题色和圆角样式统一

##### 用户体验
- 清晰的步骤提示
- 友好的错误提示
- 防止重复发送（倒计时）
- 温馨提示信息

##### 表单验证
- 邮箱格式验证
- 密码长度验证（至少6个字符）
- 两次密码一致性验证

#### 登录页面修改

在登录页面的"记住账号密码"旁边添加了"忘记密码？"链接：

```tsx
{/* 记住我和忘记密码 */}
<View className="flex flex-row items-center justify-between">
  <View className="flex flex-row items-center" onClick={() => setRememberMe(!rememberMe)}>
    <View className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mr-2 ${rememberMe ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground'}`}>
      {rememberMe && <View className="i-mdi-check text-white text-xs" />}
    </View>
    <Text className="text-xl text-muted-foreground">记住账号密码</Text>
  </View>
  {isLogin && (
    <Text 
      className="text-xl text-primary font-medium"
      onClick={() => Taro.navigateTo({ url: '/pages/reset-password/index' })}
    >
      忘记密码？
    </Text>
  )}
</View>
```

#### 技术实现

##### Supabase Auth API
```typescript
// 发送密码重置邮件
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/pages/reset-password/index`
});

// 更新密码
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

##### 倒计时功能
```typescript
const [countdown, setCountdown] = useState(0);

// 开始倒计时
setCountdown(60);
const timer = setInterval(() => {
  setCountdown((prev) => {
    if (prev <= 1) {
      clearInterval(timer);
      return 0;
    }
    return prev - 1;
  });
}, 1000);
```

##### 邮箱验证
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  Taro.showToast({ title: '请输入有效的邮箱地址', icon: 'none' });
  return;
}
```

## 用户体验提升

### 1. 视觉一致性
- 运势预测页面现在与其他功能页面保持一致的视觉风格
- 统一的页面标题设计增强品牌识别度
- 用户在不同功能间切换时体验更流畅

### 2. 功能完整性
- 添加密码找回功能，完善账户管理体系
- 用户忘记密码时有明确的解决方案
- 减少因忘记密码导致的用户流失

### 3. 安全性
- 通过邮箱验证确保账户安全
- 重置链接有时效性（24小时）
- 防止恶意频繁发送（60秒倒计时）

## 测试建议

### 测试运势预测页面标题

#### 测试步骤
1. 打开小程序
2. 点击"运势预测"功能
3. 查看页面顶部

#### 预期结果
- ✅ 显示趋势图标（i-mdi-chart-timeline-variant）
- ✅ 显示主标题"运势预测"
- ✅ 显示副标题"洞察未来趋势，把握人生机遇"
- ✅ 样式与姻缘配对、正缘预测页面一致

### 测试密码找回功能

#### 测试步骤1：访问密码找回页面
1. 打开小程序
2. 进入登录页面
3. 点击"忘记密码？"链接

#### 预期结果
- ✅ 成功跳转到密码找回页面
- ✅ 显示锁图标和"找回密码"标题
- ✅ 显示邮箱输入框

#### 测试步骤2：发送重置邮件
1. 输入有效的邮箱地址
2. 点击"发送重置链接"按钮
3. 等待发送完成

#### 预期结果
- ✅ 显示"验证码已发送到您的邮箱"提示
- ✅ 页面切换到"邮件已发送"状态
- ✅ 显示发送的邮箱地址
- ✅ 开始60秒倒计时

#### 测试步骤3：重新发送
1. 等待60秒倒计时结束
2. 点击"重新发送邮件"按钮

#### 预期结果
- ✅ 倒计时期间按钮禁用
- ✅ 倒计时结束后按钮可用
- ✅ 可以重新发送邮件

#### 测试步骤4：邮箱验证
1. 输入无效邮箱（如 "test"）
2. 点击发送按钮

#### 预期结果
- ✅ 显示"请输入有效的邮箱地址"提示
- ✅ 不发送请求

#### 测试步骤5：返回登录
1. 点击"← 返回登录"链接

#### 预期结果
- ✅ 返回到登录页面

### 测试注册模式
1. 在登录页面切换到"注册"模式
2. 查看"忘记密码？"链接

#### 预期结果
- ✅ 注册模式下不显示"忘记密码？"链接
- ✅ 只在登录模式下显示

## 注意事项

### 1. 邮箱配置
- 需要在 Supabase 后台配置邮件服务
- 确保 SMTP 设置正确
- 测试邮件发送功能

### 2. 重置链接
- 默认重置链接指向 Supabase 提供的页面
- 可以自定义重置页面（需要额外配置）
- 确保 redirectTo URL 正确

### 3. 用户引导
- 提示用户检查垃圾邮件文件夹
- 说明链接有效期
- 提供客服联系方式（如遇问题）

### 4. 安全考虑
- 不要在错误提示中透露账户是否存在
- 限制发送频率（已实现60秒倒计时）
- 记录重置请求日志（用于安全审计）

## 后续优化建议

### 1. 运势预测页面
- 考虑添加页面动画效果
- 优化图标选择（可以更换为其他相关图标）
- 添加页面引导提示

### 2. 密码找回功能
- 添加手机号找回方式
- 实现应用内密码重置（不跳转到外部页面）
- 添加安全问题验证
- 支持多种验证方式（邮箱/手机号）

### 3. 用户体验
- 添加密码强度提示
- 提供密码生成建议
- 记录最近使用的邮箱（方便快速填写）

## 相关文件

### 运势预测页面
- `/src/pages/input/index.tsx` - 运势预测页面
- `/src/pages/input/index.config.ts` - 页面配置

### 密码找回功能
- `/src/pages/reset-password/index.tsx` - 密码找回页面
- `/src/pages/reset-password/index.config.ts` - 页面配置
- `/src/pages/login/index.tsx` - 登录页面（添加忘记密码链接）
- `/src/app.config.ts` - 路由配置

## 更新记录

- **2026-02-21 v1.0**：
  - 为运势预测页面添加页面标题设计
  - 添加密码找回功能
  - 在登录页面添加"忘记密码"入口

## 状态

✅ 已完成更新并通过 Lint 检查
✅ 运势预测页面标题已添加
✅ 密码找回功能已实现
✅ 登录页面已添加忘记密码链接
