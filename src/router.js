//* Import the customers.routes file with all de methods
import customerRoutes from "./routes/customers.routes";
import userRoutes from "./routes/user.routes";

//* Here I defined the first endpoint
const router = (app) => {
  // app.use("/customers", customerRoutes);
  app.use("/", userRoutes);
};

export default router;
