# Build stage with .NET 10 SDK & Node.js
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Install Node.js for Tailwind CSS CLI build
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Copy package files & restore frontend dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy project files & restore .NET dependencies
COPY ["Portfolio.csproj", "./"]
COPY ["Tests/Portfolio.Tests.csproj", "Tests/"]
COPY ["Portfolio.slnx", "./"]
RUN dotnet restore Portfolio.csproj

# Copy source code
COPY . .

# Compile Tailwind CSS v4 and publish Release binary
RUN npm run build:css
RUN dotnet publish "Portfolio.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final lean runtime stage (.NET 10 ASP.NET Core runtime, no Node.js in runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Render passes dynamic port via PORT environment variable (defaulting to 10000)
ENV PORT=10000
EXPOSE 10000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.dll"]
