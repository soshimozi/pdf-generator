const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');
const logger = require('morgan');


let port = process.env.NODE_PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../www')));

app.post('/api/pdf', function(request,response) {
    
    console.log(request.body);

    pdf.create(request.body.data).toBuffer(function(err, buffer) {

        if(err) {
            console.log("error:",err);
            response.statusCode = 500;
            response.write("Could not create pdf.");
            return response.end();
        }

        if(request.body.method === 'download') {

            // Header to force download
            var filename = request.body.title;
            if(path.extname(filename) === '')
                filename = filename + '.pdf';

            console.log('downloading file: ', filename)

            
            response.statusCode = 200;
            response.setHeader('Content-type', 'application/pdf');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Content-disposition', 'attachment; filename='+filename);
            response.setHeader('X-filename', filename);
            response.write(buffer);
            response.end();
        }
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

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!')
  });
