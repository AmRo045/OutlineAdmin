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
3. [Development](#development)
4. [Donation](#donation)
5. [Screenshots](#screenshots)

## Features

- Set expiration dates for Access Keys.
- Generate QR codes for Access Keys.
- Create dynamic Access Keys.
- Add prefix to Access Keys.


## Installation

### Installation - Docker

Before installing Outline Admin, ensure that Docker and Docker Compose are installed on your machine. Use the following command to start the container:

```bash
mkdir outline-admin
cd outline-admin
```

```bash
docker run -p 3000:3000 --name outline-admin -v ./oa_data:/app/data amro045/outline-admin:latest
```

#### Using Docker Compose

To simplify the installation, you can use a Docker Compose file:

```bash
mkdir outline-admin
cd outline-admin
```

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/AmRo045/OutlineAdmin/main/docker-compose.yml
```

```bash
docker-compose up -d
```

### Installation - NodeJS

To run this project on your machine, ensure you have Node.js v20 or later and npm v10 or later installed.
Follow the steps below to set up Outline Admin using Node.js:

#### Step 1: Prepare the project files

```bash
git clone https://github.com/AmRo045/outline-admin.git
cd outline-admin
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

## Development

Follow the steps below:

#### Step 1: Prepare the project files

```bash
git clone https://github.com/AmRo045/outline-admin.git
cd outline-admin
cp .env.example .env
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create the database

```bash
npx prisma migrate 
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

![Login](/.github/screenshots/1-login.png)
![Servers](/.github/screenshots/2-servers.png)
![New server](/.github/screenshots/3-new-server.png)
![Server settings](/.github/screenshots/4-server-settings.png)
![Server access keys](/.github/screenshots/5-server-access-keys.png)
![Dynamic access keys](/.github/screenshots/6-dynamic-access-keys.png)
![Dynamic access key edit](/.github/screenshots/7-dynamic-access-key-edit.png)
![Dynamic access key details](/.github/screenshots/8-dynamic-access-key-details.png)
![Dynamic access key access-keys](/.github/screenshots/9-dynamic-access-key-access-keys.png)
