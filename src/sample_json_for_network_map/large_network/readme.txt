This folder contains responses to the requests made by the Network Glue map to the IT Glue backend to display the map.

In order:

> GET http://localhost:3001/api/network_glue/networks/77
< api_networkglue_networks_77.json

> GET http://localhost:3001/api/network_glue/networks/77/relationships/snapshots?filter[status]=active&page[size]=1000&page[number]=1
< networks_77_snapshots.json

> GET http://localhost:3001/api/network_glue/snapshots/10/relationships/network_devices?include=interfaces&page[size]=1000&page[number]=1
< snapshots_10_network_devices.json

> GET http://localhost:3001/api/network_glue/snapshots/10/relationships/connections?page[size]=1000&page[number]=1
< snapshots_10_connections.json

> GET http://localhost:3001/api/operating_systems?sort=name&page[number]=1&page[size]=1000
< operating_systems.json

