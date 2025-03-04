import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Button, Chip, CardMedia, CircularProgress, Box,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, LinearProgress, IconButton, useTheme
} from "@mui/material";
import { Add, Edit, Delete, Upload, VideoLibrary } from "@mui/icons-material";
import { useAppSelector } from "../../redux/store";
import CourseService, { Course } from "../../api/courseService";

const Courses = () => {
  const theme = useTheme(); // Detect dark mode
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    videoFile: null as File | null,
  });
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAdminOrInstructor = user?.roles?.includes("admin") || user?.roles?.includes("instructor");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await CourseService.getAllCourses();
      setCourses(response);
    } catch (error) {
      setAlert({ message: "Failed to load courses.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await CourseService.deleteCourse(courseId);
        setAlert({ message: "Course deleted successfully!", severity: "success" });
        fetchCourses();
      } catch (error) {
        setAlert({ message: "Failed to delete course.", severity: "error" });
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, videoFile: event.target.files[0] });
    }
  };

  const handleAddCourse = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.videoFile) {
      setAlert({ message: "All fields and a video are required.", severity: "error" });
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("price", formData.price);
      uploadFormData.append("video", formData.videoFile);

      setUploadProgress(0);

      await CourseService.createCourse(uploadFormData, (progress: number) => {
        setUploadProgress(progress);
      });

      setOpenDialog(false);
      setAlert({ message: "Course added successfully!", severity: "success" });
      fetchCourses();
    } catch (error) {
      setAlert({ message: "Failed to add course.", severity: "error" });
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <Box sx={{ mt: 5, px: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Explore Courses
      </Typography>

      {isAdminOrInstructor && (
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
          Add Course
        </Button>
      )}

      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No courses available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 4 },
                  borderRadius: 2,
                }}
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <CardMedia
                  component="video"
                  height="180"
                  controls
                  src={course.videoUrl || "/default-video.mp4"}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description.substring(0, 60)}...
                  </Typography>
                  <Chip label={`$${course.price}`} color="primary" sx={{ mb: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 🆕 Add Course Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField label="Course Title" fullWidth margin="normal" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <TextField label="Description" fullWidth multiline rows={3} margin="normal" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <TextField label="Price" type="number" fullWidth margin="normal" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          
          {/* Video Upload Area - Dark Mode Fix */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              border: "2px dashed",
              borderColor: theme.palette.mode === "dark" ? "#ddd" : "#1976d2",
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f9f9f9",
            }}
          >
            <Button variant="contained" component="label" startIcon={<Upload />}>
              Upload Video
              <input type="file" hidden accept="video/*" onChange={handleFileChange} />
            </Button>
            {formData.videoFile && (
              <video
                src={URL.createObjectURL(formData.videoFile)}
                controls
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.mode === "dark" ? "#222" : "#fff",
                }}
              />
            )}
          </Box>

          {uploadProgress !== null && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCourse} variant="contained">
            Add Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;
