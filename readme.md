# Scalability and Arthitectural Pattern in NodeJS

## Measure requests per second that a server is able to handle on one process using network benchmarking took like autocannon:

npx autocannon -c 200 -d 10 http://localhost:8080

---> This command will load the server with 200 concurrent connections for 10 seconds.