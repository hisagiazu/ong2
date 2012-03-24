var app = module.parent.exports
exports.index = function(req, res){
  console.log(req.params.id);
  console.log(req.params.format);
  res.render('about',{number: req.params.id, title:'about'});
}

exports.download = function(req, res){
  var path = require('path')
  var file = path.normalize(__dirname + '/../public/test.csv')
  path.exists(file, function(exists){
    console.log(exists)
  })
  res.sendfile(file)
}
