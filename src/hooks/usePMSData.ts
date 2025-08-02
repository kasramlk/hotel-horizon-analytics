import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface RoomType {
  id: string;
  name: string;
  description?: string;
  base_rate: number;
  max_occupancy: number;
  amenities?: string[];
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  room_type_id?: string;
  floor?: number;
  status: 'available' | 'occupied' | 'out_of_order' | 'maintenance' | 'dirty' | 'clean';
  notes?: string;
  room_type?: RoomType;
}

export interface Guest {
  id: string;
  hotel_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  id_number?: string;
  nationality?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  guest_type: 'individual' | 'group' | 'corporate';
  vip: boolean;
  notes?: string;
}

export interface Reservation {
  id: string;
  hotel_id: string;
  guest_id?: string;
  room_id?: string;
  room_type_id?: string;
  confirmation_number: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_amount: number;
  paid_amount: number;
  currency: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  channel: 'direct' | 'booking_com' | 'expedia' | 'airbnb' | 'walk_in' | 'phone';
  commission_rate: number;
  special_requests?: string;
  arrival_time?: string;
  guest?: Guest;
  room?: Room;
  room_type?: RoomType;
}

// Room Types Hooks
export function useRoomTypes() {
  return useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as RoomType[];
    }
  });
}

// Rooms Hooks
export function useRooms(hotelId?: string) {
  return useQuery({
    queryKey: ['rooms', hotelId],
    queryFn: async () => {
      if (!hotelId) return [];
      
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_type:room_types(*)
        `)
        .eq('hotel_id', hotelId)
        .order('room_number');
      
      if (error) throw error;
      return data as Room[];
    },
    enabled: !!hotelId
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (room: Omit<Room, 'id'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Room created successfully",
        description: "The room has been added to your hotel."
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating room",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: string }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Room updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating room",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Guests Hooks
export function useGuests(hotelId?: string) {
  return useQuery({
    queryKey: ['guests', hotelId],
    queryFn: async () => {
      if (!hotelId) return [];
      
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Guest[];
    },
    enabled: !!hotelId
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (guest: Omit<Guest, 'id'>) => {
      const { data, error } = await supabase
        .from('guests')
        .insert(guest)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Guest created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating guest",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Reservations Hooks
export function useReservations(hotelId?: string) {
  return useQuery({
    queryKey: ['reservations', hotelId],
    queryFn: async () => {
      if (!hotelId) return [];
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          guest:guests(*),
          room:rooms(*, room_type:room_types(*)),
          room_type:room_types(*)
        `)
        .eq('hotel_id', hotelId)
        .order('check_in_date', { ascending: false });
      
      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!hotelId
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id' | 'confirmation_number'>) => {
      // Generate confirmation number
      const { data: confirmationData, error: confirmationError } = await supabase
        .rpc('generate_confirmation_number');
      
      if (confirmationError) throw confirmationError;

      const { data, error } = await supabase
        .from('reservations')
        .insert({
          ...reservation,
          confirmation_number: confirmationData
        })
        .select(`
          *,
          guest:guests(*),
          room:rooms(*, room_type:room_types(*)),
          room_type:room_types(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Reservation created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating reservation",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reservation> & { id: string }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          guest:guests(*),
          room:rooms(*, room_type:room_types(*)),
          room_type:room_types(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Reservation updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating reservation",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Room availability check
export function useCheckRoomAvailability() {
  return useMutation({
    mutationFn: async ({
      hotelId,
      roomId,
      checkIn,
      checkOut,
      excludeReservation
    }: {
      hotelId: string;
      roomId: string;
      checkIn: string;
      checkOut: string;
      excludeReservation?: string;
    }) => {
      const { data, error } = await supabase
        .rpc('check_room_availability', {
          p_hotel_id: hotelId,
          p_room_id: roomId,
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_exclude_reservation: excludeReservation
        });
      
      if (error) throw error;
      return data as boolean;
    }
  });
}