import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/courses`;

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdBy: { name: string; email: string };
  status: "approved" | "pending" | "rejected";
  videoUrl?: string;
  imageUrl?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  _id?: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: number;
}

export interface Notification {
  _id: string;
  user?: string;
  message: string;
  type: "course_review" | "course_enrollment" | "lesson_added";
  createdAt: string;
}

const CourseService = {
  /**
   * 🎓 Get All Courses
   */
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get<Course[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  /**
   * 📖 Get Course by ID (With Lessons)
   */
  getCourseById: async (courseId: string): Promise<Course> => {
    try {
      const response = await axios.get<Course>(`${API_URL}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Create a Course (With Video Upload Progress)
   */
  createCourse: async (formData: FormData, onUploadProgress?: (progress: number) => void): Promise<Course> => {
    try {
      const response = await axios.post<Course>(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...(onUploadProgress && {
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onUploadProgress(progress);
            }
          },
        }) as any, // Casting to any to avoid TypeScript errors
      });

      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  /**
   * ✏️ Update Course (With Progress)
   */
  updateCourse: async (courseId: string, formData: FormData, onUploadProgress?: (progress: number) => void): Promise<Course> => {
    try {
      const response = await axios.put<Course>(`${API_URL}/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...(onUploadProgress && {
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onUploadProgress(progress);
            }
          },
        }) as any, // Casting to any to avoid TypeScript errors
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * ❌ Delete Course
   */
  deleteCourse: async (courseId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${courseId}`);
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 🎓 Enroll in a Course
   */
  enrollCourse: async (courseId: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/enroll`, { courseId });
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 🚪 Unenroll from a Course
   */
  unenrollCourse: async (courseId: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/unenroll`, { courseId });
    } catch (error) {
      console.error(`Error unenrolling from course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 🔍 Check if User is Enrolled in a Course
   */
  checkEnrollment: async (courseId: string): Promise<{ enrolled: boolean }> => {
    try {
      const response = await axios.get<{ enrolled: boolean }>(`${API_URL}/${courseId}/check-enrollment`);
      return response.data;
    } catch (error) {
      console.error(`Error checking enrollment for course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 📋 Get All Courses That Are Pending Approval (Admin Only)
   */
  getPendingCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get<Course[]>(`${API_URL}/pending`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending courses:", error);
      throw error;
    }
  },

  /**
   * ✅ Approve or Reject a Course (Admin Only)
   */
  reviewCourse: async (courseId: string, status: "approved" | "rejected"): Promise<void> => {
    try {
      await axios.put(`${API_URL}/review/${courseId}`, { status });
    } catch (error) {
      console.error(`Error reviewing course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 📚 Get All Courses the User is Enrolled In
   */
  getUserEnrolledCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get<Course[]>(`${API_URL}/enrolled`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user enrolled courses:", error);
      throw error;
    }
  },

  /**
   * 📝 Add a Lesson to a Course (Instructors/Admins Only)
   */
  addLesson: async (courseId: string, lessonData: Lesson): Promise<Lesson> => {
    try {
      const response = await axios.post<Lesson>(`${API_URL}/${courseId}/lessons`, lessonData);
      return response.data;
    } catch (error) {
      console.error(`Error adding lesson to course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 📖 Get All Lessons for a Course
   */
  getLessons: async (courseId: string): Promise<Lesson[]> => {
    try {
      const response = await axios.get<Lesson[]>(`${API_URL}/${courseId}/lessons`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * 🔔 Get Notifications for User
   */
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await axios.get<Notification[]>(`${API_BASE_URL}/notifications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  /**
   * ✅ Mark Notification as Read
   */
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },
};

export default CourseService;
