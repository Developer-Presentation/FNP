import axios from "axios";

const seoulProjectApi = () => {
  const API_KEY = "466664466e796865363241506d6f55";
  const baseURL = "http://openapi.seoul.go.kr:8088";

  async function getSeoulList(start) {
    const end = start + 30;
    const requestURL = `${baseURL}/${API_KEY}/json/culturalEventInfo/${start}/${end}/`;

    try {
      const response = await axios.get(requestURL);
      // Check if response.data and response.data.culturalEventInfo are defined
      if (response.data && response.data.culturalEventInfo) {
        return response.data.culturalEventInfo;
      } else {
        return []; // Return an empty array if the data is not as expected
      }
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  }

  return {
    getSeoulList,
  };
};

export default seoulProjectApi;
