const path = require("path");
const express  = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db= require("./data/database");
const addCsrfTokenMiddleware = require('./middelwares/csrf-token');
const errorHandlerMiddleware = require('./middelwares/error-handler');
const checkAuthStatusMiddleware = require('./middelwares/check-auth');
const protectRoutesMiddleware = require('./middelwares/protect-routes');
const cartMiddleware = require('./middelwares/cart');
const updateCartPricesMiddleware = require('./middelwares/update-cart-prices');
const notFoundMiddleware = require('./middelwares/not-found');


const authRoutes = require("./routes/auth.routes");
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');


const app = express();

app.set("view engine", "ejs"); // to tell the server that we want to use ejs for rendering our views
app.set("views",path.join(__dirname, "views")); //it tells the server where to find the views

app.use(express.static("public"));
app.use("/products/assets",express.static("product-data"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const sessionConfig =createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);


app.use(baseRoutes);
app.use(authRoutes); //this makes surre that our authRoutes middelware is triggered for every incoming request
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use("/orders",protectRoutesMiddleware,ordersRoutes);
app.use('/admin', protectRoutesMiddleware,adminRoutes);

app.use(notFoundMiddleware);


app.use(errorHandlerMiddleware);


db.connectToDatabase()
.then(function(){
    app.listen(3000);
})
.catch(function(error){
    console.log("failed to connect to database! ");
    console.log(error);
});

