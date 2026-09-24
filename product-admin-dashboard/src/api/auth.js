import apiClient from "./axios";

export const loginUser = async (username, password) => {
  const response = await apiClient.post("/auth/login", {
    username,
    password,
    expiresInMins: 60, // DummyJSON specific option
  });
  return response.data;
};
