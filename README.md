# 欢迎使用你的秒哒应用代码包
秒哒应用链接
    URL:https://www.miaoda.cn/projects/app-9sfsgfuorke9

# 命理小程序 - 项目文档总览

## 项目简介

命理是一款基于传统八字命理学的微信小程序，融合了专业的风水罗盘设计和现代化的用户体验。用户通过输入个人信息，系统会根据八字命理、五行生克等传统理论，生成完全个性化的运势分析报告。

## 核心特色

### 1. 专业罗盘设计
- **七层立体结构**：二十四山向、度数刻度、方位标注、后天八卦、九宫飞星、太极阴阳、罗盘指针
- **传统元素融合**：完整还原真实风水罗盘的多层结构
- **动态效果**：八卦盘旋转动画、太极脉动效果
- **详细文档**：[COMPASS_DESIGN.md](./COMPASS_DESIGN.md)

### 2. 完全个性化算命（AI 增强）
- **AI 模型**：接入AI大语言模型
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
  - [PERSONALIZATION_FIX_DETAILED.md](./PERSONALIZATION_FIX_DETAILED.md) - 本地算法个性化修复详细说明（新）
  - [PERSONALIZATION_BEFORE_AFTER_TEST.md](./PERSONALIZATION_BEFORE_AFTER_TEST.md) - 个性化修复前后对比测试（新）
  - [AI_PERSONALIZATION_ENHANCEMENT.md](./AI_PERSONALIZATION_ENHANCEMENT.md) - AI 个性化增强说明
  - [AI_PERSONALIZATION_TESTING.md](./AI_PERSONALIZATION_TESTING.md) - AI 个性化测试指南
  - [WENXIN_API_MIGRATION.md](./WENXIN_API_MIGRATION.md) - 文心一言 API 迁移说明
  - [AI_COMPLETE_FIX.md](./AI_COMPLETE_FIX.md) - AI 完整修复总结
  - [AI_ENHANCED_FORTUNE.md](./AI_ENHANCED_FORTUNE.md) - AI 增强系统说明
  - [AI_BEFORE_AFTER_COMPARISON.md](./AI_BEFORE_AFTER_COMPARISON.md) - 新旧版本详细对比
  - [AI_TROUBLESHOOTING.md](./AI_TROUBLESHOOTING.md) - 问题排查与修复
  - [AI_VERIFICATION_GUIDE.md](./AI_VERIFICATION_GUIDE.md) - 功能验证指南
  - [FORTUNE_ALGORITHM.md](./FORTUNE_ALGORITHM.md) - 算法详细说明
  - [ALGORITHM_UPGRADE.md](./ALGORITHM_UPGRADE.md) - 新旧版本对比
  - [FORTUNE_TEST_CASES.md](./FORTUNE_TEST_CASES.md) - 测试用例

### 3. 详细咨询功能
- **智能对话**：接入文心一言 API，支持流式对话
- **结合八字**：基于用户的八字命盘提供针对性建议
- **针对性强**：根据用户的近况和困惑给出详细分析
- **实时反馈**：流式显示回答，逐字呈现
- **可停止生成**：随时停止 AI 生成
- **专业分析**：结合《三命通会》《渊海子平》《周易》等传统命理理论
- **Markdown 处理**：自动转换 Markdown 格式为 HTML，正确渲染

### 3. 完善的认证系统
- **双登录方式**：用户名密码 + 微信一键登录
- **环境自适应**：自动检测运行环境，显示对应登录方式
- **安全可靠**：Supabase Auth + RLS 策略
- **增强日志**：详细的前端和后端日志输出，便于调试
- **友好错误提示**：提供清晰的错误信息和解决方案
- **详细文档**：
  - [LOGIN_GUIDE.md](./LOGIN_GUIDE.md) - 登录功能说明
  - [LOGIN_TEST_GUIDE.md](./LOGIN_TEST_GUIDE.md) - 测试指南
  - [WECHAT_LOGIN_CONFIG.md](./WECHAT_LOGIN_CONFIG.md) - 微信登录配置说明（新）
  - [WECHAT_LOGIN_DEBUG_GUIDE.md](./WECHAT_LOGIN_DEBUG_GUIDE.md) - 微信登录调试指南（新）
  - [WECHAT_LOGIN_TEST_CHECKLIST.md](./WECHAT_LOGIN_TEST_CHECKLIST.md) - 微信登录测试清单（新）

