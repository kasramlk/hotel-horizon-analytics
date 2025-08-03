import { useState } from "react";
import { PMSLayout } from "@/components/PMSLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus } from "lucide-react";
import { HotelSelector } from "@/components/HotelSelector";

export function Payments() {
  const [selectedHotel, setSelectedHotel] = useState<string>('');

  // Mock data for now - would use real hooks
  const payments = [
    {
      id: '1',
      confirmation_number: 'CNF20240001',
      guest_name: 'John Doe',
      amount: 150.00,
      currency: 'EUR',
      payment_method: 'Credit Card',
      status: 'completed',
      payment_date: '2024-01-15'
    },
    {
      id: '2',
      confirmation_number: 'CNF20240002',
      guest_name: 'Jane Smith',
      amount: 200.00,
      currency: 'EUR',
      payment_method: 'Cash',
      status: 'pending',
      payment_date: '2024-01-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <PMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Payment Management</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>

        <HotelSelector 
          value={selectedHotel} 
          onValueChange={setSelectedHotel} 
        />

        {selectedHotel && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Today's Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€350.00</div>
                  <p className="text-xs text-muted-foreground">2 transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€200.00</div>
                  <p className="text-xs text-muted-foreground">1 transaction</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€5,250.00</div>
                  <p className="text-xs text-muted-foreground">25 transactions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Confirmation</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.confirmation_number}
                        </TableCell>
                        <TableCell>{payment.guest_name}</TableCell>
                        <TableCell>
                          {payment.currency} {payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.payment_date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
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