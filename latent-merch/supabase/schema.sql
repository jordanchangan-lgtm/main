-- Latent Merch — catalog + orders schema
-- Money is stored in integer minor units (e.g. cents/fils). Never floats.

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  handle      text unique not null,
  name        text not null,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  sku         text unique not null,
  size        text,
  color       text,
  price_minor integer not null check (price_minor >= 0),
  currency    text not null default 'usd',
  stock       integer not null default 0 check (stock >= 0)
);

create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  stripe_session text unique not null,
  email          text,
  amount_minor   integer not null,
  currency       text not null,
  status         text not null default 'paid',
  created_at     timestamptz not null default now()
);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  variant_id  uuid not null references product_variants(id),
  quantity    integer not null check (quantity > 0),
  price_minor integer not null
);

-- RLS: public can read active catalog only. Writes happen via the service-role key (bypasses RLS).
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "public reads active products"
  on products for select using (active = true);

create policy "public reads variants of active products"
  on product_variants for select using (
    exists (select 1 from products p where p.id = product_id and p.active = true)
  );

-- Atomic order placement, called from the Stripe webhook (service role).
-- p_items: jsonb array of { "variantId": uuid, "quantity": int }
create or replace function place_order(
  p_stripe_session text,
  p_email text,
  p_amount_minor integer,
  p_currency text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_variant uuid;
  v_qty int;
  v_price int;
begin
  insert into orders (stripe_session, email, amount_minor, currency)
  values (p_stripe_session, p_email, p_amount_minor, p_currency)
  on conflict (stripe_session) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    return null; -- already processed (idempotent on webhook retries)
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_variant := (v_item->>'variantId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    select price_minor into v_price from product_variants where id = v_variant;

    insert into order_items (order_id, variant_id, quantity, price_minor)
    values (v_order_id, v_variant, v_qty, v_price);

    update product_variants set stock = stock - v_qty where id = v_variant;
  end loop;

  return v_order_id;
end;
$$;
