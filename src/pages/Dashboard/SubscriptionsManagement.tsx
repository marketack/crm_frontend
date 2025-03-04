import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { toast } from "react-toastify";
import AdminService from "../../api/adminService";

interface Subscription {
  _id: string;
  user: { _id: string; name: string };
  saasTool: { _id: string; name: string };
  status: "active" | "canceled" | "expired";
}

const SubscriptionsManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await AdminService.getAllSubscriptions();
      setSubscriptions(response.data as Subscription[]);
    } catch (err) {
      toast.error("Error fetching subscriptions");
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await AdminService.cancelSubscription(subscriptionId);
      fetchSubscriptions();
      toast.success("Subscription canceled successfully!");
    } catch (err) {
      toast.error("Failed to cancel subscription");
    }
  };

  return (
    <Container>
      <Typography variant="h6">Manage Subscriptions</Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Tool</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub._id}>
                <TableCell>{sub.user.name}</TableCell>
                <TableCell>{sub.saasTool.name}</TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>
                  {sub.status !== "canceled" && (
                    <Button color="error" onClick={() => handleCancelSubscription(sub._id)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SubscriptionsManagement;
