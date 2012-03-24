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

