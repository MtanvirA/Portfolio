# Stage 1: Compile frontend assets with Node.js 22 LTS
FROM node:22-alpine AS frontend
WORKDIR /src

# Copy package manifests for deterministic dependency installation
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

# Copy application source code for Tailwind CSS class discovery
COPY . .

# Compile and minify Tailwind CSS bundle
RUN npm run build:css

# Stage 2: Build and publish ASP.NET Core application with .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files & restore dependencies separately to optimize Docker layer caching
COPY ["Portfolio.csproj", "./"]
COPY ["Tests/Portfolio.Tests.csproj", "Tests/"]
COPY ["Portfolio.slnx", "./"]
RUN dotnet restore Portfolio.csproj

# Copy full application source tree
COPY . .

# Copy compiled Tailwind CSS from frontend stage into wwwroot
COPY --from=frontend /src/wwwroot/css/site.min.css ./wwwroot/css/site.min.css

# Publish Release build
RUN dotnet publish "Portfolio.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final lean runtime (.NET 10 ASP.NET Core runtime, zero Node.js)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Render passes dynamic port via PORT environment variable (defaulting to 10000)
ENV PORT=10000
EXPOSE 10000

# Copy published application from build stage
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.dll"]
