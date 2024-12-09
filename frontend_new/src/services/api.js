// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const api = {
  getAllExercises: async (params) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/exercises`, { 
        params: {
          page: params.page,
          limit: params.limit,
          category: params.category,
          difficulty: params.difficulty,
          keyword: params.keyword
        }
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  searchExercises: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/searchExercises`, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  },

  findMostActiveUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/findMostActiveUsers`, {});
      return response.data;
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  },

  analyseMathConcepts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/concepts/analyzeMathConcepts`, {});
      return response.data;
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  },

  getExerciseById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  },

  // 新增的收藏相关方法
  getStarredExercises: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/stars/list`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching starred exercises:', error);
      throw error;
    }
  },

  starExercise: async (exerciseId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/exercises/stars/${exerciseId}`);
      return response.data;
    } catch (error) {
      console.error('Error starring exercise:', error);
      throw error;
    }
  },

  signup: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/signup`, {params});
      return response.data;
    } catch (error) {
      console.error('Error starring exercise:', error);
      throw error;
    }
  },

  login: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/login`, {params});
      return response.data;
    } catch (error) {
      console.error('Error starring exercise:', error);
      throw error;
    }
  },

  unstarExercise: async (exerciseId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/exercises/stars/${exerciseId}`);
      return response.data;
    } catch (error) {
      console.error('Error unstarring exercise:', error);
      throw error;
    }
  },

  // 历史记录相关方法
  getExploreHistory: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/explore-history/list`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching explore history:', error);
      throw error;
    }
  },

  addToExploreHistory: async (params) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/exercises/add-explore-history`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to explore history:', error);
      throw error;
    }
  },

  getNotes: async (params) => {
    try {
      console.log(params)
      const response = await axios.get(`${API_BASE_URL}/notes/get-notes`, { params });
      console.log(response)
      return response.data;
    } catch(error) {
      console.error('Error to getting notes:', error);
      throw error;
    }
  },

  saveNotes: async (params) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/save-notes`, { params });
      console.log(response)
      return response.message;
    } catch(error) {
      console.error('Error to saving notes:', error);
      throw error;
    }
  },

  saveAnswers: async (params) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/save-answers`, { params })
      console.log(response)
      return response
    } catch(error) {
      console.error('Error to saving answers', error);
      throw error;
    }
  },

  // 检查练习是否已收藏
  checkIsStarred: async (exerciseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/stars/check/${exerciseId}`);
      return response.data.isStarred;
    } catch (error) {
      console.error('Error checking star status:', error);
      return false;
    }
  }
};

export default api;