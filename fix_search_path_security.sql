-- ============================================
-- 修复 update_updated_at_column 函数的安全问题
-- 问题：Function Search Path Mutable
-- 解决：设置函数的 search_path 参数
-- ============================================

-- 删除旧函数（如果存在）
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- 重新创建函数，设置安全的 search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 重新创建触发器（如果需要）
-- 注意：根据你的表结构，可能需要为每个表创建触发器
-- 以下是示例，请根据实际情况调整

-- 示例：为 support_teams 表创建触发器
DROP TRIGGER IF EXISTS update_support_teams_updated_at ON public.support_teams;
CREATE TRIGGER update_support_teams_updated_at
  BEFORE UPDATE ON public.support_teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 示例：为 more_tips 表创建触发器
DROP TRIGGER IF EXISTS update_more_tips_updated_at ON public.more_tips;
CREATE TRIGGER update_more_tips_updated_at
  BEFORE UPDATE ON public.more_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 如果还有其他使用 updated_at 的表，请添加类似的触发器
-- 例如：
-- DROP TRIGGER IF EXISTS update_table_name_updated_at ON public.table_name;
-- CREATE TRIGGER update_table_name_updated_at
--   BEFORE UPDATE ON public.table_name
--   FOR EACH ROW
--   EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 验证修复
-- ============================================

-- 检查函数是否已正确设置 search_path
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'update_updated_at_column';

-- ============================================
-- 说明
-- ============================================
-- 1. SECURITY DEFINER: 函数以创建者的权限运行
-- 2. SET search_path = public, pg_temp: 限制搜索路径，防止 SQL 注入
-- 3. 重新创建触发器以确保它们使用新的安全函数

