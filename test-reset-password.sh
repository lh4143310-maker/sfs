#!/bin/bash

# 密码重置功能快速测试脚本
# 使用方法: bash test-reset-password.sh

echo "================================"
echo "密码重置功能快速测试"
echo "================================"
echo ""

# 1. 检查文件
echo "1. 检查文件是否存在..."
if [ -f "src/pages/reset-password/index.tsx" ]; then
    echo "   ✅ index.tsx 存在"
    FILE_SIZE=$(wc -c < src/pages/reset-password/index.tsx)
    echo "   文件大小: $FILE_SIZE 字节"
else
    echo "   ❌ index.tsx 不存在"
    exit 1
fi

if [ -f "src/pages/reset-password/index.config.ts" ]; then
    echo "   ✅ index.config.ts 存在"
else
    echo "   ❌ index.config.ts 不存在"
    exit 1
fi

echo ""

# 2. 检查路由配置
echo "2. 检查路由配置..."
if grep -q "reset-password" src/app.config.ts; then
    echo "   ✅ 路由已配置"
else
    echo "   ❌ 路由未配置"
    exit 1
fi

echo ""

# 3. 检查关键代码
echo "3. 检查关键代码..."

if grep -q "step === 'reset'" src/pages/reset-password/index.tsx; then
    echo "   ✅ 重置步骤代码存在"
else
    echo "   ❌ 重置步骤代码不存在"
    exit 1
fi

if grep -q "设置新密码" src/pages/reset-password/index.tsx; then
    echo "   ✅ 重置表单存在"
else
    echo "   ❌ 重置表单不存在"
    exit 1
fi

if grep -q "调试信息" src/pages/reset-password/index.tsx; then
    echo "   ✅ 调试界面存在"
else
    echo "   ❌ 调试界面不存在"
    exit 1
fi

echo ""

# 4. 运行 Lint
echo "4. 运行 Lint 检查..."
npm run lint > /tmp/lint-output.txt 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Lint 检查通过"
else
    echo "   ❌ Lint 检查失败"
    cat /tmp/lint-output.txt
    exit 1
fi

echo ""

# 5. 统计信息
echo "5. 代码统计..."
TOTAL_LINES=$(wc -l < src/pages/reset-password/index.tsx)
echo "   总行数: $TOTAL_LINES"

RESET_COUNT=$(grep -c "step === 'reset'" src/pages/reset-password/index.tsx)
echo "   重置步骤引用: $RESET_COUNT 次"

INPUT_COUNT=$(grep -c "<Input" src/pages/reset-password/index.tsx)
echo "   输入框数量: $INPUT_COUNT 个"

BUTTON_COUNT=$(grep -c "<Button" src/pages/reset-password/index.tsx)
echo "   按钮数量: $BUTTON_COUNT 个"

echo ""

# 6. 测试建议
echo "================================"
echo "✅ 所有检查通过！"
echo "================================"
echo ""
echo "下一步测试建议："
echo ""
echo "1. 启动开发服务器："
echo "   npm run dev:h5"
echo ""
echo "2. 在浏览器访问："
echo "   http://localhost:10086/#/pages/reset-password/index"
echo ""
echo "3. 查看页面顶部是否有黄色的调试区域"
echo ""
echo "4. 点击'切换到重置'按钮"
echo ""
echo "5. 查看是否显示重置密码表单"
echo ""
echo "详细测试指南请查看："
echo "   - RESET_PASSWORD_USAGE_GUIDE.md"
echo "   - RESET_PASSWORD_FINAL_SUMMARY.md"
echo ""
