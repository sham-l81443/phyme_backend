import cors from "cors";


const allowedOrigins = ["https://phymelearning.com"];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Custom-Header",
    "Range"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
})

export default corsMiddleware;