-- Fix security issues: Set proper search paths for functions and restrict policies to authenticated users only

-- Update function search paths for security
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'CNF' || LPAD(EXTRACT(YEAR FROM NOW())::TEXT, 4, '0') || 
           LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || 
           LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION check_room_availability(
  p_hotel_id UUID,
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_reservation UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.reservations
    WHERE hotel_id = p_hotel_id
    AND room_id = p_room_id
    AND status IN ('confirmed', 'checked_in')
    AND (p_exclude_reservation IS NULL OR id != p_exclude_reservation)
    AND NOT (check_out_date <= p_check_in OR check_in_date >= p_check_out)
  );
END;
$$;

-- Update RLS policies to restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view room types for their hotels" ON public.room_types;
DROP POLICY IF EXISTS "Users can manage room types for their hotels" ON public.room_types;

CREATE POLICY "Authenticated users can view room types" ON public.room_types
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage room types" ON public.room_types
FOR ALL TO authenticated USING (true);

-- Update other policies to be restricted to authenticated users
DROP POLICY IF EXISTS "Users can view rooms for their hotels" ON public.rooms;
DROP POLICY IF EXISTS "Users can manage rooms for their hotels" ON public.rooms;

CREATE POLICY "Users can view rooms for their hotels" ON public.rooms
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = rooms.hotel_id
  )
);

CREATE POLICY "Users can manage rooms for their hotels" ON public.rooms
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = rooms.hotel_id
  )
);

-- Update guests policies
DROP POLICY IF EXISTS "Users can view guests for their hotels" ON public.guests;
DROP POLICY IF EXISTS "Users can manage guests for their hotels" ON public.guests;

CREATE POLICY "Users can view guests for their hotels" ON public.guests
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = guests.hotel_id
  )
);

CREATE POLICY "Users can manage guests for their hotels" ON public.guests
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = guests.hotel_id
  )
);

-- Update reservations policies
DROP POLICY IF EXISTS "Users can view reservations for their hotels" ON public.reservations;
DROP POLICY IF EXISTS "Users can manage reservations for their hotels" ON public.reservations;

CREATE POLICY "Users can view reservations for their hotels" ON public.reservations
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = reservations.hotel_id
  )
);

CREATE POLICY "Users can manage reservations for their hotels" ON public.reservations
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = reservations.hotel_id
  )
);

-- Update daily_rates policies
DROP POLICY IF EXISTS "Users can view rates for their hotels" ON public.daily_rates;
DROP POLICY IF EXISTS "Users can manage rates for their hotels" ON public.daily_rates;

CREATE POLICY "Users can view rates for their hotels" ON public.daily_rates
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = daily_rates.hotel_id
  )
);

CREATE POLICY "Users can manage rates for their hotels" ON public.daily_rates
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = daily_rates.hotel_id
  )
);

-- Update payments policies
DROP POLICY IF EXISTS "Users can view payments for their hotels" ON public.payments;
DROP POLICY IF EXISTS "Users can manage payments for their hotels" ON public.payments;

CREATE POLICY "Users can view payments for their hotels" ON public.payments
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = payments.reservation_id
  )
);

CREATE POLICY "Users can manage payments for their hotels" ON public.payments
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = payments.reservation_id
  )
);

-- Update housekeeping policies
DROP POLICY IF EXISTS "Users can view housekeeping for their hotels" ON public.housekeeping;
DROP POLICY IF EXISTS "Users can manage housekeeping for their hotels" ON public.housekeeping;

CREATE POLICY "Users can view housekeeping for their hotels" ON public.housekeeping
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = housekeeping.hotel_id
  )
);

CREATE POLICY "Users can manage housekeeping for their hotels" ON public.housekeeping
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = housekeeping.hotel_id
  )
);

-- Update folio_items policies
DROP POLICY IF EXISTS "Users can view folio items for their hotels" ON public.folio_items;
DROP POLICY IF EXISTS "Users can manage folio items for their hotels" ON public.folio_items;

CREATE POLICY "Users can view folio items for their hotels" ON public.folio_items
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = folio_items.reservation_id
  )
);

CREATE POLICY "Users can manage folio items for their hotels" ON public.folio_items
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = folio_items.reservation_id
  )
);

-- Update existing policies to be restricted to authenticated users
DROP POLICY IF EXISTS "Authenticated users can view fx rates" ON public.fx_rates;
CREATE POLICY "Authenticated users can view fx rates" ON public.fx_rates
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can view their assigned hotels" ON public.hotels;
CREATE POLICY "Users can view their assigned hotels" ON public.hotels
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = hotels.id
  )
);

DROP POLICY IF EXISTS "Users can view stats for their hotels" ON public.monthly_stats;
CREATE POLICY "Users can view stats for their hotels" ON public.monthly_stats
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_hotels
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = monthly_stats.hotel_id
  )
);

DROP POLICY IF EXISTS "Users can view their own hotel assignments" ON public.user_hotels;
CREATE POLICY "Users can view their own hotel assignments" ON public.user_hotels
FOR SELECT TO authenticated USING (user_id = auth.uid());