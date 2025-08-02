-- Create enums for PMS system
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'out_of_order', 'maintenance', 'dirty', 'clean');
CREATE TYPE public.reservation_status AS ENUM ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded');
CREATE TYPE public.guest_type AS ENUM ('individual', 'group', 'corporate');
CREATE TYPE public.booking_channel AS ENUM ('direct', 'booking_com', 'expedia', 'airbnb', 'walk_in', 'phone');

-- Room Types table
CREATE TABLE public.room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  room_number TEXT NOT NULL,
  room_type_id UUID REFERENCES public.room_types(id),
  floor INTEGER,
  status public.room_status DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_id, room_number)
);

-- Guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  id_number TEXT,
  nationality TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  country TEXT,
  guest_type public.guest_type DEFAULT 'individual',
  vip BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  guest_id UUID REFERENCES public.guests(id),
  room_id UUID REFERENCES public.rooms(id),
  room_type_id UUID REFERENCES public.room_types(id),
  confirmation_number TEXT UNIQUE NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  status public.reservation_status DEFAULT 'confirmed',
  channel public.booking_channel DEFAULT 'direct',
  commission_rate DECIMAL(5,2) DEFAULT 0,
  special_requests TEXT,
  arrival_time TIME,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily rates table for dynamic pricing
CREATE TABLE public.daily_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  room_type_id UUID REFERENCES public.room_types(id),
  rate_date DATE NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_id, room_type_id, rate_date)
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES public.reservations(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status public.payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Housekeeping table
CREATE TABLE public.housekeeping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  room_id UUID REFERENCES public.rooms(id),
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.room_status DEFAULT 'dirty',
  assigned_to TEXT,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Folio items for guest billing
CREATE TABLE public.folio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES public.reservations(id),
  item_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  category TEXT, -- 'room', 'tax', 'service', 'extra'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housekeeping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folio_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_types
CREATE POLICY "Users can view room types for their hotels" ON public.room_types
FOR SELECT USING (true); -- Room types can be viewed by all authenticated users

CREATE POLICY "Users can manage room types for their hotels" ON public.room_types
FOR ALL USING (true); -- For now, allow all operations for authenticated users

-- RLS Policies for rooms
CREATE POLICY "Users can view rooms for their hotels" ON public.rooms
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = rooms.hotel_id
  )
);

CREATE POLICY "Users can manage rooms for their hotels" ON public.rooms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = rooms.hotel_id
  )
);

-- RLS Policies for guests
CREATE POLICY "Users can view guests for their hotels" ON public.guests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = guests.hotel_id
  )
);

CREATE POLICY "Users can manage guests for their hotels" ON public.guests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = guests.hotel_id
  )
);

-- RLS Policies for reservations
CREATE POLICY "Users can view reservations for their hotels" ON public.reservations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = reservations.hotel_id
  )
);

CREATE POLICY "Users can manage reservations for their hotels" ON public.reservations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = reservations.hotel_id
  )
);

-- RLS Policies for daily_rates
CREATE POLICY "Users can view rates for their hotels" ON public.daily_rates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = daily_rates.hotel_id
  )
);

CREATE POLICY "Users can manage rates for their hotels" ON public.daily_rates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = daily_rates.hotel_id
  )
);

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their hotels" ON public.payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = payments.reservation_id
  )
);

CREATE POLICY "Users can manage payments for their hotels" ON public.payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = payments.reservation_id
  )
);

-- RLS Policies for housekeeping
CREATE POLICY "Users can view housekeeping for their hotels" ON public.housekeeping
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = housekeeping.hotel_id
  )
);

CREATE POLICY "Users can manage housekeeping for their hotels" ON public.housekeeping
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = housekeeping.hotel_id
  )
);

-- RLS Policies for folio_items
CREATE POLICY "Users can view folio items for their hotels" ON public.folio_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = folio_items.reservation_id
  )
);

CREATE POLICY "Users can manage folio items for their hotels" ON public.folio_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN user_hotels uh ON uh.hotel_id = r.hotel_id
    WHERE uh.user_id = auth.uid() 
    AND r.id = folio_items.reservation_id
  )
);

-- Create indexes for better performance
CREATE INDEX idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_guests_hotel_id ON public.guests(hotel_id);
CREATE INDEX idx_reservations_hotel_id ON public.reservations(hotel_id);
CREATE INDEX idx_reservations_dates ON public.reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_daily_rates_hotel_room_date ON public.daily_rates(hotel_id, room_type_id, rate_date);

-- Triggers for updated_at
CREATE TRIGGER update_room_types_updated_at
  BEFORE UPDATE ON public.room_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate confirmation numbers
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'CNF' || LPAD(EXTRACT(YEAR FROM NOW())::TEXT, 4, '0') || 
           LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || 
           LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
  p_hotel_id UUID,
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_reservation UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;