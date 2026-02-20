-- 1. Create a "profiles" table with user roles
-- This table automatically links to your auth.users on creation (via trigger)
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin', 'super_admin')),
  created_at timestamptz default now()
);

-- 2. Enable RLS on profiles
alter table public.profiles enable row level security;

-- 3. Create a trigger to automatically create a profile for every new user
-- This ensures that when someone signs up, they get a "user" role by default.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists to avoid errors on re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Allow users to read their own profile (and maybe admins can read all)
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- 5. Allow Super Admins to update roles (promote others to admin)
create policy "Super Admins can update roles" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- 6. Grant YOU (2025202567@ruc.edu.cn) Super Admin status
-- This part inserts/updates your profile specifically.
insert into public.profiles (id, email, role)
select id, email, 'super_admin'
from auth.users
where email = '2025202567@ruc.edu.cn'
on conflict (id) do update
set role = 'super_admin';

-- 7. Update Comments Policies:
-- Allow admins/super_admins to delete ANY comment.
drop policy if exists "Users can delete their own comments" on public.comments;

create policy "Users can delete own comments OR admins can delete any"
on public.comments
for delete
to authenticated
using (
  auth.uid() = user_id 
  OR 
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);
