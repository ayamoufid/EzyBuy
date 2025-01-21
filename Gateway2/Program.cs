using Microsoft.Extensions.Hosting;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

// Charger le fichier de configuration Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Ajouter Ocelot
builder.Services.AddOcelot();

// Configurer CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configurer Kestrel pour écouter sur toutes les interfaces réseau
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Listen(System.Net.IPAddress.Any, 5282); // Écouter sur toutes les interfaces
});

var app = builder.Build();

// Activer CORS
app.UseCors("CorsPolicy");

// Ajouter des logs et activer Ocelot Middleware
await app.UseOcelot();

// Lancer l'application
app.Run();
