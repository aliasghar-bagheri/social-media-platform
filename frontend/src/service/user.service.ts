import { http } from "@/config/axiosHttpConfig";

// *************** Get current user
export const getCurrentUserApi = async () => {
  return await http.get("/user/profile");
};
