#!/usr/bin/env node

/**
 * 微信登录 Edge Function 测试脚本
 * 用于验证 Edge Function 是否正常工作
 */

const SUPABASE_URL = 'https://backend.appmiaoda.com/projects/supabase283617603421782016';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/wechat_miniapp_login`;

console.log('🔍 测试微信登录 Edge Function');
console.log('📍 URL:', EDGE_FUNCTION_URL);
console.log('');

// 测试1：OPTIONS 请求（CORS 预检）
console.log('测试1：OPTIONS 请求（CORS 预检）');
fetch(EDGE_FUNCTION_URL, {
  method: 'OPTIONS',
  headers: {
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  }
})
  .then(res => {
    console.log('✅ OPTIONS 请求成功');
    console.log('   状态码:', res.status);
    console.log('   CORS 头:', res.headers.get('Access-Control-Allow-Origin'));
    console.log('');
    return res;
  })
  .catch(err => {
    console.error('❌ OPTIONS 请求失败:', err.message);
    console.log('');
  });

// 测试2：POST 请求（缺少 code 参数）
setTimeout(() => {
  console.log('测试2：POST 请求（缺少 code 参数）');
  fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      console.log('✅ POST 请求完成');
      console.log('   状态码:', status);
      console.log('   响应数据:', JSON.stringify(data, null, 2));
      console.log('');
      
      if (status === 400 && data.message === '缺少微信登录凭证 code') {
        console.log('✅ Edge Function 正常工作（正确返回 400 错误）');
      } else if (status === 500 && data.message && data.message.includes('微信配置缺失')) {
        console.log('⚠️  Edge Function 正常工作，但环境变量未配置');
        console.log('   需要配置：');
        console.log('   - WECHAT_MINIPROGRAM_LOGIN_APP_ID');
        console.log('   - WECHAT_MINIPROGRAM_LOGIN_APP_SECRET');
      } else {
        console.log('⚠️  Edge Function 返回了意外的响应');
      }
    })
    .catch(err => {
      console.error('❌ POST 请求失败:', err.message);
    });
}, 1000);

// 测试3：POST 请求（带有 code 参数）
setTimeout(() => {
  console.log('');
  console.log('测试3：POST 请求（带有测试 code）');
  fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: 'test_code_123' })
  })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      console.log('✅ POST 请求完成');
      console.log('   状态码:', status);
      console.log('   响应数据:', JSON.stringify(data, null, 2));
      console.log('');
      
      if (status === 500 && data.message && data.message.includes('微信配置缺失')) {
        console.log('⚠️  环境变量未配置');
        console.log('');
        console.log('📋 配置步骤：');
        console.log('1. 登录微信公众平台 (https://mp.weixin.qq.com/)');
        console.log('2. 进入小程序管理后台');
        console.log('3. 导航到：开发 → 开发管理 → 开发设置');
        console.log('4. 复制 AppID 和 AppSecret');
        console.log('5. 在系统提示时输入这两个值');
      } else if (status === 500 && data.message && data.message.includes('微信接口错误')) {
        console.log('✅ Edge Function 正常工作（微信接口返回错误是预期的，因为使用了测试 code）');
      } else {
        console.log('⚠️  Edge Function 返回了意外的响应');
      }
      
      console.log('');
      console.log('🎉 测试完成！');
    })
    .catch(err => {
      console.error('❌ POST 请求失败:', err.message);
      console.log('');
      console.log('🎉 测试完成！');
    });
}, 2000);
