// Configuration and Logging handlers
const dotenv = require('dotenv').config();
const morgan = require('morgan');

// HTTP handlers
const createError = require('http-errors');
const http = require('http');
const path = require('path');
const favicon = require('serve-favicon');

// Express framework and additional middleware
const express = require('express');
const expressHandlebars = require('express-handlebars');

isDevelopment = (process.env.MODE === "Development");

// Create and configure the express app
const app = express();

// Express view/template engine setup
app.set('views', path.join(__dirname+"/../", 'views'));
app.engine('handlebars',expressHandlebars( {
    defaultLayout: 'default',
    partialsDir: path.join(app.get('views'), 'partials' ),
    layoutDir: path.join(app.get('views'), 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('view cache', !isDevelopment); // view caching in production

// Express middlewares
app.use("/", express.static("public")); // root directory of static content
app.use('/dist', express.static("dist")); // root directory of distributed CSS, JS libraries


/* Are we in Development or in Production? */
if (isDevelopment) {
    app.use(morgan("dev")); /* log server calls with performance timing with development details */

    /* log call requests with body */
    app.use((request, response, next) => {
        console.log(`Received request for ${request.url} with/without body`);
        if(request.body) console.log(request.body);
        next();
    });
} else {
    app.use(morgan("combined")); /* log server calls per standard combined Apache combined format */
}

const routes = require('./routes/index'); // add the middleware path routing
app.use("/",routes); // add the routes to the express middleware

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
if (isDevelopment) {
    app.use(function(err, req,res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else {
    app.use(function(err,req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        })
    });

}

const httpServer = http.Server(app);
const port = process.env.PORT || 3000;


httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
