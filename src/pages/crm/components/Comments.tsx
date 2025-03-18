import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../../../api/commentService";
import { AlertColor } from "@mui/material/Alert";

// ✅ Define Props for Comments Component
interface CommentsProps {
  relatedTo: string;
}

interface Comment {
  _id: string;
  message: string;
  createdAt: string;
  relatedTo: string;
}

const Comments: React.FC<CommentsProps> = ({ relatedTo }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<{ id: string; message: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (token) {
      fetchComments();
    }
  }, [relatedTo, token]);

  /** ✅ Fetch Comments */
  const fetchComments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data: Comment[] = await getComments(token, relatedTo);
      setComments(data);
    } catch (error: any) {
      setSnackbar({ open: true, message: "Error fetching comments", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Handle Create Comment */
  const handleCreate = async () => {
    if (!message.trim() || !token) return;
    try {
      await createComment(token, { relatedTo, message });
      setSnackbar({ open: true, message: "Comment added!", severity: "success" });
      setMessage("");
      fetchComments();
    } catch (error: any) {
      setSnackbar({ open: true, message: "Error adding comment", severity: "error" });
    }
  };

  /** ✅ Handle Update Comment */
  const handleUpdate = async () => {
    if (!editing || !editing.message.trim() || !token) return;
    try {
      await updateComment(token, editing.id, editing.message);
      setSnackbar({ open: true, message: "Comment updated!", severity: "info" });
      setEditing(null);
      fetchComments();
    } catch (error: any) {
      setSnackbar({ open: true, message: "Error updating comment", severity: "error" });
    }
  };

  /** ✅ Handle Delete Comment */
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteComment(token, id);
      setSnackbar({ open: true, message: "Comment deleted!", severity: "warning" });
      fetchComments();
    } catch (error: any) {
      setSnackbar({ open: true, message: "Error deleting comment", severity: "error" });
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      {/* ✅ Comment Input */}
      <TextField
        fullWidth
        label="Add a comment..."
        variant="outlined"
        value={editing ? editing.message : message}
        onChange={(e) =>
          editing ? setEditing({ ...editing, message: e.target.value }) : setMessage(e.target.value)
        }
        sx={{ marginBottom: "10px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={editing ? handleUpdate : handleCreate}
        sx={{ marginBottom: "10px" }}
        disabled={!token}
      >
        {editing ? "Update Comment" : "Add Comment"}
      </Button>

      {/* ✅ Comments List */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <List>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <ListItem key={comment._id} divider>
                <ListItemText primary={comment.message} secondary={`Created at: ${new Date(comment.createdAt).toLocaleString()}`} />
                <IconButton color="primary" onClick={() => setEditing({ id: comment._id, message: comment.message })}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(comment._id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", marginTop: "10px" }}>
              No comments yet.
            </Typography>
          )}
        </List>
      )}

      {/* ✅ Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Comments;
