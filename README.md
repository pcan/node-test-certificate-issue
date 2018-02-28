# node-test-certificate-issue

A test project for issuing TLS certificates from a self-signed CA. It uses [forge](https://github.com/digitalbazaar/forge).

## Usage

1.  First step: `npm install`.

2.  Launch `node issue-certs.js` and 6 files will be created:
    - `ca-crt.pem` The CA Certificate (self-signed)
    - `ca-key.pem` The CA Private Key, used to sign other certificates
    - `client-crt.pem` The Client Certificate
    - `client-key.pem` The Client Private Key
    - `server-crt.pem` The Client Certificate
    - `server-key.pem` The Client Private Key

3.  Run server with `node server.js`.
4.  Run client with `node client.js`.
5.  You should see some logging that confirms connection is ok (on both sides). Type something on the client-side console and you will get it back, since the server is echoing everything you send to it.

## License
MIT
