import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useRooms, useRoomTypes, useCreateReservation, useCreateGuest } from "@/hooks/usePMSData";
import { cn } from "@/lib/utils";

const guestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  id_number: z.string().optional(),
  nationality: z.string().optional(),
  date_of_birth: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  guest_type: z.enum(["individual", "group", "corporate"]).default("individual"),
  vip: z.boolean().default(false),
  notes: z.string().optional()
});

const reservationSchema = z.object({
  guest: guestSchema,
  room_id: z.string().min(1, "Room selection is required"),
  room_type_id: z.string().optional(),
  check_in_date: z.date({ required_error: "Check-in date is required" }),
  check_out_date: z.date({ required_error: "Check-out date is required" }),
  adults: z.number().min(1, "At least 1 adult required").default(1),
  children: z.number().min(0).default(0),
  total_amount: z.number().min(0).default(0),
  paid_amount: z.number().min(0).default(0),
  currency: z.string().default("EUR"),
  channel: z.enum(["direct", "booking_com", "expedia", "airbnb", "walk_in", "phone"]).default("direct"),
  commission_rate: z.number().min(0).max(100).default(0),
  special_requests: z.string().optional(),
  arrival_time: z.string().optional()
}).refine((data) => data.check_out_date > data.check_in_date, {
  message: "Check-out date must be after check-in date",
  path: ["check_out_date"]
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  hotelId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultRoom?: string;
}

export function ReservationForm({ hotelId, onSuccess, onCancel, defaultRoom }: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: rooms = [] } = useRooms(hotelId);
  const { data: roomTypes = [] } = useRoomTypes();
  const createReservation = useCreateReservation();
  const createGuest = useCreateGuest();

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guest: {
        guest_type: "individual",
        vip: false
      },
      room_id: defaultRoom || "",
      adults: 1,
      children: 0,
      total_amount: 0,
      paid_amount: 0,
      currency: "EUR",
      channel: "direct",
      commission_rate: 0
    }
  });

  const watchedCheckIn = form.watch("check_in_date");
  const watchedCheckOut = form.watch("check_out_date");
  const watchedRoom = form.watch("room_id");

  // Calculate total amount based on selected room and dates
  const calculateTotal = () => {
    if (!watchedCheckIn || !watchedCheckOut || !watchedRoom) return 0;
    
    const room = rooms.find(r => r.id === watchedRoom);
    const baseRate = room?.room_type?.base_rate || 0;
    const nights = Math.ceil((watchedCheckOut.getTime() - watchedCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return baseRate * nights;
  };

  // Update total amount when dependencies change
  React.useEffect(() => {
    const total = calculateTotal();
    form.setValue("total_amount", total);
  }, [watchedCheckIn, watchedCheckOut, watchedRoom, form]);

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      // First create the guest
      const guest = await createGuest.mutateAsync({
        first_name: data.guest.first_name,
        last_name: data.guest.last_name,
        guest_type: data.guest.guest_type || 'individual',
        vip: data.guest.vip || false,
        ...data.guest,
        hotel_id: hotelId,
        date_of_birth: data.guest.date_of_birth?.toISOString().split('T')[0]
      });

      // Then create the reservation
      await createReservation.mutateAsync({
        hotel_id: hotelId,
        guest_id: guest.id,
        room_id: data.room_id,
        room_type_id: data.room_type_id,
        check_in_date: format(data.check_in_date, "yyyy-MM-dd"),
        check_out_date: format(data.check_out_date, "yyyy-MM-dd"),
        adults: data.adults,
        children: data.children,
        total_amount: data.total_amount,
        paid_amount: data.paid_amount,
        currency: data.currency,
        status: 'confirmed',
        channel: data.channel,
        commission_rate: data.commission_rate,
        special_requests: data.special_requests,
        arrival_time: data.arrival_time
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error creating reservation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableRooms = rooms.filter(room => 
    room.status === 'available' || room.status === 'clean'
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Reservation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Guest Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guest.first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guest.last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guest.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guest.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guest.id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guest.nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Reservation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reservation Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="check_in_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="check_out_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => !watchedCheckIn || date <= watchedCheckIn}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              Room {room.room_number} - {room.room_type?.name}
                              {room.room_type?.base_rate && (
                                <Badge variant="secondary" className="ml-2">
                                  €{room.room_type.base_rate}/night
                                </Badge>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adults</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paid_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Channel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="booking_com">Booking.com</SelectItem>
                          <SelectItem value="expedia">Expedia</SelectItem>
                          <SelectItem value="airbnb">Airbnb</SelectItem>
                          <SelectItem value="walk_in">Walk-in</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Special Requests */}
            <FormField
              control={form.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any special requests or notes..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Reservation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}