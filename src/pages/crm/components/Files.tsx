import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CloudUpload, Delete, Download } from "@mui/icons-material";
import { getFiles, uploadFile, deleteFile, UploadedFile } from "../../../api/fileService";

const Files: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles();
        setFiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };
    fetchFiles();
  }, []);

  // ✅ Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setOpenDialog(true);
    }
  };

  // ✅ Handle File Upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadFile(selectedFile);
      setSnackbar({ open: true, message: response.message, severity: "success" });
      setFiles([...files, response.file]);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to upload file", severity: "error" });
    }
    setOpenDialog(false);
  };

  // ✅ Handle Delete File
  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles(files.filter((file) => file._id !== fileId));
      setSnackbar({ open: true, message: "File deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete file", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef<UploadedFile>[] = [
    { field: "name", headerName: "File Name", flex: 1 },
    {
      field: "size",
      headerName: "Size (KB)",
      flex: 1,
      valueGetter: (params: { row: UploadedFile }) => ((params.row.size || 0) / 1024).toFixed(2), // ✅ Explicitly defining row type
    },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "uploadedAt", headerName: "Uploaded At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: { row: UploadedFile }) => ( // ✅ Explicitly defining row type
        <>
          <IconButton color="primary" href={params.row.url} target="_blank">
            <Download />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        File Management
      </Typography>

      <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ marginBottom: 2 }}>
        Upload File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <DataGrid 
  rows={files} 
  columns={columns} 
  pageSizeOptions={[5, 10, 20]} 
  autoHeight 
  getRowId={(row: UploadedFile) => row._id} // ✅ Explicitly define row type
/>

      {/* ✅ Dialog for Confirming File Upload */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to upload "{selectedFile?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Files;
