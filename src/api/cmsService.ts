import axios from "axios";
import API_BASE_URL from "./apiConfig";

const CMS_API_URL = `${API_BASE_URL}/cms`;

export interface Blog {
  _id: string;
  title: string;
  content: string;
  images?: string[];
  author?: string;
  slug?: string;
  category?: string;
  tags?: string[];
  views?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  price?: number;
  features: string[];
}

const cmsService = {
  /**
   * ✅ Fetch Company Details
   */
  getCompanyDetails: async () => {
    const response = await axios.get(`${CMS_API_URL}/details`);
    return response.data;
  },

  /**
   * ✅ Fetch About Us Information
   */
  getAboutUs: async (): Promise<{ aboutUs: string }> => {
    const response = await axios.get(`${CMS_API_URL}/about-us`);
  
    // ✅ Ensure response is an object and contains `aboutUs`
    if (response.data && typeof response.data === "object" && "aboutUs" in response.data) {
      return response.data as { aboutUs: string };
    }
  
    // ✅ Provide a fallback in case the response is empty
    return { aboutUs: "No content available." };
  },
  

  /**
   * ✅ Fetch Team Members
   */
  getTeam: async () => {
    const response = await axios.get(`${CMS_API_URL}/team`);
    return response.data;
  },

  /**
   * ✅ Fetch Contact Information
   */
  getContactUs: async () => {
    const response = await axios.get(`${CMS_API_URL}/contact-us`);
    return response.data;
  },

  /**
   * ✅ Fetch All Blog Posts
   */
  getBlogs: async (): Promise<{ blogs: Blog[] }> => {
    const response = await axios.get<{ blogs: Blog[] }>(`${CMS_API_URL}/blogs`);
    return { blogs: response.data.blogs ?? [] }; // Ensure blogs is always an array
  },

  /**
   * ✅ Fetch a Single Blog by Slug
   */
  getBlogBySlug: async (slug: string): Promise<{ blog: Blog }> => {
    const response = await axios.get<{ blog: Blog }>(`${CMS_API_URL}/blogs/${slug}`);
    return response.data;
  },

  /**
   * ✅ Fetch Featured Blogs
   */
  getFeaturedBlogs: async (): Promise<{ blogs: Blog[] }> => {
    const response = await axios.get<{ blogs: Blog[] }>(`${CMS_API_URL}/blogs/featured`);
    return { blogs: response.data.blogs ?? [] };
  },

  /**
   * ✅ Add Blog Post (Admin) - Supports FormData for Image Uploads
   */
  addBlogPost: async (blogData: FormData, token: string) => {
    const response = await axios.post(`${CMS_API_URL}/add-blog`, blogData, {
      headers: { Authorization: `Bearer ${token}` }, // FormData handles Content-Type automatically
    });
    return response.data;
  },

  /**
   * ✅ Update an Existing Blog (Admin)
   */
  updateBlogPost: async (blogId: string, updatedData: FormData, token: string) => {
    const response = await axios.put(`${CMS_API_URL}/blogs/${blogId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }, // FormData handles Content-Type automatically
    });
    return response.data;
  },

  /**
   * ✅ Delete a Blog Post (Admin)
   */
  deleteBlog: async (blogId: string, token: string) => {
    const response = await axios.delete(`${CMS_API_URL}/blogs/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * ✅ Increment Blog Views
   */
  incrementBlogViews: async (slug: string) => {
    const response = await axios.put(`${CMS_API_URL}/blogs/${slug}/views`);
    return response.data;
  },

  /**
   * ✅ Add a Comment to a Blog Post
   */
  addComment: async (slug: string, commentData: { user: string; comment: string }, token: string) => {
    const response = await axios.post(`${CMS_API_URL}/blogs/${slug}/comment`, commentData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },
  /**
   * ✅ Fetch All Services
   */
  getServices: async (): Promise<{ services: Service[] }> => {
    const response = await axios.get<{ services: Service[] }>(`${CMS_API_URL}/services`);
    return { services: response.data.services ?? [] };
  },

  /**
   * ✅ Add a New Service (Admin)
   */
  addService: async (serviceData: Service, token: string) => {
    const response = await axios.post(`${CMS_API_URL}/services`, serviceData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * ✅ Update an Existing Service (Admin)
   */
  updateService: async (serviceData: Service, token: string) => {
    const response = await axios.put(`${CMS_API_URL}/services`, serviceData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * ✅ Delete a Service (Admin)
   */
  deleteService: async (serviceId: string, token: string) => {
    const response = await axios.delete(`${CMS_API_URL}/services/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * ✅ Update About Us Section (Admin)
   */
  updateAboutUs: async (aboutUsData: { aboutUs: string }, token: string) => {
    const response = await axios.put(`${CMS_API_URL}/about-us`, aboutUsData, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json"
      },
    });
    return response.data;
  },  
  /**
   * ✅ Update Team Section (Admin)
   */
  updateTeam: async (teamData: { team: { name: string; position: string; image?: string }[] }, token: string) => {
    const response = await axios.put(`${CMS_API_URL}/team`, teamData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * ✅ Update Contact Us Section (Admin)
   */
  updateContactUs: async (contactData: { email: string; phone: string; address: string }, token: string) => {
    const response = await axios.put(`${CMS_API_URL}/contact-us`, contactData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * ✅ Send Newsletter to Subscribed Users (Admin)
   */
  sendNewsletter: async (newsletterData: { subject: string; content: string }, token: string) => {
    const response = await axios.post(`${CMS_API_URL}/send-newsletter`, newsletterData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  },
  sendContactUs: async (contactData: { name: string; email: string; message: string }) => {
    const response = await axios.post(`${CMS_API_URL}/contact-us`, contactData);
    return response.data;
  },
};

export default cmsService;
