-- Latent Merch — seed data for ə–01 tee and ə–02 hoodie.
-- Apply AFTER schema.sql. Variant UUIDs match the IDs hard-referenced in
-- components/ProductShowcase.tsx — keep them in sync.
--
-- Run via:  supabase db push < supabase/seed.sql
-- or paste into the Supabase SQL editor.

-- ---- products ----
insert into products (id, handle, name, description, active)
values
  ('a1000000-0000-4000-8000-000000000001', 'tee',
   'the latent tee',
   'Heavyweight cotton tee with hand-pulled copper schwa.',
   true),
  ('a2000000-0000-4000-8000-000000000001', 'hoodie',
   'the void hoodie',
   'Brushed-back jade fleece. Drop shoulder. Built to hang.',
   true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  active = excluded.active;

-- ---- variants ----
-- tee (29 JOD = 2900 minor units in 'jod')
insert into product_variants (id, product_id, sku, size, color, price_minor, currency, stock) values
  ('1a000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'TEE-BONE-XS', 'XS', 'bone', 2900, 'jod', 30),
  ('1a000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 'TEE-BONE-S',  'S',  'bone', 2900, 'jod', 50),
  ('1a000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000001', 'TEE-BONE-M',  'M',  'bone', 2900, 'jod', 60),
  ('1a000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 'TEE-BONE-L',  'L',  'bone', 2900, 'jod', 50),
  ('1a000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000001', 'TEE-BONE-XL', 'XL', 'bone', 2900, 'jod', 30)
on conflict (id) do update set
  sku = excluded.sku, price_minor = excluded.price_minor, currency = excluded.currency, stock = excluded.stock;

-- hoodie (59 JOD = 5900 minor units)
insert into product_variants (id, product_id, sku, size, color, price_minor, currency, stock) values
  ('2b000000-0000-4000-8000-000000000001', 'a2000000-0000-4000-8000-000000000001', 'HOOD-JADE-XS', 'XS', 'jade', 5900, 'jod', 20),
  ('2b000000-0000-4000-8000-000000000002', 'a2000000-0000-4000-8000-000000000001', 'HOOD-JADE-S',  'S',  'jade', 5900, 'jod', 35),
  ('2b000000-0000-4000-8000-000000000003', 'a2000000-0000-4000-8000-000000000001', 'HOOD-JADE-M',  'M',  'jade', 5900, 'jod', 40),
  ('2b000000-0000-4000-8000-000000000004', 'a2000000-0000-4000-8000-000000000001', 'HOOD-JADE-L',  'L',  'jade', 5900, 'jod', 35),
  ('2b000000-0000-4000-8000-000000000005', 'a2000000-0000-4000-8000-000000000001', 'HOOD-JADE-XL', 'XL', 'jade', 5900, 'jod', 20)
on conflict (id) do update set
  sku = excluded.sku, price_minor = excluded.price_minor, currency = excluded.currency, stock = excluded.stock;
