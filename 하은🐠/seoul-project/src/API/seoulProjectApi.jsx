import axios from "axios";

const seoulProjectApi = () => {
  const API_KEY = "466664466e796865363241506d6f55";
  const baseURL = "http://openapi.seoul.go.kr:8088";

  async function getSeoulList(start, term) {
    const end = start + 100;
    let requestURL = `${baseURL}/${API_KEY}/json/culturalEventInfo/${start}/${end}/`;
    if (term) {
      requestURL += ` /${term}`;
    }
    try {
      const response = await axios.get(requestURL);
      if (response.data && response.data.culturalEventInfo) {
        return response.data.culturalEventInfo;
      } else {
        return [];
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
