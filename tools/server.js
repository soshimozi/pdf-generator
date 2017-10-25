const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');
const logger = require('morgan');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/dist')));

app.post('/pdf', function(request,response) {
    
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/pdf');
    response.setHeader('Access-Control-Allow-Origin', '*');
    
    // Header to force download
    var filename = request.body.title;
    if(path.extname(filename) === '')
        filename = path.join(filename, '.pdf');

    response.setHeader('Content-disposition', 'attachment; filename='+filename);
    

    pdf.create(request.body.text).toBuffer(function(err, buffer) {
        response.write(buffer);
        response.end();
    });
});      

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if(app.get('env') === 'development') {

    
    app.use(function(err, req, res, next) {
        
        res.status(err.status || 500);

        if(err.status === 404) {
            res.render('not-found', {
                message: err.message,
                error: {}
            });
        } else {    
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if(err.status === 404) {
        res.render('not-found', {
            message: err.message,
            error: {}
        });
    } else {
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  });
