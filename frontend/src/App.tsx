import { Route, Routes } from "react-router-dom";
import { AuthLayout, RootLayout } from "@/layouts";
import { Signin, Signup } from "@/pages/public";
import {
  CreatePost,
  EditPost,
  EditProfile,
  Explore,
  Home,
  Notifications,
  People,
  PostDetails,
  ProfilePage,
  Saved,
} from "./pages/private";
import ProtectRoutes from "@/pages/ProtectRoutes";
import NotFoundPage from "./pages/public/NotFoundPage";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
      </Route>

      {/* Private Routes */}
      <Route element={<ProtectRoutes />}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/people" element={<People />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/post-details/:id" element={<PostDetails />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Not foun page - 404 */}
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
