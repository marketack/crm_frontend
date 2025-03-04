import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface FeatureCardProps {
  title: string;
  description: string;
  onClick?: () => void; // ✅ Added onClick prop
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, onClick }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography color="textSecondary">{description}</Typography>
        {onClick && ( // ✅ Conditionally render button
          <Button variant="contained" sx={{ mt: 2 }} onClick={onClick}>
            Explore
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
