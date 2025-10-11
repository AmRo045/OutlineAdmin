<p align="center"> 
    <img src=".github/logo.svg" width="200" alt="Outline Logo"> 
</p>

<h2 align="center">Outline Admin</h2>

Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN
servers.

> [!NOTE]
> The previous PHP/Laravel version of this project has been moved to
> the [OutlineAdminLaravel](https://github.com/AmRo045/OutlineAdminLaravel) repository.

## Table of Contents

1. [Added Features](#added-features)
2. [Installation](#installation)
    - [Docker](#docker)
    - [Docker Compose](#docker-compose)
    - [NodeJS](#nodejs)
3. [Updating to Latest Version](#updating-to-latest-version)
4. [Development](#development)
5. [Admin Password](#admin-password)
6. [Donation](#donation)
7. [Screenshots](#screenshots)

## Added Features

- Expiration dates for Access Keys.
- QR codes for Access Keys.
- Dynamic Access Keys.
- Access Key prefix.

## Installation

### Docker

Before installing Outline Admin, ensure that Docker and Docker Compose are installed on your machine. Use the following
commands to start the container:

```bash
docker run -d -p 3000:3000 --name outline-admin -v ./oa_data:/app/data -v ./logs:/app/logs --restart unless-stopped amro045/outline-admin:latest
```

#### Docker Compose

To simplify the installation, you can use a Docker Compose file:

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/AmRo045/OutlineAdmin/main/docker-compose.yml
```

```bash
docker compose up -d
```

### NodeJS

To run this project on your machine, ensure you have Node.js v20 or later and npm v10 or later installed.
Follow the steps below to set up Outline Admin using Node.js:

#### Step 1: Prepare the project files

```bash
git clone https://github.com/AmRo045/OutlineAdmin.git
cd OutlineAdmin
cp .env.example .env
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create the database

```bash
npx prisma migrate deploy 
npx prisma generate
```

#### Step 4: Build the project

```bash
npm run compile
npm run setup 
npm run build
```

#### Step 5: Start the application

```bash
cd .next/standalone
node server.js
```

## Updating to Latest Version

Pull the latest version of the outline-admin image

```bash
docker pull amro045/outline-admin:latest
```

Stop running container

```bash
docker compose down
```

Restart the container

```bash
docker compose up -d
```

Clean up the old image to free up disk space

```bash
docker rmi {old-image-id}
```

Replace {old-image-id} with the ID of the old image you want to remove.

## Development

Follow the steps below:

#### Step 1: Prepare the project files

```bash
git clone https://github.com/AmRo045/OutlineAdmin.git
cd OutlineAdmin
cp .env.example .env
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create the database

```bash
npx prisma db push
npx prisma generate
```

#### Step 4: Build the project

```bash
npm run compile
npm run setup
```

#### Step 5: Start the application

```bash
npm run dev
```

## Admin Password

To update the admin user password, use one of the following commands.

For Docker containers:

```bash
docker exec -it outline-admin npm run password:change "your new password"
```

For non-Docker setup:

```bash
npm run password:change "your new password"
```

## Donation

If you find this project useful and would like to support its development, consider making a donation. Your support is
greatly appreciated!

### BTC

```
bc1qjmnnw4779ntv08uuqmpqnx7hqmygl08z4z500a
```

### USDT

```
0xCcF2117F837b16fbc0FbDe0178De0a2aCbfadC58
```

### TON

```
UQByW0gL9r89D4oFagC3ZRCEctIoh6XjHu7zv5xU2wcPVATT
```

### ETH

```
0xCcF2117F837b16fbc0FbDe0178De0a2aCbfadC58
```

## Screenshots

![Login](/.github/screenshots/1-login.png)
![Servers](/.github/screenshots/2-servers.png)
![New server](/.github/screenshots/3-new-server.png)
![Server settings](/.github/screenshots/4-server-settings.png)
![Server access keys](/.github/screenshots/5-server-access-keys.png)
![Dynamic access keys](/.github/screenshots/6-dynamic-access-keys.png)
![Dynamic access key edit](/.github/screenshots/7-dynamic-access-key-edit.png)
![Dynamic access key details](/.github/screenshots/8-dynamic-access-key-details.png)
![Dynamic access key access-keys](/.github/screenshots/9-dynamic-access-key-access-keys.png)
