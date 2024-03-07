import http from "http"
import https from "https"
import app from "./app"
import fs from "fs"

const httpPort = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 3000
const httpsPort =  process.env.HTTPS_PORT ? parseInt(process.env.HTTPS_PORT, 10) : 3001

const key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');

const credentials = {
  key: key,
  cert: cert
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


httpServer.listen(httpPort, () => {
  console.log(`[server]: Http server is running at ${httpPort}`)
});

httpsServer.listen(httpsPort, () => {
  console.log(`[server]: Https server is running at ${httpsPort}`)
});
