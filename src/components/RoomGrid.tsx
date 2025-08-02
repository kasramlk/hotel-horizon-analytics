import { useMemo } from "react";
import { useRooms, useReservations } from "@/hooks/usePMSData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, User, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomGridProps {
  hotelId: string;
  onRoomClick?: (roomId: string) => void;
  onAddRoom?: () => void;
}

export function RoomGrid({ hotelId, onRoomClick, onAddRoom }: RoomGridProps) {
  const { data: rooms = [], isLoading: roomsLoading } = useRooms(hotelId);
  const { data: reservations = [] } = useReservations(hotelId);

  // Get room status with current occupancy
  const roomsWithStatus = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return rooms.map(room => {
      // Find active reservation for this room
      const activeReservation = reservations.find(res => 
        res.room_id === room.id && 
        res.status === 'checked_in' &&
        res.check_in_date <= today &&
        res.check_out_date > today
      );

      // Find upcoming reservation
      const upcomingReservation = reservations.find(res =>
        res.room_id === room.id &&
        res.status === 'confirmed' &&
        res.check_in_date === today
      );

      let displayStatus = room.status;
      let guest = null;

      if (activeReservation) {
        displayStatus = 'occupied';
        guest = activeReservation.guest;
      } else if (upcomingReservation) {
        displayStatus = 'available'; // Arrival today
        guest = upcomingReservation.guest;
      }

      return {
        ...room,
        displayStatus,
        guest,
        activeReservation,
        upcomingReservation
      };
    });
  }, [rooms, reservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'dirty':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'clean':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'out_of_order':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'maintenance':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'Occupied';
      case 'available':
        return 'Available';
      case 'dirty':
        return 'Dirty';
      case 'clean':
        return 'Clean';
      case 'out_of_order':
        return 'Out of Order';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  // Group rooms by floor
  const roomsByFloor = useMemo(() => {
    const grouped = roomsWithStatus.reduce((acc, room) => {
      const floor = room.floor || 0;
      if (!acc[floor]) {
        acc[floor] = [];
      }
      acc[floor].push(room);
      return acc;
    }, {} as Record<number, typeof roomsWithStatus>);

    // Sort by room number within each floor
    Object.keys(grouped).forEach(floor => {
      grouped[parseInt(floor)].sort((a, b) => 
        a.room_number.localeCompare(b.room_number, undefined, { numeric: true })
      );
    });

    return grouped;
  }, [roomsWithStatus]);

  if (roomsLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 h-32">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Room Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Room Plan</h2>
        <Button onClick={onAddRoom} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          { status: 'occupied', label: 'Occupied', color: 'bg-red-500' },
          { status: 'available', label: 'Available', color: 'bg-green-500' },
          { status: 'dirty', label: 'Dirty', color: 'bg-yellow-500' },
          { status: 'clean', label: 'Clean', color: 'bg-blue-500' },
          { status: 'out_of_order', label: 'Out of Order', color: 'bg-gray-500' },
          { status: 'maintenance', label: 'Maintenance', color: 'bg-orange-500' }
        ].map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", color)}></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Rooms by Floor */}
      {Object.entries(roomsByFloor)
        .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Highest floor first
        .map(([floor, floorRooms]) => (
          <div key={floor} className="space-y-4">
            <h3 className="text-lg font-semibold">
              {floor === '0' ? 'Ground Floor' : `Floor ${floor}`}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {floorRooms.map((room) => (
                <Card 
                  key={room.id}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105 relative overflow-hidden",
                    getStatusColor(room.displayStatus)
                  )}
                  onClick={() => onRoomClick?.(room.id)}
                >
                  <CardContent className="p-3 text-white">
                    {/* Room Number */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{room.room_number}</span>
                      <Bed className="h-4 w-4" />
                    </div>

                    {/* Room Type */}
                    <div className="text-xs opacity-90 mb-2">
                      {room.room_type?.name || 'No Type'}
                    </div>

                    {/* Status Badge */}
                    <Badge 
                      variant="secondary" 
                      className="text-xs mb-2 bg-white/20 text-white border-white/30"
                    >
                      {getStatusText(room.displayStatus)}
                    </Badge>

                    {/* Guest Info */}
                    {room.guest && (
                      <div className="flex items-center gap-1 text-xs">
                        <User className="h-3 w-3" />
                        <span className="truncate">
                          {room.guest.first_name} {room.guest.last_name}
                        </span>
                      </div>
                    )}

                    {/* Upcoming Arrival */}
                    {room.upcomingReservation && !room.activeReservation && (
                      <div className="text-xs opacity-90">
                        Arrival Today
                      </div>
                    )}

                    {/* Notes indicator */}
                    {room.notes && (
                      <div className="absolute top-2 right-2">
                        <Settings className="h-3 w-3 opacity-70" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <Bed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first room.
          </p>
          <Button onClick={onAddRoom}>
            Add Your First Room
          </Button>
        </div>
      )}
    </div>
  );
}