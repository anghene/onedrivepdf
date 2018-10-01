const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request= require('request')
const https = require('https')

var app=express()
var router = express.Router()
const appid="67a4c393-c8c3-4a84-b855-282a1d7da22e"
const apppwd="cfshUUMUQI9303^);@qgbQ7"
const applink="https://anghene.com/fetch"
var clientcode=""
var token = ""

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

var r1 = express.Router();
 r1.get('/', (req, res, next) => {res.render('upload')})

app.use(r1)
app.post('/', (req,res) => doThis(req, res))
app.get('/fetch', (req,res) => {
	app.clientcode=req.query.code;
	res.redirect('/');
})

function getAcceptance(res){
	res.redirect('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id='+ appid + '&scope=user.read&redirect_uri=' + applink + "&response_type=code");
}

function getToken(req,res){
	//PUT /me/drive/root:/FolderA/FileB.txt:/content
	// Content-Type: text/plain
	if (empty(app.clientcode))
	{getAcceptance(res);}
	else
	request(token_request, function optionalCallback(err, httpResponse, body) {
		if (err) {
		return console.error('upload failed:', err);
		}
		console.log('Server responded with:', httpResponse.statusCode, httpResponse.statusMessage, body);
		// app.token = body.authorization-token;
		app.render('response',{resp: body})
	})
	.on('error', function(err) {
		console.log(err)
	})

	request.end;
}

const options = {
	'port': 443,
	'uri':'https://login.microsoftonline.com/common/oauth2/v2.0/token',
	'method': 'POST',
	'headers': {
		'User-Agent': 'request',
		'Content-Type' : 'application/x-www-form-urlencoded'
		},
	'form' : {
		'client_id':appid,
		'scope':'user.read'
	}
};

const token_request = {
	'uri': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
	'method': 'POST',
	'json':true,
	'headers': {
		'User-Agent': 'request',
		'Content-Type' : 'application/json'
	},
	'form' : {
		'client_id':appid,
		'client_secret':apppwd,
		'code' : app.clientcode,
		'redirect_uri': applink,
		'grant_type':'authorization_code',
		'scope':'user.read',
	}
}

function doThis(req,res){
//PUT /me/drive/root:/FolderA/FileB.txt:/content
// Content-Type: text/plain
	getToken(req,res);
	request.post(options3, function optionalCallback(err, httpResponse, body) {
		if (err) {
		return console.error('upload failed:', err);
		}
		console.log('Server responded with:', httpResponse.statusCode, httpResponse.statusMessage, body);
		app.render('response',{resp: body})
	})
	.on('error', function(err) {
		console.log(err)
	})

	request.end;
}
var form = {
	'client_id':appid,
	// &scope:user.read%20mail.read
	// &code:OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
	// &redirect_uri:http%3A%2F%2Flocalhost%2Fmyapp%2F
	'grant_type':'authorization_code',
	'client_secret':apppwd    // NOTE: Only required for web apps
};




const options3 = {
	'uri': 'https://graph.microsoft.com/v1.0/me',
	'method': "GET",
	'headers' : {
		'Authorization' : 'Bearer 	' + token,
		'Content-Type' : 'application/json'
	}
}
// options.agent = new https.Agent(options);

// const req = https.request(options, (res) => {
// console.log('statusCode:', res.statusCode);
// console.log('headers:', res.headers);
// res.on('data', (d) => {
// 	process.stdout.write(d);
// });
// });
// req.write(JSON.stringify(form));

// req.on('error', (e) => {
// console.error(e);
// });
