import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { Delete, Edit, Visibility, ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import cmsService from "../../api/cmsService";
import { toast } from "react-toastify";
import dayjs from "dayjs"; // 📅 Date formatting

// ✅ Define Blog Interface
interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  images?: string[];
  author?: string;
  slug?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
}

// ✅ Props to Control Editing
interface BlogsProps {
  readOnly?: boolean;
}

const Blogs: React.FC<BlogsProps> = ({ readOnly = true }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState<{ title: string; content: string; category: string; tags: string; images: File[] }>({
    title: "",
    content: "",
    category: "",
    tags: "",
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getBlogs();
      setBlogs(response.blogs || []);
    } catch {
      toast.error("❌ Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      formData.append("category", newBlog.category);
      newBlog.tags.split(",").forEach((tag) => formData.append("tags", tag.trim()));
      newBlog.images.forEach((image) => formData.append("images", image));

      await cmsService.addBlogPost(formData, token);
      toast.success("✅ Blog added successfully!");
      fetchBlogs();
      setNewBlog({ title: "", content: "", category: "", tags: "", images: [] });
    } catch {
      toast.error("❌ Failed to add blog");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await cmsService.deleteBlog(id, token);
      toast.success("✅ Blog deleted!");
      fetchBlogs();
    } catch {
      toast.error("❌ Failed to delete blog");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">📝 Latest Blogs</Typography>

      {/* ✅ Blog Creation Form (Only for Admins) */}
      {!readOnly && (
        <>
          <TextField label="Blog Title" fullWidth value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Content" fullWidth multiline rows={4} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Category" fullWidth value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Tags (comma separated)" fullWidth value={newBlog.tags} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} sx={{ mb: 2 }} />

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Images
            <input type="file" hidden multiple onChange={(e) => setNewBlog({ ...newBlog, images: Array.from(e.target.files || []) })} />
          </Button>

          <Button variant="contained" onClick={handleAddBlog} sx={{ mt: 2, ml: 2 }}>
            Add Blog
          </Button>
        </>
      )}

      {/* ✅ Display Blogs */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 2 }} />
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ boxShadow: 3 }}>
                {/* ✅ Display Blog Images with Navigation */}
                {blog.images && blog.images.length > 0 ? (
                  <Box sx={{ position: "relative" }}>
                    <CardMedia component="img" height="140" image={blog.images[imageIndex % blog.images.length]} alt={blog.title} />
                    {blog.images.length > 1 && (
                      <>
                        <IconButton sx={{ position: "absolute", top: "50%", left: 10 }} onClick={() => setImageIndex(imageIndex - 1)}>
                          <ArrowBackIos />
                        </IconButton>
                        <IconButton sx={{ position: "absolute", top: "50%", right: 10 }} onClick={() => setImageIndex(imageIndex + 1)}>
                          <ArrowForwardIos />
                        </IconButton>
                      </>
                    )}
                  </Box>
                ) : (
                  <CardMedia component="img" height="140" image="https://via.placeholder.com/300?text=No+Image" alt="No Image Available" />
                )}

                <CardContent>
                  {/* ✅ Blog Title */}
                  <Typography variant="h6" fontWeight="bold">
                    {blog.title}
                  </Typography>

                  {/* ✅ Blog Category */}
                  {blog.category && (
                    <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                      {blog.category}
                    </Typography>
                  )}

                  {/* ✅ Blog Tags */}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {blog.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" sx={{ fontSize: "12px", backgroundColor: "#e0e0e0" }} />
                    ))}
                  </Stack>

                  {/* ✅ Blog Author & Date */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">{blog.author || "Unknown Author"}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {blog.createdAt ? dayjs(blog.createdAt).format("MMM DD, YYYY") : ""}
                    </Typography>
                  </Box>

                  {/* ✅ Action Buttons */}
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <IconButton color="primary" onClick={() => setSelectedBlog(blog)}>
                      <Visibility />
                    </IconButton>
                    {!readOnly && (
                      <>
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteBlog(blog._id)}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default Blogs;
