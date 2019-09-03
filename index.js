const http = require('http');
const request = require('request');

const name = process.env.WEBSITE_SITE_NAME || 'webapp';
const remoteURL = process.env.REMOTE_URL || 'http://localhost:1337';
const port = process.env.PORT || 1337;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });

    let localResponse = {
        name: name,
        status: 'ok'
    };

    // if we receive a request with no path, just send back our status
    if (req.url === '/') {
        console.log("Generating local response...");
        res.end(JSON.stringify(localResponse));
        return;
    }

    // otherwise, make a request to the remote server and merge that response with this one
    console.log("Making a request to " + remoteURL + " and merging response...");
    request(remoteURL, { json: true }, (err, _, response) => {
        if (err) { return console.log(err); }
        let merged = {
            local: localResponse,
            remote: response
        };
        res.end(JSON.stringify(merged));
    });
});

server.listen(port);

console.log("Server running at http://0.0.0.0:%d", port);
