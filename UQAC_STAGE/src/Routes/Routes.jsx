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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Route publique */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<Article />} />
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
          {/* Route protégée */}

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
