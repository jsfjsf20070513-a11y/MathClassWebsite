-- Enable RLS for the comments table
alter table "public"."comments" enable row level security;

-- Policy 1: Allow everyone to view comments (SELECT)
-- This allows anyone (even unauthenticated users) to see the comments on the site.
-- If you want only logged-in users to see them, change `true` to `auth.role() = 'authenticated'`
create policy "Enable read access for all users"
on "public"."comments"
as PERMISSIVE
for SELECT
to public
using (
  true
);

-- Policy 2: Allow authenticated users to insert their own comments (INSERT)
-- This ensures that only logged-in users can post, and the user_id must match their own ID.
create policy "Enable insert for authenticated users only"
on "public"."comments"
as PERMISSIVE
for INSERT
to authenticated
with check (
  auth.uid() = user_id
);

-- Policy 3: Allow users to update their own comments (UPDATE)
-- Users can only edit rows where the user_id matches their own ID.
create policy "Enable update for users based on user_id"
on "public"."comments"
as PERMISSIVE
for UPDATE
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

-- Policy 4: Allow users to delete their own comments (DELETE)
-- Users can only delete rows where the user_id matches their own ID.
create policy "Enable delete for users based on user_id"
on "public"."comments"
as PERMISSIVE
for DELETE
to authenticated
using (
  auth.uid() = user_id
);
