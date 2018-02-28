// copied from ../ssl
const tls = require('tls');
const fs = require('fs');

const options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-crt.pem'),
    ca: fs.readFileSync('ca-crt.pem'),
    requestCert: true,
    rejectUnauthorized: true
};

const server = tls.createServer(options, (socket) => {
    console.log('new client connected!',
        socket.authorized ? '(authorized)' : '(unauthorized)');

    const cert = socket.getPeerCertificate();
    console.log('Client common name: ' + cert.subject.CN);

    socket.on('error', (error) => {
        console.log(error);
    });

    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(process.stdout);
    socket.pipe(socket);
});

server.listen(8000, () => {
    console.log('server bound');
});
