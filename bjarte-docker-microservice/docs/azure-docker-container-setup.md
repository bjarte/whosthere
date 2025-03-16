# How to set up Azure Docker Container

Docs based on this guide:

<https://code.visualstudio.com/docs/containers/app-service>

## Local Docker image

After creating a project with a Dockerfile, build image.

The name of my image is "bjarte-docker-microservice". Don't forget the dot (current folder) at the end.

`docker build -t bjarte-docker-microservice .`

## Set up Azure Container Registry

Set up a container registry in Azure. For my demo, it's called

`BjarteDockerMicroservice`

The registry gets a url on this format. Note! Lowercase url even if the registry name has caps.

`bjartedockermicroservice.azurecr.io`

For later in the setup, add an admin user under Container registry -> Settings -> Access keys -> Check "Admin user"

## Tag the image with registry url

```powershell
docker tag bjarte-docker-microservice bjartedockermicroservice.azurecr.io/bjarte-docker-microservice:latest
```

## Push container image to registry

```powershell
az login
az acr login --name BjarteDockerMicroservice
docker push bjartedockermicroservice.azurecr.io/bjarte-docker-microservice:latest
```

## Set up Azure Container App

Set up a new container app pointing to the existing container registry BjarteDockerMicroservice.

Make sure to allow connections from anywhere if you want to connect to the service from a browser or servers outside of Azure.

After a few minutes you will see the new container app on the Azure Portal dashboard.

Click on it to find the link to the live service:

<https://xyz.region.azurecontainerapps.io>
