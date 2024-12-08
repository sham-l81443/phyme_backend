import cors from "cors";


const allowedOrigins = ["http://localhost:5173","https://quizaalam.netlify.app"];

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
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], 
})
  
export default corsMiddleware;