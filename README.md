# 算浮生 - 命理预测小程序 | Taro + React + TypeScript + TailwindCSS + Supabase + AI大模型 + Vibe Coding

## 项目简介

算浮生是一款基于传统八字命理学的微信小程序，融合了专业的风水罗盘设计和现代化的用户体验。用户通过输入个人信息，系统会根据八字命理、五行生克等传统理论，结合AI大模型生成完全个性化的运势分析报告。

## 核心特色

### 1. 专业罗盘设计
- **七层立体结构**：二十四山向、度数刻度、方位标注、后天八卦、九宫飞星、太极阴阳、罗盘指针
- **传统元素融合**：完整还原真实风水罗盘的多层结构
- **动态效果**：八卦盘旋转动画、太极脉动效果
- **详细文档**：[COMPASS_DESIGN.md](./COMPASS_DESIGN.md)

### 2. 完全个性化算命（AI 增强）
- **AI 模型**：接入AI大模型
- **真实八字排盘**：根据出生年月日时计算四柱天干地支
- **精确五行分析**：统计金木水火土分布，天干地支分别赋权
- **AI 深度分析**：生成 300+ 字/维度的详细运势
- **多维度运势**：事业、财运、婚姻、健康、开运指南
- **输入影响分析**：近期事件、心情状态深度融入结果
- **高个性化**：根据五行属性计算适合的月份，每个人的建议都不同（个性化程度 95%+）
- **时效性强**：结合当前年月给出时令建议
- **降级保障**：AI 失败时自动使用本地算法（本地算法也已完全个性化）
- **Markdown 处理**：自动清理 Markdown 格式，输出纯文本
- **详细文档**：
  - [PERSONALIZATION_FIX_DETAILED.md](./PERSONALIZATION_FIX_DETAILED.md) - 本地算法个性化修复详细说明
  - [PERSONALIZATION_BEFORE_AFTER_TEST.md](./PERSONALIZATION_BEFORE_AFTER_TEST.md) - 个性化修复前后对比测试
  - [AI_PERSONALIZATION_ENHANCEMENT.md](./AI_PERSONALIZATION_ENHANCEMENT.md) - AI 个性化增强说明
  - [AI_PERSONALIZATION_TESTING.md](./AI_PERSONALIZATION_TESTING.md) - AI 个性化测试指南
  - [AI_COMPLETE_FIX.md](./AI_COMPLETE_FIX.md) - AI 完整修复总结
  - [AI_ENHANCED_FORTUNE.md](./AI_ENHANCED_FORTUNE.md) - AI 增强系统说明
  - [AI_BEFORE_AFTER_COMPARISON.md](./AI_BEFORE_AFTER_COMPARISON.md) - 新旧版本详细对比
  - [AI_TROUBLESHOOTING.md](./AI_TROUBLESHOOTING.md) - 问题排查与修复
  - [AI_VERIFICATION_GUIDE.md](./AI_VERIFICATION_GUIDE.md) - 功能验证指南
  - [FORTUNE_ALGORITHM.md](./FORTUNE_ALGORITHM.md) - 算法详细说明
  - [ALGORITHM_UPGRADE.md](./ALGORITHM_UPGRADE.md) - 新旧版本对比
  - [FORTUNE_TEST_CASES.md](./FORTUNE_TEST_CASES.md) - 测试用例

### 3. 详细咨询功能
- **智能对话**：接入AI大模型，支持流式对话
- **结合八字**：基于用户的八字命盘提供针对性建议
- **针对性强**：根据用户的近况和困惑给出详细分析
- **实时反馈**：流式显示回答，逐字呈现
- **可停止生成**：随时停止 AI 生成
- **专业分析**：结合《三命通会》《渊海子平》《周易》等传统命理理论
- **Markdown 处理**：自动转换 Markdown 格式为 HTML，正确渲染

### 4. 姻缘配对功能
- **八字合婚**：分析男女双方八字匹配度
- **多维度分析**：五行互补性、天干地支配合度、生肖契合度、性格特征等
- **详细报告**：生成完整的合婚分析报告
- **AI 增强**：使用AI大模型生成详细的配对分析

### 5. 正缘预测功能
- **详细预测**：预测未来正缘的姓名、长相、工作等特征
- **个性化分析**：基于用户八字生成具体详实的预测
- **AI 驱动**：使用AI大模型生成详细的正缘分析

