const forge = require('node-forge');
const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile)


test().catch(console.error);


async function test() {

    const caAttrs = [
        { name: 'commonName', value: 'ca.localhost' },
        { name: 'organizationName', value: 'Test CA' }
    ];

    const caCert = await generateCert(caAttrs, caAttrs); // no issuer PK, this will be self-signed.

    const serverAttrs = [
        { name: 'commonName', value: 'server.localhost' },
        { name: 'organizationName', value: 'Test Server' }
    ];

    const serverCert = await generateCert(serverAttrs, caAttrs, caCert.keys.privateKey);

    const clientAttrs = [
        { name: 'commonName', value: 'client.localhost' },
        { name: 'organizationName', value: 'Test Client' }
    ];

    const clientCert = await generateCert(clientAttrs, caAttrs, caCert.keys.privateKey);

    await writeFile("ca-key.pem", caCert.pem.privateKey);
    await writeFile("ca-crt.pem", caCert.pem.certificate);

    await writeFile("server-key.pem", serverCert.pem.privateKey);
    await writeFile("server-crt.pem", serverCert.pem.certificate);

    await writeFile("client-key.pem", clientCert.pem.privateKey);
    await writeFile("client-crt.pem", clientCert.pem.certificate);

}




async function generateCert(subjectAttrs, issuerAttrs, issuerPrivateKey) {

    console.log('Generating 2048-bit key-pair...');
    const keys = await generateKeyPair();

    console.log('Creating certificate...');
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    // cert.serialNumber = '01'; // useless? verify this...
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 2);

    cert.setSubject(subjectAttrs); // Subject === Issuer: this means self signed!
    cert.setIssuer(issuerAttrs); // Subject === Issuer: this means self signed!

    //TODO: test extensions (SAN, etc...)

    cert.sign(issuerPrivateKey || keys.privateKey); // if issuerPrivateKey is undefined, the cert is self-signed!
    console.log('Certificate created.');

    const pem = {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert)
    };

    return {
        pem: pem,
        keys: keys
    };
}


async function generateKeyPair() {

    return new Promise((resolve, reject) => {
        forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, (err, keypair) => {
            if (err) {
                reject(err);
            } else {
                resolve(keypair);
            }
        });
    });

}
