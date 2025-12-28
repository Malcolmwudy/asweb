-- ============================================
-- 修复 update_updated_at_column 函数的安全警告
-- 设置固定的 search_path 以符合安全最佳实践
-- 
-- 说明：
-- Supabase 检测到 update_updated_at_column 函数的 search_path 是可变的，
-- 这可能导致安全问题。此脚本将修复所有相关函数，设置 search_path = ''。
-- ============================================

-- 修复 update_updated_at_column 函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- 注意事项
-- ============================================
-- 1. SET search_path = '' 强制使用完全限定的函数名，提高安全性
-- 2. SECURITY DEFINER 确保函数以创建者的权限执行
-- 3. 执行此脚本后，Supabase 的安全警告应该会消失
-- 4. 此方案比 search_path = 'public, pg_temp' 更严格，安全性更高

-- ============================================
-- 验证修复
-- ============================================
-- 执行以下查询验证函数已正确设置：
-- 
-- SELECT 
--   p.proname AS function_name,
--   pg_get_functiondef(p.oid) AS function_definition
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND p.proname = 'update_updated_at_column';

