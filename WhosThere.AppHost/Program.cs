using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var cache = builder
    .AddRedis("cache");

var apiService = builder
    .AddProject<WhosThere_ApiService>("apiservice");

builder.AddProject<WhosThere_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

builder
    .AddDockerfile(
        "bjarte-docker-microservice",
        "../api-with-typescript-and-bun/");

builder.Build().Run();
