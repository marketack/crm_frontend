import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Card, CardContent, CardMedia, Alert
} from "@mui/material";
import { PlayCircleOutline, Add, ArrowBack } from "@mui/icons-material";
import { useAppSelector } from "../../redux/store";
import CourseService, { Course, Lesson } from "../../api/courseService";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const isAdminOrInstructor = user?.role?.includes("admin") || user?.role?.includes("instructor");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const courseData = await CourseService.getCourseById(courseId!);
  
      // Ensure `lessons` is always an array
      setCourse({ ...courseData, lessons: courseData.lessons ?? [] });
  
      // Safely check lessons length before setting selectedLesson
      if (courseData.lessons && courseData.lessons.length > 0) {
        setSelectedLesson(courseData.lessons[0]);
      }
    } catch (error) {
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleEnroll = async () => {
    try {
      await CourseService.enrollCourse(courseId!);
      toast.success("Enrolled successfully!");
      setIsEnrolled(true); // ✅ Prevent unnecessary re-fetching
    } catch (error) {
      toast.error("Failed to enroll.");
    }
  };

  return (
    <Box sx={{ mt: 5, px: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : course ? (
        <>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="250"
              image={course.imageUrl || "/default-course.jpg"}
              alt={course.title}
            />
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{course.title}</Typography>
              <Typography variant="body1" color="text.secondary">{course.description}</Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ${course.price}
              </Typography>

              {user && !isEnrolled && (
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleEnroll}>
                  Enroll Now
                </Button>
              )}
              {isEnrolled && (
                <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                  ✅ You are enrolled in this course.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Lessons
          </Typography>

          {isAdminOrInstructor && (
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }}>
              Add Lesson
            </Button>
          )}

          {course.lessons && course.lessons.length > 0 ? (
            <List>
              {course.lessons.map((lesson, index) => (
                <ListItem key={index} component="div" onClick={() => setSelectedLesson(lesson)} sx={{ cursor: "pointer" }}>
                  <PlayCircleOutline sx={{ mr: 2 }} />
                  <ListItemText primary={lesson.title} secondary={`${lesson.duration ?? 0} mins`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No lessons available.</Typography>
          )}

          {selectedLesson && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight="bold">{selectedLesson.title}</Typography>
              <Typography>{selectedLesson.content}</Typography>
              {selectedLesson.videoUrl && (
                <iframe
                  width="100%"
                  height="400"
                  src={selectedLesson.videoUrl}
                  title="Lesson Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" color="error">Course not found.</Typography>
      )}
    </Box>
  );
};

export default CourseDetail;
