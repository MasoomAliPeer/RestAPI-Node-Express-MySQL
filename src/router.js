import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import assessmentRoute from "./routes/assessmentRoute";

const router = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/assessment", assessmentRoute);
};

export default router;
