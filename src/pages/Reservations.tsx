import { useState } from "react";
import { PMSLayout } from "@/components/PMSLayout";
import { ReservationForm } from "@/components/ReservationForm";
import { useHotels } from "@/hooks/useHotelData";
import { useReservations } from "@/hooks/usePMSData";
import { HotelSelector } from "@/components/HotelSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, User, Bed } from "lucide-react";
import { format } from "date-fns";

export function Reservations() {
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  
  const { data: hotels = [] } = useHotels();
  const { data: reservations = [], isLoading } = useReservations(selectedHotel);

  const handleCreateReservation = () => {
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'checked_in':
        return 'bg-green-500';
      case 'checked_out':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'no_show':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'booking_com':
        return 'Booking.com';
      case 'walk_in':
        return 'Walk-in';
      default:
        return channel.charAt(0).toUpperCase() + channel.slice(1);
    }
  };

  if (showForm && selectedHotel) {
    return (
      <PMSLayout>
        <ReservationForm
          hotelId={selectedHotel}
          onSuccess={handleCreateReservation}
          onCancel={() => setShowForm(false)}
        />
      </PMSLayout>
    );
  }

  return (
    <PMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reservations</h1>
          <div className="flex items-center gap-4">
            <HotelSelector
              value={selectedHotel}
              onValueChange={setSelectedHotel}
            />
            <Button 
              onClick={() => setShowForm(true)}
              disabled={!selectedHotel}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Reservation
            </Button>
          </div>
        </div>

        {selectedHotel && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reservations.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reservations.filter(r => r.status === 'checked_in').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Arrivals Today</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reservations.filter(r => 
                      r.check_in_date === new Date().toISOString().split('T')[0] && 
                      r.status === 'confirmed'
                    ).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    €{reservations.reduce((sum, r) => sum + r.total_amount, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservations Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No reservations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start taking bookings by creating your first reservation.
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      Create First Reservation
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Confirmation</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-mono text-sm">
                            {reservation.confirmation_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {reservation.guest?.first_name} {reservation.guest?.last_name}
                              </div>
                              {reservation.guest?.email && (
                                <div className="text-sm text-muted-foreground">
                                  {reservation.guest.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {reservation.room ? (
                              <div>
                                <div className="font-medium">Room {reservation.room.room_number}</div>
                                <div className="text-sm text-muted-foreground">
                                  {reservation.room.room_type?.name}
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground">
                                {reservation.room_type?.name || 'No room assigned'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservation.check_in_date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservation.check_out_date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(reservation.status)}>
                              {reservation.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getChannelLabel(reservation.channel)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {reservation.currency} {reservation.total_amount.toFixed(2)}
                              </div>
                              {reservation.paid_amount > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  Paid: {reservation.currency} {reservation.paid_amount.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!selectedHotel && hotels.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Select a Hotel</h3>
            <p className="text-muted-foreground">
              Choose a hotel from the dropdown above to view and manage reservations.
            </p>
          </div>
        )}
      </div>
    </PMSLayout>
  );
}