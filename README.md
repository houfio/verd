Verd
---
Execute the following command to run Verd using Docker:
```shell
docker compose -f docker-compose-db.yml -f docker-compose-web.yml up
```
This will run Verd with the following environment variables:
```properties
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
SESSION_SECRET=secret
CONFIG_USERNAME=username
CONFIG_PASSWORD=password
```
