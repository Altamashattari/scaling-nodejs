import { createServer } from 'http';
import { cpus } from 'os';
import cluster from 'cluster';
import { once } from 'events';


if (cluster.isMaster) {
    const availableCPUS = cpus();
    console.log(`Clustering to ${availableCPUS.length} processes`);
    console.log(`Master Process running on ${process.pid}`);
    // FORKING NEW WORKER IN CASE OF CRASH OR ERROR
    cluster.on('exit', (worker, code) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} crashed` + 'Starting a new worker');
            cluster.fork();
        }
    });
    // ZERO DOWNTIME RESTART
    process.on('SIGUSR2', async() => {
        const workers = Object.values(cluster.workers);
        for(const worker of workers) {
            console.log(`Stopping worker: ${worker.process.pid}`);
            worker.disconnect();
            if(!worker.exitedAfterDisconnect) continue;
            console.log('Forking new worker now...');
            const newWorker = cluster.fork();
            await once(newWorker, 'listening');
            console.log('New Worker Started');
        }
    });
    // FORKING WORKERS BASED ON THE AVAILABLE LOGICAL CPUs.
    availableCPUS.forEach(() => cluster.fork());
} else {
    // THROWING ERROR TO TEST FORKING NEW WORKER IN CASE OF ERROR
    // setTimeout(() => {
    //     throw new Error('OOPS!!');
    // }, Math.ceil(Math.random() * 3) * 1000);

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
}

