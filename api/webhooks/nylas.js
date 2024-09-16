import https from 'https';

// example callback_url: https://node-webhooks-challenge-serverless-function.vercel.app/api/webhooks/nylas
export default function handler(request, response) {
  
  // /api/webhooks/nylas?challenge={{CHALLENGE_STRING}}
  if (request.method === "GET" && request.query.challenge) {
    console.log(`Received challenge code! - ${request.query.challenge}`);
    console.log(`Now returning challenge code! - ${request.query.challenge}`);
    // we need to enable the webhook by responding with the challenge parameter
    // CHALLENGE_STRING test
    return response.send(request.query.challenge);
  }

 
  if (request.method === "POST") {
   console.log('==========Message updated start==========');
   const data = JSON.stringify(request.body.data);

    const options = {
      hostname: 'hooks.zapier.com',
      port: 443,
      path: '/hooks/catch/2303567/22q90j5/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': data.length,
      },
    };

   const forwardedRequest = https.request(options, (res) => {
      console.log(`Forwarded statusCode: ${res.statusCode}`);
      
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
        console.log(responseData);
      });
      
      res.on('end', () => {
        console.log('Response from forwarded request:', responseData);
        response.status(200).end();
      });
    });

    forwardedRequest.on('error', (e) => {
      console.log(e);
      response.status(200).end();
    });

    console.log(data);
    forwardedRequest.write(data);
    forwardedRequest.end();

   console.log('==========Message updated end==========\n');
   // Responding to Nylas is important to prevent the webhook from retrying
   
 }

}