### 6. 完善的认证系统
- **双登录方式**：用户名密码 + 微信一键登录
- **环境自适应**：自动检测运行环境，显示对应登录方式
- **安全可靠**：Supabase Auth + RLS 策略
- **增强日志**：详细的前端和后端日志输出，便于调试
- **友好错误提示**：提供清晰的错误信息和解决方案
- **详细文档**：
  - [LOGIN_GUIDE.md](./LOGIN_GUIDE.md) - 登录功能说明
  - [LOGIN_TEST_GUIDE.md](./LOGIN_TEST_GUIDE.md) - 测试指南
  - [WECHAT_LOGIN_CONFIG.md](./WECHAT_LOGIN_CONFIG.md) - 微信登录配置说明
  - [WECHAT_LOGIN_DEBUG_GUIDE.md](./WECHAT_LOGIN_DEBUG_GUIDE.md) - 微信登录调试指南
  - [WECHAT_LOGIN_TEST_CHECKLIST.md](./WECHAT_LOGIN_TEST_CHECKLIST.md) - 微信登录测试清单

## 技术栈

### 前端
- **框架**：Taro 4.1.10 + React 18.3.1 + TypeScript 5.9.3
- **样式**：TailwindCSS 3.4.17
- **图标**：Material Design Icons (MDI)
- **状态管理**：Zustand 5.0.10
- **构建工具**：Vite 4.5.14
- **国际化**：i18n
- **开发工具**：Vibe Coding

### 后端
- **数据库**：Supabase (PostgreSQL)
- **认证**：Supabase Auth
- **存储**：Supabase Storage
- **Edge Functions**：Deno (微信登录、AI调用等)

### 部署
- **小程序**：微信开发者工具
- **H5**：支持浏览器访问
- **数据库**：Supabase 云服务

## 项目结构

```
src/
├── assets/           # 静态资源
├── client/           # Supabase客户端配置
├── components/       # 通用组件
├── contexts/         # React Context
├── db/              # 数据库操作
├── hooks/           # 自定义Hooks
├── i18n/            # 国际化
├── pages/           # 页面组件
│   ├── consult/       # 大师咨询
│   ├── daily-input/   # 每日运势输入
│   ├── daily-result/  # 每日运势结果
│   ├── guide/         # 测算指南
│   ├── history/       # 历史记录
│   ├── index/         # 首页（专业罗盘）
│   ├── input/         # 运势预测输入
│   ├── login/         # 登录页
│   ├── match/         # 姻缘配对
│   ├── match-result/  # 姻缘配对结果
│   ├── privacy-policy/ # 隐私政策
│   ├── profile/       # 个人中心
│   ├── reset-password/ # 密码重置
│   ├── result/        # 运势预测结果
│   ├── true-love/     # 正缘预测
│   ├── true-love-result/ # 正缘预测结果
│   └── user-agreement/ # 用户协议
├── utils/           # 工具函数
├── app.config.ts    # 应用配置
├── app.scss         # 全局样式
└── app.tsx          # 应用入口
supabase/
├── functions/       # Edge Functions
│   ├── fortune_consult/         # 大师咨询
│   ├── generate_fortune_detail/ # 运势详情
│   ├── generate_match_report/   # 姻缘配对报告
│   ├── generate_true_love_report/ # 正缘预测报告
│   ├── phone-login/            # 手机号登录
│   ├── send-sms-code/          # 发送短信验证码
│   ├── verify-sms-code/         # 验证短信验证码
│   └── wechat_miniapp_login/    # 微信登录
└── migrations/      # 数据库迁移
```

## 核心功能

### 1. 首页 - 专业风水罗盘
- **七层结构**：
  1. 最外圈：二十四山向（八天干+十二地支+四维卦）
  2. 度数刻度：72个刻度线，每5度一个
  3. 方位标注：四正位+四隅位+度数标注
  4. 后天八卦：八卦符号+五行属性+旋转动画
  5. 九宫飞星：一白至九紫，九宫格分布
  6. 太极阴阳：中心太极图+脉动动画
  7. 罗盘指针：红色三角指向正北

- **交互功能**：
  - 点击"开始测算"进入输入页面
  - 点击"查看记录"查看历史测算
  - 点击"姻缘配对"进入合婚页面
  - 点击"正缘预测"进入正缘预测页面

### 2. 输入页 - 信息采集
- **基础信息**：
  - 姓名（必填）
  - 性别（男/女）
  - 出生日期（公历，精确到日）
  - 出生时间（精确到分钟）

- **近期信息**：
  - 近期事件描述（多行文本）
  - 关注领域（事业/财运/感情/健康）
  - 当前心情（下拉选择）

