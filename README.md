# Minecraft Server

This is a minecraft server, but also an excuse to use a bunch of different AWS services to learn them.

## Lambdas

### mc-api

This is a basic server behind API gateway. It handles starting/stopping the EC2 instance running the Minecraft server, as well as querying the current status of the server.

### mc-player-list-change

This lambda gets triggered by Cloudwatch Logs whenever the Minecraft server logs a message matching "\_\_\_ (joined|left) the server". It triggers a "shutdown procedure" when the last player disconnects from the server, and handles cancelling the procedure if someone re-joins before shutdown completes.

### mc-shutdown

This is a very small function that makes a `POST /stop` request to `mc-api`. The lambda gets triggered by AWS Step Functions, after a 5-minute delay (that is the "shutdown procedure").

## Web

There is a very basic static website that makes calls to `mc-api` to display the server status, and start/stop it on command. It is built using Svelte.

## Docker

The `docker-compose.yml` contains the configuration for the minecraft server. It controls what modpack to load, what ports to expose, etc.
