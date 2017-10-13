const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Firestore = require('@google-cloud/firestore');

admin.initializeApp (functions.config().firebase);
const firestore = new Firestore(functions.config().firebase)


exports.bigben = functions.https.onRequest((req, res) => {
	const hours = (new Date().getHours() % 12) + 1;
	res.status(200).send(`<!doctype html>
		<head>
			<title>Time</title>
		</head>
		<body>
			${'BONG '. repeat(hours)}<br>
			req.method=${req.method}<br>
			req.body.text=${req.body.text}
		</body>
		</html>`);
});

exports.change = functions.firestore.document('Teams/{teamID}').onWrite((event) => {
	console.log("document changed!!!");
})

exports.matches = functions.https.onRequest((req, res) => {
	var matches = req.body.matches;
	if(Array.isArray(matches)){
		matches.forEach( function (m) {	
			var docname = "Events/" + m.event + "/Matches/" + m.name;
			console.log(docname);
			var doc = firestore.collection("Events").doc(m.event).collection("Matches").doc(m.name);
			console.log(`Path of document is ${doc.path}`)
			doc.set( {
				number: m.number,
				red: m.red,
				blue: m.blue
			}).then(() => {
				console.log("done!");
			}).catch((err) => {
				console.log(`Failed to create document: ${err}`);
			});
		});
	}
	res.status(200).send("done!");
});


exports.teams = functions.https.onRequest((req, res) => {
	//var ret = "Teams: "
	var data = req.body;
	if(Array.isArray(data.teams)) {
		data.teams.forEach( function (i) {
	//		ret += i.number + ", ";
			var docname = 'Teams/' + i.number;
			var doc = firestore.doc(docname);
			doc.set({
				Name: i.teamname,
				School: i.school,
				City: i.city,
				State: i.state,
				Country: i.country,
			}).then(() => {
				console.log("Create " + docname);
			});
			
		})
	}
	res.status(200).send("done!");
});


