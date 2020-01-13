This folder contains responses to the requests made by the Network Glue map to the IT Glue backend to display the map.
The responses have been prettified for easier human reading. The unaltered responses would be the same but without all the extra spaces and newlines.

In order:

> GET http://localhost:3001/api/network_glue/networks/77
< api_networkglue_networks_77.json

> GET http://localhost:3001/api/network_glue/networks/77/relationships/snapshots?filter[status]=active&page[size]=1000&page[number]=1
< networks_77_snapshots.json

> GET http://localhost:3001/api/network_glue/snapshots/9/relationships/network_devices?include=interfaces&page[size]=1000&page[number]=1
< snapshots_9_network_devices.json

> GET http://localhost:3001/api/network_glue/snapshots/9/relationships/connections?page[size]=1000&page[number]=1
< snapshots_9_connections.json
