'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const videowelcome = 'https://www.youtube.com/watch?v=U9hq83ryFj0';
const wedo = 'https://media.giphy.com/media/t8LaaaPNOYVJfImLNu/giphy.gif';
const buceo = 'https://media.giphy.com/media/3oEhmGYdZDCsGANSUw/giphy.gif';
const welcome = 'https://media3.giphy.com/media/9Y5dai0r8F9xb5FCrw/giphy.gif?cid=3640f6095c96e7c87a56424a41e5d14f';
const welcome2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCI7tShlyVeubGtVbh6XTCPNfZVlXFFYOEO55zskrSjLzwEKUQ';
const infovuelos = 'https://media3.giphy.com/media/atZII8NmbPGw0/giphy.gif?cid=790b76115ce5b0944366663159488200&rid=giphy.gif';

const admin = require('firebase-admin');
var firebaseConfig = {
  authDomain: "SU ID",
    databaseURL: "SU ID",
    projectId: "SU ID",
    storageBucket: "SU ID",
    messagingSenderId: "SU ID"
  };

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
function welcome(agent) {
    agent.add(`Bienvenid@ te saluda Ted 🤖, la asistente virtual de Cloud Airliness`);
    agent.add(new Card({
        title: `NLP Demo `,
        imageUrl: welcome2,
        text: `Automatización de reservación de vuelos en una base datos en tiempo real en la nube.`,
        buttonText: 'Ver Video', 
        buttonUrl: videowelcome
      })
    );
    agent.add(`Recuerda que fui entrenada:`);
 agent.add(new Suggestion(`Reservar vuelos`));   
 agent.add(new Suggestion(`Códigos aeropuertos`));
	
   
  }
function fallback(agent) {
    agent.add(`Recuerda que fui entrenada en:`);
 agent.add(new Suggestion(`Reservar vuelos`));   
 agent.add(new Suggestion(`Códigos aeropuertos`));
  
  }
  
function info(agent) { 
 agent.add(`Para conocer el código internacional IATA del aeropuerto, indique su ciudad y país:`);
 agent.add(new Suggestion(`Reservar vuelo`));   


}


function book (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    const name = agent.parameters.name;
	const email = agent.parameters.email;
	const idpassport = agent.parameters.idpassport;
	const tipovuelo = agent.parameters.tipovuelo;
	const origin = agent.parameters.origin;
	const fecha1 = agent.parameters.fecha1;
	const destination = agent.parameters.destination;
	const fecha2 = agent.parameters.fecha2;
	const quant = agent.parameters.quant;
	const tyc = agent.parameters.tyc;

    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection('reserva_vuelos').doc();
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, { viFecha2: fecha2, vDestino: destination, ivFecha1: fecha1, iiiOrigen:origin, iiEmail: email, iNombre: name});
	 

      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Excelente "${name}" su curso fue matriculado con éxito.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      agent.add(`Failed to write "${name}" to the Firestore database.`);
    });
  }
  
 

  let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('info.cursos', info);
intentMap.set('book', book);
  
  agent.handleRequest(intentMap);
});
