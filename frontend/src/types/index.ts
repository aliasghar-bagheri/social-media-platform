import {
  EditPasswordType,
  SigninSchemaType,
  SignupSchemaType,
} from "@/lib/validation";

export type T_NavLink = {
  href: string;
  icon: string;
  label: string;
};

export type T_AuthContext = {
  user: T_User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  updatePassword: (passwordData: EditPasswordType) => Promise<void>;
  signin: (credentials: SigninSchemaType) => Promise<void>;
  signup: (credentials: SignupSchemaType) => Promise<void>;
  signout: () => Promise<void>;
};

export type T_User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profile?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
};

export interface I_EditUser {
  profile?: string | File;
  name: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
}

export type T_Post = {
  id: string;
  user_id: string;
  caption?: string;
  image_url: string;
  location?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

export type T_NewPost = {
  caption?: string;
  image_url: string;
  location?: string;
  tags?: string;
};

export type PostImage = {
  id: string;
  post_id: string;
  url: string[];
};

export type T_NotificationType = "like" | "comment" | "follow";

export type T_Notification = {
  id: string;
  type: T_NotificationType;
};

export type T_Comment = {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  modified_at?: string;
};

export type T_People = {
  id: string;
  user_id: string;
  name: string;
  isFollowed: boolean;
};
