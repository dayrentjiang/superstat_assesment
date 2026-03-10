-- Add avatar, jersey number, and position to players
alter table players add column avatar_url text;
alter table players add column jersey_number integer;
alter table players add column position text;
