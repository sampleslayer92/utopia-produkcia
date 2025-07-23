
-- Add DELETE policy for merchants table
CREATE POLICY "Admins can delete merchants" 
ON public.merchants 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for categories table
CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for item_types table
CREATE POLICY "Admins can delete item types" 
ON public.item_types 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for quick_sales table
CREATE POLICY "Admins can delete quick sales" 
ON public.quick_sales 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for customers table
CREATE POLICY "Admins can delete customers" 
ON public.customers 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for quick_sale_items table
CREATE POLICY "Admins can delete quick sale items" 
ON public.quick_sale_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for solutions table
CREATE POLICY "Admins can delete solutions" 
ON public.solutions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for solution_items table
CREATE POLICY "Admins can delete solution items" 
ON public.solution_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for solution_categories table
CREATE POLICY "Admins can delete solution categories" 
ON public.solution_categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for product_addons table
CREATE POLICY "Admins can delete product addons" 
ON public.product_addons 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for contract_templates table
CREATE POLICY "Admins can delete contract templates" 
ON public.contract_templates 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for contract_statuses table
CREATE POLICY "Admins can delete contract statuses" 
ON public.contract_statuses 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for kanban_columns table
CREATE POLICY "Admins can delete kanban columns" 
ON public.kanban_columns 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for user_kanban_preferences table
CREATE POLICY "Admins can delete user kanban preferences" 
ON public.user_kanban_preferences 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for notifications table
CREATE POLICY "Admins can delete notifications" 
ON public.notifications 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for error_logs table
CREATE POLICY "Admins can delete error logs" 
ON public.error_logs 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for step_analytics table
CREATE POLICY "Admins can delete step analytics" 
ON public.step_analytics 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for organizations table
CREATE POLICY "Admins can delete organizations" 
ON public.organizations 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for teams table
CREATE POLICY "Admins can delete teams" 
ON public.teams 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
