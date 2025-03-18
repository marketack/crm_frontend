import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Field {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "select";
  options?: { label: string; value: string | number }[];
  value: any;
  required?: boolean;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<{ name: string; value: any }>) => void;
  error?: string;
}

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  fields: Field[];
  actions?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "error";
    disabled?: boolean;
  }[];
  steps?: string[];
  activeStep?: number;
  handleNext?: () => void;
  handleBack?: () => void;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  title = "Modal Title",
  fields,
  actions = [],
  steps,
  activeStep,
  handleNext,
  handleBack,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Header */}
      <DialogTitle
        sx={{
          background: "#1a1a2e",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ background: "#121212", color: "#fff", padding: "20px" }}>
        {/* Stepper Navigation (if applicable) */}
        {steps && activeStep !== undefined && (
          <Box sx={{ marginBottom: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Form Fields */}
        {fields.map((field, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            {field.type === "select" ? (
           <TextField
           select
           fullWidth
           label={field.label}
           name={field.name}
           value={field.value}
           onChange={(e) => {
             const target = e.target as unknown as HTMLSelectElement;
             const selectedValues = field.multiple
               ? Array.from(target.selectedOptions, (option) => option.value)
               : target.value;
         
             field.onChange({
               target: { name: field.name, value: selectedValues },
             } as React.ChangeEvent<{ name: string; value: any }>);
           }}
           error={!!field.error}
           helperText={field.error}
           required={field.required}
           SelectProps={{
             multiple: field.multiple,
           }}
         >
           {field.options?.map((option) => (
             <MenuItem key={option.value} value={option.value}>
               {option.label}
             </MenuItem>
           ))}
         </TextField>
         
            ) : (
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={field.value}
                onChange={field.onChange}
                error={!!field.error}
                helperText={field.error}
                required={field.required}
              />
            )}
          </Box>
        ))}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ background: "#1a1a2e", padding: "16px" }}>
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              color={action.color}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))
        ) : (
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModal;