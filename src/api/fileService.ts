import apiClient from "./apiClient";

// ✅ Define File Type
export interface UploadedFile {
  _id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

/** ✅ Upload a File */
export const uploadFile = async (file: File): Promise<{ message: string; file: UploadedFile }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{ message: string; file: UploadedFile }>("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/** ✅ Get All Files */
export const getFiles = async (): Promise<UploadedFile[]> => {
  try {
    const response = await apiClient.get<UploadedFile[]>("/files");
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
};

/** ✅ Delete a File */
export const deleteFile = async (fileId: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
