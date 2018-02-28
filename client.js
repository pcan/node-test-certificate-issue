// copied from ../ssl
const tls = require('tls');
const fs = require('fs');

const options = {
    ca: fs.readFileSync('ca-crt.pem'),
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-crt.pem'),
    host: 'server.localhost',
    port: 8000,
    rejectUnauthorized:true,
    requestCert:true
};

const socket = tls.connect(options, () => {
    console.log('connected to server!',
        socket.authorized ? '(authorized)' : '(unauthorized)');

    const cert = socket.getPeerCertificate();
    console.log('Server common name: ' + cert.subject.CN);

    process.stdin.pipe(socket);
    process.stdin.resume();
});

socket.setEncoding('utf8');

socket.on('data', (data) => {
    console.log(data);
});

socket.on('error', (error) => {
    console.log(error);
});

socket.on('end', () => {
    console.log('Socket end event');
});

/*
23601989

The second problem is the one that really causes that DEPTH_ZERO_SELF_SIGNED_CERT error. You are giving all your certificates - CA, server, and client - the same Distinguished Name. When the server extracts the issuer information from the client certificate, it sees that the issuer DN is the same as the client certificate DN and concludes that the client certificate is self-signed.

Try regenerating your certificates, giving each one a unique Common Name (to make the DN also unique). For example, name your CA certificate "Foo CA", your server certificate the name of your host ("localhost" in this case), and your client something else (e.g. "Foo Client 1").

*/