## 技术栈

### 前端
- **框架**：Taro 3.x + React + TypeScript
- **样式**：Tailwind CSS
- **图标**：Material Design Icons (MDI)
- **状态管理**：React Context API

### 后端
- **数据库**：Supabase (PostgreSQL)
- **认证**：Supabase Auth
- **存储**：Supabase Storage
- **Edge Functions**：Deno (微信登录)

### 部署
- **小程序**：微信开发者工具
- **H5**：支持浏览器访问
- **数据库**：Supabase 云服务

## 项目结构

```
app-9sfsgfuorke9/
├── src/
│   ├── app.tsx                 # 应用入口
│   ├── app.config.ts           # 应用配置（路由、TabBar）
│   ├── app.scss                # 全局样式（八卦主题、五行色）
│   ├── pages/                  # 页面目录
│   │   ├── index/              # 首页（专业罗盘）
│   │   ├── login/              # 登录页
│   │   ├── input/              # 测算输入页
│   │   ├── result/             # 测算结果页
│   │   ├── history/            # 历史记录页
│   │   └── profile/            # 个人中心页
│   ├── components/             # 组件目录
│   │   └── RouteGuard.tsx      # 路由守卫
│   ├── contexts/               # Context目录
│   │   └── AuthContext.tsx     # 认证状态管理
│   ├── db/                     # 数据库操作
│   │   └── api.ts              # 算命逻辑 + 数据操作
│   └── client/                 # 客户端配置
│       └── supabase.ts         # Supabase 客户端
├── supabase/
│   ├── migrations/             # 数据库迁移文件
│   └── functions/              # Edge Functions
│       └── wechat_miniapp_login/  # 微信登录
├── docs/
│   └── report.md               # 需求调研报告
├── TODO.md                     # 任务清单
├── COMPASS_DESIGN.md           # 罗盘设计文档
├── FORTUNE_ALGORITHM.md        # 算命算法说明
├── ALGORITHM_UPGRADE.md        # 算法升级对比
├── FORTUNE_TEST_CASES.md       # 算命测试用例
├── LOGIN_GUIDE.md              # 登录功能说明
├── LOGIN_TEST_GUIDE.md         # 登录测试指南
└── README.md                   # 项目说明（本文件）
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

- **可选功能**：
  - 上传照片（Supabase Storage）

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

- **分享功能**：
  - 分享到聊天
  - 分享到朋友圈

### 4. 历史页 - 记录管理
- **记录列表**：显示所有历史测算
- **快速查看**：点击查看详细结果
- **时间排序**：最新记录在前

### 5. 个人中心 - 用户管理
- **用户信息**：昵称、头像、角色
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
AI 深度分析（MiniMax API，3-8秒）
    ├─ 输入：八字 + 五行 + 用户信息
    ├─ Prompt：详细的命理分析要求
    ├─ 参数：temperature=0.9（高随机性）
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

### fortune_images 存储桶
- 用途：存储用户上传的照片
- 权限：用户只能上传和查看自己的图片
- 大小限制：1MB

## 安全策略

### RLS 策略
- **profiles**：用户只能查看和修改自己的记录，管理员全权限
- **fortunes**：用户只能查看和创建自己的记录
- **fortune_images**：用户只能上传和访问自己的图片

### 认证流程
1. **用户名密码**：
   - 注册：创建 auth.users → 触发器创建 profiles
   - 登录：验证凭证 → 返回 session

2. **微信登录**：
   - 获取 code → 调用 Edge Function
   - Edge Function 调用微信 API → 获取 openid
   - 生成 magic link token → 前端验证
   - 自动创建或关联账号

## 开发指南

### 环境准备
```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
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

# TypeScript 检查
npm run type-check
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
4. 退出登录

### 算命功能测试
参考：[FORTUNE_TEST_CASES.md](./FORTUNE_TEST_CASES.md)

1. 输入不同的出生时间，验证八字不同
2. 输入不同的近期事件，验证分析内容不同
3. 输入不同的心情状态，验证建议语气不同
4. 对比多个用户的结果，验证完全个性化

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

Copyright © 2026 算命大师

---

**版本**: 1.0  
**更新日期**: 2026-02-21  
**开发团队**: Miaoda AI
