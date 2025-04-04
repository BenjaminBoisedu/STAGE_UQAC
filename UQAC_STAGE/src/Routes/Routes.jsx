import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import LoadingSpinner from "../Components/Loading/LoadingSpinner";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Lazy loading des composants avec délai
const Home = lazy(() => delay(1000).then(() => import("../Pages/Home/Home")));
const Login = lazy(() =>
  delay(1000).then(() => import("../Pages/Login/Login"))
);
const Signup = lazy(() =>
  delay(1000).then(() => import("../Pages/Signup/Signup"))
);
const NotFound = lazy(() =>
  delay(1000).then(() => import("../Pages/NotFound/NotFound"))
);
const Profile = lazy(() =>
  delay(1000).then(() => import("../Pages/Profile/Profile"))
);
const Articles = lazy(() =>
  delay(1000).then(() => import("../Pages/Articles/Articles"))
);
const Article = lazy(() =>
  delay(1000).then(() => import("../Pages/Article/Article"))
);

const Logout = lazy(() =>
  delay(1000).then(() => import("../Pages/Logout/Logout"))
);

const Categories = lazy(() =>
  delay(1000).then(() => import("../Pages/Catégories/Catégories"))
);

const Category = lazy(() =>
  delay(1000).then(() => import("../Pages/Catégorie/Catégorie"))
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Route publique */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<Article />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<Category />} />

          {/* Route publique */}

          {/* Route protégée */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />
          {/* Route protégée */}

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