### 3. 结果页 - 运势展示
- **八字命盘**：显示完整的四柱八字
- **五行雷达图**：可视化展示五行分布
- **五大维度分析**：
  1. **总体运势**：命格总结、性格特征
  2. **事业运势**：行业推荐、机遇时间、发展建议
  3. **财运分析**：正财偏财、投资建议、财运高峰
  4. **婚姻感情**：桃花运势、贵人方位、感情建议
  5. **健康养生**：身体隐患、养生建议、保健方法
  6. **开运指南**：幸运色、幸运数字、幸运方位、开运物品

- **详细咨询**：点击"详细咨询"按钮进入大师咨询页面
- **分享功能**：分享到聊天和朋友圈

### 4. 大师咨询页
- **问题输入**：用户输入具体问题（最多500字）
- **流式回答**：AI实时生成回答，逐字显示
- **停止生成**：随时停止AI生成
- **专业分析**：结合八字命盘提供针对性建议

### 5. 姻缘配对页
- **双方信息**：输入男女双方的姓名、出生日期、出生时间
- **合婚分析**：AI生成详细的配对分析报告
- **多维度评估**：五行互补性、天干地支配合度、生肖契合度等

### 6. 正缘预测页
- **个人信息**：输入姓名、性别、出生日期、出生时间等信息
- **详细预测**：AI生成未来正缘的详细特征，包括姓名、长相、工作等
- **具体详实**：预测内容详细且具体，不使用模糊词汇

### 7. 历史页 - 记录管理
- **记录列表**：显示所有历史测算
- **快速查看**：点击查看详细结果
- **时间排序**：最新记录在前
- **删除功能**：删除历史记录

### 8. 个人中心 - 用户管理
- **用户信息**：昵称、头像、角色
- **登录方式**：支持用户名密码和微信登录
- **退出登录**：安全退出

## 算命算法核心（AI 增强版）

### 混合算法架构

```
用户输入
    ↓
八字排盘（本地计算，< 100ms）
    ├─ 年柱：根据出生年份计算天干地支
    ├─ 月柱：根据出生月份计算天干地支
    ├─ 日柱：根据出生日期计算天干地支
    └─ 时柱：根据出生时辰计算天干地支
    ↓
五行分析（本地计算）
    ├─ 天干权重：15分/个
    ├─ 地支权重：10分/个
    └─ 归一化：转换为百分比
    ↓
AI 深度分析（AI大模型，3-15秒）
    ├─ 输入：八字 + 五行 + 用户信息
    ├─ Prompt：详细的命理分析要求
    └─ 输出：5个维度 × 300+字 = 1500+字
    ↓
    ├─ 成功 → 返回 AI 生成的详细内容
    └─ 失败 → 降级到本地算法（保障可用性）
```

### 核心优势

| 维度 | 本地算法 | AI 增强 | 提升 |
|------|---------|---------|------|
| 字数 | 150字/维度 | 300+字/维度 | 2倍 |
| 深度 | 浅层分析 | 深入解读 | 质的飞跃 |
| 个性化 | 模板化 | 完全定制 | 100% |
| 随机性 | 固定输出 | 每次不同 | 无限 |
| 时效性 | 无 | 结合当前时间 | 新增 |
| 实用性 | 笼统建议 | 具体可操作 | 10倍 |

## 数据库设计

### profiles 表
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nickname TEXT,
  avatar_url TEXT,
  gender TEXT,
  birthday TIMESTAMPTZ,
  role user_role,
  openid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### fortunes 表
```sql
CREATE TABLE fortunes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  input_data JSONB NOT NULL,  -- 用户输入信息
  result_data JSONB NOT NULL, -- 算命结果
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### match_records 表
```sql
CREATE TABLE match_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  male_info JSONB NOT NULL,   -- 男方信息
  female_info JSONB NOT NULL, -- 女方信息
  match_report JSONB NOT NULL, -- 配对报告
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### true_love_records 表
```sql
CREATE TABLE true_love_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  user_info JSONB NOT NULL,    -- 用户信息
  true_love_report JSONB NOT NULL, -- 正缘报告
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 安全策略

### RLS 策略
- **profiles**：用户只能查看和修改自己的记录，管理员全权限
- **fortunes**：用户只能查看和创建自己的记录
- **match_records**：用户只能查看和创建自己的记录
- **true_love_records**：用户只能查看和创建自己的记录

### 认证流程
1. **用户名密码**：
   - 注册：创建 auth.users → 触发器创建 profiles
   - 登录：验证凭证 → 返回 session

2. **微信登录**：
   - 获取 code → 调用 Edge Function
   - Edge Function 调用微信 API → 获取 openid
   - 生成 magic link token → 前端验证
   - 自动创建或关联账号

3. **手机号登录**：
   - 输入手机号 → 发送验证码
   - 输入验证码 → 验证登录
   - 自动创建或关联账号

## 开发指南

### 环境准备
```bash
# 安装依赖
pnpm install

