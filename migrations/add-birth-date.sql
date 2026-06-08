-- Capture full date of birth for goal personalization (replaces the single
-- "age" input). age is still stored (computed) for convenience, but birth_date
-- is the source of truth so the personalize form can prefill day/month/year.
alter table profiles add column if not exists birth_date date;
