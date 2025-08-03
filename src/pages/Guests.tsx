import { useState } from "react";
import { Plus } from "lucide-react";
import { PMSLayout } from "@/components/PMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGuests } from "@/hooks/usePMSData";
import { HotelSelector } from "@/components/HotelSelector";

export function Guests() {
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const { data: guests, isLoading } = useGuests(selectedHotel);

  return (
    <PMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Guest Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>

        <HotelSelector 
          value={selectedHotel} 
          onValueChange={setSelectedHotel} 
        />

        {selectedHotel && (
          <Card>
            <CardHeader>
              <CardTitle>Guests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading guests...</div>
              ) : guests && guests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>VIP</TableHead>
                      <TableHead>Nationality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          {guest.first_name} {guest.last_name}
                        </TableCell>
                        <TableCell>{guest.email || '-'}</TableCell>
                        <TableCell>{guest.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {guest.guest_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {guest.vip && <Badge>VIP</Badge>}
                        </TableCell>
                        <TableCell>{guest.nationality || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No guests found. Add your first guest to get started.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PMSLayout>
  );
}