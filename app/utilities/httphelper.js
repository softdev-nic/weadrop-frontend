import API from "./API";

export const getRequest = async (url) => {
  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const postRequest = async (url, data) => {
  try {
    const response = await API.post(url, data);
    console.log({response})
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error.message);
    throw error;
  }
};

export const putRequest = async (url, data) => {
  try {
    const response = await API.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};

export const deleteRequest = async (url) => {
  try {
    const response = await API.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};      

