require("dotenv").config();
const cors=require('cors')
const express=require('express');
const cookieParser=require('cookie-parser')
const errorHandler=require('./middlewares/errorHandler')
const connectDB=require('./config/db')
const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes')
const cartRoutes=require('./routes/cartRoutes')
const wishlistRoutes=require('./routes/wishlistRoutes')
const orderRoutes=require('./routes/orderRoutes')
const adminRoutes=require('./routes/adminRoutes')
const app=express();

//connect db
connectDB();

const corsOptions = {
    origin:process.env.CLIENT_URL, // Add frontend URL here,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  };
  console.log("CLIENT_URL from .env:", process.env.CLIENT_URL);

app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/users',userRoutes)
app.use('/api/users',productRoutes)
app.use('/api/users',cartRoutes)
app.use('/api/users',wishlistRoutes)
app.use('/api/users',orderRoutes)
app.use('/api/admin',adminRoutes)

app.use(errorHandler)

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`server running at ${PORT}`))