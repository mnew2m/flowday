-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#7c3aed',
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
create policy "Users can manage their own categories"
  on public.categories for all using (auth.uid() = user_id);

-- Todos
create type recurrence_type as enum ('none', 'daily', 'weekly', 'monthly', 'custom');

create table public.todos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  completed boolean not null default false,
  due_date timestamptz,
  completed_at timestamptz,
  reminder_time timestamptz,
  recurrence_type recurrence_type not null default 'none',
  recurrence_interval integer not null default 1,
  recurrence_days_of_week integer[],
  recurrence_day_of_month integer,
  recurrence_end_date timestamptz,
  parent_id uuid references public.todos(id) on delete set null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;
create policy "Users can manage their own todos"
  on public.todos for all using (auth.uid() = user_id);

-- Habits
create type habit_recurrence_type as enum ('daily', 'weekly', 'custom');

create table public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  color text not null default '#7c3aed',
  recurrence_type habit_recurrence_type not null default 'daily',
  recurrence_days_of_week integer[],
  reminder_time time,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;
create policy "Users can manage their own habits"
  on public.habits for all using (auth.uid() = user_id);

-- Habit Completions
create table public.habit_completions (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  completed_date date not null,
  created_at timestamptz not null default now(),
  unique(habit_id, completed_date)
);

alter table public.habit_completions enable row level security;
create policy "Users can manage their own habit completions"
  on public.habit_completions for all
  using (
    exists (
      select 1 from public.habits
      where habits.id = habit_completions.habit_id
        and habits.user_id = auth.uid()
    )
  );
