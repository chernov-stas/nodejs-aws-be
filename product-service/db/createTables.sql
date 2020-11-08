create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
);

create table if not exists stocks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into products ("title", "description", "price") values
('Giant XTC ADVANCED SL 29', 'When it comes to pure XC climbing, acceleration and speed, nothing beats the efficiency of this lightweight composite hardtail. Engineered for pedaling stiffness, quick handling and the smooth, balanced ride of 29-inch wheels, it''s just the kick you need to move up through the pack.', 4700),
('Giant TRINITY ADVANCED', 'From Ironman distance triathlons to shorter efforts against the clock, give yourself a true advantage in speed and aerodynamics. This super-efficient composite machine gives you everything you need to chase a new PR.', 2500),
('Giant TCR ADVANCED PRO 0 DISC', 'Climb, corner and descend with unrivaled all-rounder performance. From the mountains to the flats, in all types of conditions, the new TCR Advanced Pro Disc takes it to the next level with a lighter, stiffer frame and new aero-engineered tubing.', 5600),
('Giant REVOLT ADVANCED 0', 'Almost anything goes in gravel racing and riding. It''s a mixed-up challenge of speed, endurance and handling. This high-performance all-rounder does it all. It''s smooth, it''s efficient, and it''s your new best friend for pushing limits on roads, gravel and dirt.', 3650),
('Giant TCX ADVANCED', 'Blast through the sandpit, carve through corners, and lay down the power on the final finishing stretch. This sharp-handling cyclocross machine is made for podium pursuits during cross season and mixed road and dirt rides all year long.', 2550);

insert into stocks ("product_id", "count") values
('4c5edc51-fc52-40be-a705-c6a5c2c8552c', 13),
('adf17a9b-4d99-4e53-b524-b5b877a2e9b6', 1),
('92e1010e-d709-4a11-b552-df54e86af178', 3),
('5e3ae20d-8362-4143-b2f6-b2e188aa241e', 5),
('a07079b1-7045-41dc-bd12-6aecb68fa310', 7);

