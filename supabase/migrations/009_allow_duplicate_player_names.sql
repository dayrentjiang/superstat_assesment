-- Allow duplicate player names (two people can share the same name)
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_name_key;
