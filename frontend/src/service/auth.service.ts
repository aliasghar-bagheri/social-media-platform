import { http } from "@/config/axiosHttpConfig";
import {
  EditPasswordType,
  SigninSchemaType,
  SignupSchemaType,
} from "@/lib/validation";

let abortControler: AbortController | null = null;
// *************** Signin
export const signinApi = async (userData: SigninSchemaType) => {
  if (abortControler) {
    abortControler.abort();
  }

  abortControler = new AbortController();
  const response = await http.post("/login", userData, {
    signal: abortControler.signal,
  });

  if (response.status === 200) {
    abortControler = null;
  }

  return response;
};
// *************** Signup
export const signupApi = async (userData: SignupSchemaType) => {
  if (abortControler) {
    abortControler.abort();
  }

  abortControler = new AbortController();

  const response = await http.post("/register", userData, {
    signal: abortControler?.signal,
  });

  if (response.status === 200) {
    abortControler = null;
  }

  return response;
};
// *************** Signout
export const signoutApi = async () => {
  return await http.post("/logout");
};

export const updatePasswordAccountApi = async (passwordData: EditPasswordType) => {
  if (abortControler) {
    abortControler.abort();
  }
  abortControler = new AbortController();

  const response = await http.post("/user/update-password", passwordData, {
    signal: abortControler.signal,
  });

  if (response.status === 200) {
    abortControler = null;
  }

  return response;
};
