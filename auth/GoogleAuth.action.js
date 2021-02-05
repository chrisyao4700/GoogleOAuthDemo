

const {OAuth2Client} = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');

// Download your OAuth2 configuration from the Google
//const keys = require('../Docs/client_secret_41501820031-2r5rt6d0knhvcadu35t09sjvcblmlm91.apps.googleusercontent.com.json');

const keys = require('../Docs/client_secret_16762523306-0q4832pg0b07ncln4p4msmkilclgi19o.apps.googleusercontent.com.json');
//const keys = require('../Docs/client_secret_41501820031-2r5rt6d0knhvcadu35t09sjvcblmlm91.apps.googleusercontent.com.json');



/**
* Start by acquiring a pre-authenticated oAuth2 client.
*/
async function main() {
  const oAuth2Client = await getAuthenticatedClient();
  // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
  const res = await oAuth2Client.request({url});
  console.log(res.data);

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log(tokenInfo);
}

/**
* Create a new OAuth2Client, and go through the OAuth2 content
* workflow.  Return the full client to the callback.
*/
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    // console.log(keys);
    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        console.log(req.url);
        try {


            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            console.log(r);
            resolve(oAuth2Client);

        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        console.log('IM HERE LISTENING');
        open(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

main().catch(console.error);
// Handling token events
// This library will automatically obtain an access_token, and automatically refresh the access_token if a refresh_token is present. The refresh_token is only returned on the first authorization, so if you want to make sure you store it safely. An easy way to make sure you always store the most recent tokens is to use the tokens event:
// const run = async ()=>{
//   try{
//     const client = await auth.getClient();
//
//     client.on('tokens', (tokens) => {
//       if (tokens.refresh_token) {
//         // store the refresh_token in my database!
//         console.log(tokens.refresh_token);
//       }
//       console.log(tokens.access_token);
//     });
//
//     const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
//     const res = await client.request({ url });
//   }catch(e){
//     console.log(e);
//   }
// };
// run();
