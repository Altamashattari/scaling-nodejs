import {createServer} from 'http'

const { pid } = process;

const server = createServer((req, res) => {
    // simulates CPU intensive work
    let i = 1e7; while (i > 0) { i-- };
    console.log(`Handling Request from ${pid}`);
    res.end(`Hello from ${pid}`);
});

server.listen(8080, () => {
    console.log(`Server running on Port 8080 at ${pid}`);
})

// pm2 start api.js

// https://pm2.keymetrics.io/docs/usage/process-management/