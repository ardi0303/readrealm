import axios from "axios";
import { useState } from "react";

export const bookFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  async function fetcher(url, genre) {
    try {
      setIsLoading(true);
      const { data: responseData } = await axios({
        method: 'GET',
        baseURL: import.meta.env.VITE_ENDPOINT_BOOKS,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setData(prevData => ({
        ...prevData,
        [genre]: responseData
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  return { isLoading, data, fetcher };
};
