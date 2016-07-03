var PORT = 6667;
var njsc = require('njsc'),
	app = njsc(),
	http = require('http').Server(app)
	captcha = require('captchapng');
	bodyParser = require('body-parser');
module.exports = (function(){
	function inner(){
		this.start = function(whatToDo){
			app.use(njsc.static('public'));
			app.use(bodyParser());
			app.get('/captcha', function(req, res) {
				res.sendFile(__dirname + '/public/index.html');
			});
			var cap;
			function capt(req, res) {
				cap = parseInt(Math.random()*9000 + 1000);
				if(req.url=='/captcha.png') {
					var p = new captcha(80,30, cap); 
					p.color(0, 0, 0, 0); 
					p.color(80, 80, 80, 255); 
 
					var img = p.getBase64();
					var imgbase64 = new Buffer(img,'base64');
					res.writeHead(200, {
						'Content-Type': 'image/png'
					});
					res.end(imgbase64);
			}else
				res.end('');
			
			}
			app.get('/captcha.png', capt);
			
			app.post('/captcha', function(req, res){
				var entry = req.body.src;
				if(entry == cap) {
					res.json({'answer' : 'Сorrect!'});
				   }else{
					res.json({'answer' : 'Wrong!'});
				}
			});
			http.listen(process.env.port || PORT, function(){
			  console.log(PORT);
		  });
		};
	}
	return new inner;
})();