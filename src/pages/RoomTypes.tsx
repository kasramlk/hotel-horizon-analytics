import { useState } from "react";
import { PMSLayout } from "@/components/PMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bed, Plus, Edit, Trash2 } from "lucide-react";
import { useRoomTypes } from "@/hooks/usePMSData";

export function RoomTypes() {
  const { data: roomTypes, isLoading } = useRoomTypes();

  return (
    <PMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bed className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Room Types</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room Type
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Room Types</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading room types...</div>
            ) : roomTypes && roomTypes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Base Rate</TableHead>
                    <TableHead>Max Occupancy</TableHead>
                    <TableHead>Amenities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomTypes.map((roomType) => (
                    <TableRow key={roomType.id}>
                      <TableCell className="font-medium">
                        {roomType.name}
                      </TableCell>
                      <TableCell>{roomType.description || '-'}</TableCell>
                      <TableCell>€{roomType.base_rate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {roomType.max_occupancy} guests
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {roomType.amenities ? (
                          <div className="flex flex-wrap gap-1">
                            {roomType.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {roomType.amenities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{roomType.amenities.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No room types found. Create your first room type to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PMSLayout>
  );
}