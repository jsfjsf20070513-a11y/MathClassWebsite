-- 1. Create profiles table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin', 'super_admin')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- 2. Create policies for PROFILES table
-- Drop existing policies to avoid conflicts
drop policy if exists "Public profiles are viewable by everyone" on public.profiles; 
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;

create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

-- 3. Trigger for new users
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Set YOU as Super Admin
-- This uses ON CONFLICT to handle if the row already exists
insert into public.profiles (id, email, role)
select id, email, 'super_admin'
from auth.users
where email = '2025202567@ruc.edu.cn'
on conflict (id) do update
set role = 'super_admin';

-- 5. Update COMMENTS table policies for admin deletion
-- Drop ANY existing delete policies on comments to be safe
drop policy if exists "Users can delete their own comments" on public.comments;
drop policy if exists "Enable delete for users based on user_id" on public.comments;
drop policy if exists "Users can delete own comments OR admins can delete any" on public.comments;

-- Create the new super admin delete policy
create policy "Users can delete own comments OR admins can delete any"
on public.comments
for delete
to authenticated
using (
  (auth.uid() = user_id) 
  OR 
  (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ))
);
