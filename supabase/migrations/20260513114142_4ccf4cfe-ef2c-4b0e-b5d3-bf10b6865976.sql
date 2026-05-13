CREATE POLICY "Authenticated users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY "Users can view their own profile" ON public.profiles;