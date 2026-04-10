-- Seed Services
INSERT INTO public.services (name, slug, description, duration_hours, base_price, per_cat_price, icon, sort_order) VALUES
  ('Drop-in Visit', 'drop-in', 'A 30-minute visit to your home for feeding, playtime, and litter care. Perfect for cats who prefer their own territory.', 1, 3500, 1000, 'Home', 1),
  ('Overnight Stay', 'overnight', 'Your sitter stays overnight in your home, providing 12+ hours of companionship, feeding, and care.', 12, 7500, 1500, 'Moon', 2),
  ('Extended Boarding', 'boarding', 'Multi-day care in a vetted sitter''s cat-proofed home. Includes daily photo updates and enrichment activities.', NULL, 5000, 1200, 'Building', 3);

-- Seed Service Addons
INSERT INTO public.service_addons (service_id, name, description, price) VALUES
  ((SELECT id FROM public.services WHERE slug = 'drop-in'), 'Medication Administration', 'Pill pockets, liquid meds, or insulin injections', 1000),
  ((SELECT id FROM public.services WHERE slug = 'drop-in'), 'Extended Playtime', 'Extra 20 minutes of interactive play with laser pointer and feather wands', 800),
  ((SELECT id FROM public.services WHERE slug = 'drop-in'), 'Plant Watering', 'Water up to 15 indoor plants during the visit', 500),
  ((SELECT id FROM public.services WHERE slug = 'overnight'), 'Medication Administration', 'Pill pockets, liquid meds, or insulin injections', 1500),
  ((SELECT id FROM public.services WHERE slug = 'overnight'), 'Morning Grooming', 'Light brushing and ear cleaning', 1200),
  ((SELECT id FROM public.services WHERE slug = 'overnight'), 'Mail & Package Collection', 'Bring in mail and packages during your stay', 0),
  ((SELECT id FROM public.services WHERE slug = 'boarding'), 'Medication Administration', 'Pill pockets, liquid meds, or insulin injections', 1500),
  ((SELECT id FROM public.services WHERE slug = 'boarding'), 'Webcam Access', 'Live camera feed so you can check in anytime', 2000),
  ((SELECT id FROM public.services WHERE slug = 'boarding'), 'Premium Enrichment', 'Puzzle feeders, cat TV, and rotating toy selection', 1000);
