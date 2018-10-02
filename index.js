const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request= require('request')
const https = require('https')
const multer  = require('multer')
const upload = multer({ dest: (path.join(__dirname, 'tmp')) })
require('request-debug')(request)

var app=express()
var router = express.Router()

state={
	applicationConfig : {
    		clientID: "2a56f63b-2904-4a09-9e02-9cf88138cffe",
   		graphScopes: ["user.read"],
    		graphEndpoint: "https://graph.microsoft.com/beta/me"
	},
	auth: {
		token: null,
		clientcode: null,
		appid:"67a4c393-c8c3-4a84-b855-282a1d7da22e",
		apppwd:"cfshUUMUQI9303^);@qgbQ7",
		applink:"https://anghene.com/token"
	}
}
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/', (req, res) => {res.render('upload')});
app.get('/echo', (req,res) =>{console.log("Echoed: ", req)});
app.get('/gettoken', (req,res) => {
	getToken(req,res)
	});
app.get('/getuser', (req,res) => getUserInfo(req,res));
app.get('/token', (req,res) => {
	state.applicationConfig.clientID=req.query.code;
	res.redirect('/gettoken?code='+ req.query.code);
});

app.get('/upload', (req,res) => res.render('upload'));
app.post('/upload', upload.single('image'), (req,res) => uploadToDrive(req,res));

function getAcceptance(res){
	res.redirect('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id='+ state.auth.appid + '&scope=user.read Files.ReadWrite.All offline_access&redirect_uri=' + state.auth.applink + "&response_type=code");
}

function buildTokenRequest (code) {
return	{
	'port': 443,
	'uri':'https://login.microsoftonline.com/common/oauth2/v2.0/token',
	'method': 'POST',
	'headers':{
		'User-Agent':'request',
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	'form':{
		'client_id':state.auth.appid,
		'client_secret':state.auth.apppwd,
		'code':code,
		'redirect_uri':state.auth.applink,
		'grant_type':'authorization_code',
		'scope':'user.read Files.ReadWrite Files.ReadWrite.All',
	}
}}

function getUserOptions(tkn) {
	return {'uri':this.state.applicationConfig.graphEndpoint,
	'headers':{
		'Authorization':'Bearer '+tkn,
		'User-Agent':'request',
		'Content-Type': 'application/json'
	}}
}

function getUserInfo(req,res){
	if (((req.query.code)||state.applicationConfig.clientID)
	    &&   (req.query.code == state.applicationConfig.clientID))
	{
	request(getUserOptions(state.auth.token), (err,httpResponse,body) => {
		if (err){return console.error('err:', err)}
		let response = JSON.parse(body);
		console.log("my info: \n", response);
		res.render('response', {resp: response});
		});
	}
	else getAcceptance(res);
}

function getToken(req,res){
	//PUT /me/drive/root:/FolderA/FileB.txt:/content
	// Content-Type: text/plain
	if (((req.query.code)||state.applicationConfig.clientID)
	    &&   (req.query.code == state.applicationConfig.clientID))
	{
		self=this;
		console.log("now having to get token with code: ", self.state.applicationConfig.clientID);
		request(buildTokenRequest(self.state.applicationConfig.clientID), 
			(err, httpResponse, body) => {
			if (err) {
			return console.error('upload failed:', err);
			}
			let response = JSON.parse(body);
			if ((httpResponse == 400)&&(response.error=='invalid_grant'))
				console.log("what ?! : ", this.state.applicationConfig.clientID);
				this.state.applicationConfig.clientID = null;
			state.auth.token=response.access_token;
			res.redirect('/');
		})
		.on('error', function(err) {
			console.log(err)
		})
	
		request.end;
	}
	else getAcceptance(res) // needs res to redirect
}
function uploadToDrive(req,res){
	// make sure we still have a token
	if ((!state.auth.token)||(state.applicationConfig.clientID))
		res.redirect('/gettoken?code='+state.applicationConfig.clientID);
	else if (!state.auth.token) res.redirect('/gettoken');
	tkn=state.auth.token;
	// load the uploaded image as binary data
	uploadedFile = req.file;
	// build our request to OneDrive
	buildReq = {
		'port':443,
		'uri':this.state.applicationConfig.graphEndpoint + '/drive/root:/'+ uploadedFile.originalname  +':/content',
		'headers':{
		'Authorization':'Bearer '+tkn,
		},
		'form':uploadedFile.buffer 
	}
	request.put(buildReq, (err,httpResponse,body) => {
		if (err){return console.error('PUT error is :', err)}
		res.render('upload');
		});

}
