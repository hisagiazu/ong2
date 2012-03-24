
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser({
    uploadDir: './uploaded_files'
  }));
  app.use(express.cookieParser('secret', 'hogehoge'));
  app.use(express.session({key: 'session_id'}));
  app.use(express.methodOverride());
  app.use(function(req, res, next){
    console.log('my own midleware');
    next();
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var about_handler = require('./routes/about.js');
//app.get('/about/:id?.:format?', about_handler.index);
//console.log(app.lookup.all('/about/:id?.:format?'));

var fs = require('fs')
  , path = require('path')
  , routes_dir = path.resolve(__dirname + '/routes')
var map_routes = function(dir) {
  var files = fs.readdirSync(dir)
  files.forEach(function(e){
    e = dir + '/' + e
    var stats = fs.statSync(e)
    if(stats.isDirectory()){
      map_routes(e)
    }
    else{
      var url_path = '/'
      if(path.basename(e, '.js') == 'index'){
        url_path += path.dirname(path.relative(routes_dir, e))
      }
      else{
        url_path += path.relative(routes_dir, e).replace('.js', '')
      }
      url_path = path.normalize(url_path)
      var handler = require(e)
      for(var f in handler){
        switch(f){
          case 'index':
            app.get(url_path + '?', handler[f])
            break;
          case 'new':
            app.get(url_path + '/new', handler[f])
            break;
          case 'create':
            app.post(url_path, handler[f])
            break;
          case 'edit':
            app.get(url_path + '/:id/edit', handler[f])
            break;
          case 'update':
            app.put(url_path + '/:id', handler[f])
            break;
          case 'destroy':
            app.del(url_path + '/:id', handler[f])
            break;
          case 'show':
            app.get(url_path + '/:id.:format?', handler[f])
            break;
          default:
            app.get(url_path + '/' + f, handler[f])
        }
      }
    }
  })
}
map_routes(routes_dir)

app.locals.use(function(req, res){
  app.locals.message = req.session.message || ''
});

//app.get('/download', about_handler.download);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
