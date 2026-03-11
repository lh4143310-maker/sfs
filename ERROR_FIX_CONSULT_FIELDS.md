# 错误修复：咨询页面字段访问错误

## 错误信息

```
Uncaught TypeError: Cannot read properties of undefined (reading 'summary')
    at /pages/consult/index.tsx:109:40
```

## 问题分析

### 根本原因

数据库字段名与代码中使用的字段名不匹配：

**数据库字段**（`FortuneRecord` 接口定义）：
```typescript
export interface FortuneRecord {
  id: string;
  user_id: string;
  input_data: FortuneInput;   // ← 数据库字段名
  result_data: FortuneResult; // ← 数据库字段名
  created_at: string;
}
```

**代码中错误使用**：
```typescript
// ❌ 错误：使用了不存在的字段名
const baziMatch = fortuneData.result.summary.match(/【(.+?)】/);
const name = fortuneData.input.name;
```

### 错误发生位置

`src/pages/consult/index.tsx` 第 56-66 行：

```typescript
// 提取八字
const baziMatch = fortuneData.result.summary.match(/【(.+?)】/); // ❌ fortuneData.result 是 undefined
const bazi = baziMatch ? baziMatch[1] : '';

const requestBody = {
  name: fortuneData.input.name,           // ❌ fortuneData.input 是 undefined
  gender: fortuneData.input.gender,       // ❌
  birthDate: fortuneData.input.birthDate, // ❌
  birthTime: fortuneData.input.birthTime, // ❌
  bazi: bazi,
  elements: fortuneData.result.elements,  // ❌ fortuneData.result 是 undefined
  question: question
};
```

## 解决方案

### 修复代码

将所有字段访问从 `input`/`result` 改为 `input_data`/`result_data`：

```typescript
// ✅ 正确：使用数据库实际字段名
const baziMatch = fortuneData.result_data.summary.match(/【(.+?)】/);
const bazi = baziMatch ? baziMatch[1] : '';

const requestBody = {
  name: fortuneData.input_data.name,
  gender: fortuneData.input_data.gender,
  birthDate: fortuneData.input_data.birthDate,
  birthTime: fortuneData.input_data.birthTime,
  bazi: bazi,
  elements: fortuneData.result_data.elements,
  question: question
};
```

### 添加数据完整性检查

在访问数据前添加检查，防止类似错误：

```typescript
// 检查数据完整性
if (!fortuneData.result_data || !fortuneData.input_data) {
  Taro.showToast({ title: '数据不完整，请重新测算', icon: 'none' });
  return;
}
```

## 修改文件

**文件**：`src/pages/consult/index.tsx`

**修改内容**：
1. 第 52-57 行：添加数据完整性检查
2. 第 60 行：`fortuneData.result.summary` → `fortuneData.result_data.summary`
3. 第 63-66 行：`fortuneData.input.*` → `fortuneData.input_data.*`
4. 第 68 行：`fortuneData.result.elements` → `fortuneData.result_data.elements`

## 验证

### 测试步骤

1. 完成一次测算
2. 在结果页面点击"详细咨询"
3. 输入问题并提交
4. 确认不再出现错误

### 预期结果

- ✅ 不再出现 "Cannot read properties of undefined" 错误
- ✅ 可以正常提取八字信息
- ✅ 可以正常发送咨询请求
- ✅ 可以正常接收 AI 回答

## 经验教训

### 1. 字段命名一致性

**问题**：数据库字段名（`input_data`）与代码中使用的名称（`input`）不一致

**解决**：
- 使用 TypeScript 接口定义确保类型安全
- 在访问字段前检查 IDE 的自动补全提示
- 添加数据完整性检查

### 2. 数据访问安全性

**问题**：直接访问嵌套属性，没有检查中间层是否存在

**解决**：
- 使用可选链操作符：`fortuneData?.result_data?.summary`
- 添加显式检查：`if (!fortuneData.result_data) return;`
- 提供友好的错误提示

### 3. 类型定义的重要性

**问题**：如果使用了正确的类型定义，TypeScript 会在编译时发现这个错误

**解决**：
- 确保所有数据都有明确的类型定义
- 不要使用 `any` 类型
- 启用严格的 TypeScript 检查

## 相关代码

### FortuneRecord 接口定义

**文件**：`src/db/api.ts`

```typescript
export interface FortuneRecord {
  id: string;
  user_id: string;
  input_data: FortuneInput;   // 用户输入数据
  result_data: FortuneResult; // 算命结果数据
  created_at: string;
}
```

### getFortuneById 函数

**文件**：`src/db/api.ts`

```typescript
export async function getFortuneById(id: string) {
  const { data, error } = await supabase
    .from('fortunes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as FortuneRecord; // 返回的数据包含 input_data 和 result_data
}
```

## 总结

这是一个典型的字段名不匹配错误。通过仔细检查数据库字段定义和代码中的字段访问，我们发现了问题所在并成功修复。

**关键点**：
- ✅ 使用正确的字段名：`input_data` 和 `result_data`
- ✅ 添加数据完整性检查
- ✅ 提供友好的错误提示
- ✅ 确保类型安全

---

**修复日期**：2026-02-22  
**错误类型**：字段访问错误  
**修复状态**：✅ 已完成
