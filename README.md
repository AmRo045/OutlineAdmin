<p align="center"> 
    <img src=".github/logo.svg" width="200" alt="Outline Logo"> 
</p>

<h2 align="center">Outline Admin</h2>

Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN servers.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
   - [Using Docker](#installation---docker)
   - [Using Docker Compose](#using-docker-compose)
   - [Using NodeJS](#installation---nodejs)
3. [Donation](#donation)
4. [Screenshots](#screenshots)

## Features

- Set expiration dates for Access Keys.
- Generate QR codes for Access Keys.
- Create dynamic Access Keys.
- Add prefix to Access Keys.

## Installation

### Installation - Docker

Before installing Outline Admin, ensure that Docker and Docker Compose are installed on your machine. Use the following command to start the container:

```bash
docker run -p 3000:3000 --name outline-admin -v ./oa_data:/app/data amro045/outline-admin:latest
```

#### Using Docker Compose

To simplify the installation, you can use a Docker Compose file:

```bash
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/AmRo045/OutlineAdmin/main/docker-compose.yml)"

docker-compose up -d
```

### Installation - NodeJS

Follow these steps to set up Outline Admin using NodeJS:

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
npm run start
```

## Donation

If you find this project useful and would like to support its development, consider making a donation. Your support is greatly appreciated!

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

