import { useState } from "react";
import { PMSLayout } from "@/components/PMSLayout";
import { RoomGrid } from "@/components/RoomGrid";
import { useHotels } from "@/hooks/useHotelData";
import { HotelSelector } from "@/components/HotelSelector";

export function Rooms() {
  const { data: hotels = [] } = useHotels();
  const [selectedHotel, setSelectedHotel] = useState<string>("");

  const handleRoomClick = (roomId: string) => {
    console.log("Room clicked:", roomId);
    // TODO: Open room details modal
  };

  const handleAddRoom = () => {
    console.log("Add room clicked");
    // TODO: Open add room modal
  };

  return (
    <PMSLayout>
      <div className="space-y-6">
        {/* Hotel Selector */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Room Management</h1>
          <HotelSelector
            value={selectedHotel}
            onValueChange={setSelectedHotel}
          />
        </div>

        {selectedHotel && (
          <RoomGrid
            hotelId={selectedHotel}
            onRoomClick={handleRoomClick}
            onAddRoom={handleAddRoom}
          />
        )}

        {!selectedHotel && hotels.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Select a Hotel</h3>
            <p className="text-muted-foreground">
              Choose a hotel from the dropdown above to view and manage rooms.
            </p>
          </div>
        )}
      </div>
    </PMSLayout>
  );
}