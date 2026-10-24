# Build stage with .NET 10 SDK & Node.js
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Install Node.js for Tailwind CSS CLI build
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Copy project files & restore dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY ["Portfolio.csproj", "./"]
COPY ["Tests/Portfolio.Tests.csproj", "Tests/"]
COPY ["Portfolio.slnx", "./"]
RUN dotnet restore Portfolio.csproj

# Copy full source code
COPY . .

# Build CSS and compile Release binary
RUN npm run build:css
RUN dotnet publish "Portfolio.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.dll"]