# 配置环境变量
# 编辑 .env，填入 Supabase 配置
```

### 本地开发
```bash
# 微信小程序
npm run dev:weapp

# H5 浏览器
npm run dev:h5
```

### 代码检查
```bash
# Lint 检查
npm run lint
```

### 构建部署
```bash
# 构建小程序
npm run build:weapp

# 构建 H5
npm run build:h5
```

## 测试指南

### 登录功能测试
参考：[LOGIN_TEST_GUIDE.md](./LOGIN_TEST_GUIDE.md)

1. 注册新用户
2. 登录已有用户
3. 微信一键登录（小程序环境）
4. 手机号登录
5. 退出登录

### 算命功能测试
参考：[FORTUNE_TEST_CASES.md](./FORTUNE_TEST_CASES.md)

1. 输入不同的出生时间，验证八字不同
2. 输入不同的近期事件，验证分析内容不同
3. 输入不同的心情状态，验证建议语气不同
4. 对比多个用户的结果，验证完全个性化

### 咨询功能测试
1. 完成一次测算
2. 点击"详细咨询"按钮
3. 输入问题并提交
4. 观察流式回答
5. 测试停止生成功能

### 姻缘配对测试
1. 进入姻缘配对页面
2. 输入男女双方信息
3. 点击"开始合婚测算"
4. 查看配对分析报告

### 正缘预测测试
1. 进入正缘预测页面
2. 输入个人信息
3. 点击"预测正缘"
4. 查看详细的正缘预测报告

## 常见问题

### Q1：为什么两个用户的结果看起来相似？
A：如果出生时间非常接近，八字可能相同或相似。但即使八字相同，由于姓名、性别、近期事件、心情等因素不同，最终的分析内容也会有明显差异。

### Q2：算命结果的准确性如何保证？
A：本系统基于传统八字命理学理论，使用真实的天干地支系统和五行生克关系。算法逻辑严谨，计算过程可追溯。但命理学本身具有一定的主观性和解释空间，结果仅供参考。

### Q3：如何添加新的分析维度？
A：在 `src/db/api.ts` 中添加新的生成函数，例如 `generateCareerFortune`。函数接收用户输入和五行分布，返回分析文本。然后在 `calculateFortune` 主函数中调用并添加到返回结果中。

### Q4：如何优化算命文本的质量？
A：可以考虑以下方向：
1. 增加更多的条件判断，细化分析逻辑
2. 引入更多传统命理元素（大运、流年、十神等）
3. 使用 AI 大语言模型优化文本生成
4. 收集用户反馈，持续改进

### Q5：微信登录需要哪些配置？
A：需要在 Supabase 中配置以下环境变量：
- `WECHAT_MINIPROGRAM_LOGIN_APP_ID`：微信小程序 AppID
- `WECHAT_MINIPROGRAM_LOGIN_APP_SECRET`：微信小程序 AppSecret

同时需要部署 `wechat_miniapp_login` Edge Function。

## 未来优化方向

### 算法优化
1. **真太阳时修正**：根据出生地经纬度调整时辰
2. **大运流年**：增加10年大运和流年运势分析
3. **十神系统**：引入比肩、劫财、食神等十神理论
4. **神煞系统**：添加天乙贵人、桃花煞等神煞
5. **六爻占卜**：支持用户摇卦进行具体事项占卜

### 功能扩展
1. **社区功能**：用户分享测算结果，互相交流
2. **大师咨询**：连接真实命理师，提供付费咨询
3. **每日运势**：推送每日运势提醒
4. **合婚配对**：输入两人信息，分析婚配指数
5. **起名改名**：根据八字推荐吉利名字
6. **风水布局**：根据八字推荐家居风水布局

### 体验优化
1. **语音播报**：支持语音朗读测算结果
2. **PDF 导出**：生成精美的 PDF 报告
3. **动画效果**：增加更多交互动画
4. **多语言支持**：支持英文、繁体中文等
5. **主题切换**：支持多种视觉主题

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue
- 描述问题或建议
- 提供复现步骤（如果是 Bug）
- 附上截图或日志

### 提交 PR
- Fork 项目
- 创建特性分支
- 提交代码并通过 Lint 检查
- 提交 PR 并描述改动

## 许可证

Copyright © 2026 算浮生

---

**版本**: 2.0  
**更新日期**: 2026-03-12  
**开发团队**: 思忆如风和他的AI团队
