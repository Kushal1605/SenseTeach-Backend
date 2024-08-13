import {} from "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinaryConfig from "./config/cloudinary.js";

connectDB()
  .then(() => {
    cloudinaryConfig();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
