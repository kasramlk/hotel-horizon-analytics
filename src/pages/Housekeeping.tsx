import { useState } from "react";
import { PMSLayout } from "@/components/PMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus } from "lucide-react";
import { HotelSelector } from "@/components/HotelSelector";

export function Housekeeping() {
  const [selectedHotel, setSelectedHotel] = useState<string>('');

  // Mock data for now - would use real hooks
  const housekeepingTasks = [
    {
      id: '1',
      room_number: '101',
      status: 'dirty',
      assigned_to: 'Maria',
      task_date: '2024-01-15',
      notes: 'Checkout cleaning required'
    },
    {
      id: '2',
      room_number: '102',
      status: 'clean',
      assigned_to: 'John',
      task_date: '2024-01-15',
      notes: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'default';
      case 'dirty': return 'destructive';
      case 'maintenance': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <PMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Housekeeping</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <HotelSelector 
          value={selectedHotel} 
          onValueChange={setSelectedHotel} 
        />

        {selectedHotel && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {housekeepingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.room_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.assigned_to}</TableCell>
                        <TableCell>{task.task_date}</TableCell>
                        <TableCell>{task.notes || '-'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PMSLayout>
  );
}