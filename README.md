<p align="center"> 
    <img src=".github/logo.svg" width="200" alt="Outline Logo"> 
</p>

<h2 align="center">Outline Admin</h2>

Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN
servers.

![Build](https://github.com/AmRo045/OutlineAdmin/actions/workflows/build.yml/badge.svg)
![CodeQL](https://github.com/AmRo045/OutlineAdmin/actions/workflows/github-code-scanning/codeql/badge.svg)
[![Docker Pulls](https://img.shields.io/docker/pulls/amro045/outline-admin.svg?maxAge=604800)](https://hub.docker.com/r/amro045/outline-admin/)

> [!NOTE]
> The previous PHP/Laravel version of this project has been moved to
> the [OutlineAdminLaravel](https://github.com/AmRo045/OutlineAdminLaravel) repository.

## Table of Contents

1. [Added Features](#added-features)
    - [Dynamic Access Keys](#dynamic-access-keys)
    - [Health Check](#health-check)
    - [Notification Channels](#notification-channels)
    - [Expiration Date](#expiration-date)
    - [Tags](#tags)
    - [Prefix](#prefix)
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

The following features have been added to extend the functionality of the Outline Manager API:

### Dynamic Access Keys

Dynamic Access Keys (DAKs) provide a flexible way to manage Outline access keys by dynamically creating, deleting, and
updating them as needed. This allows the connection configuration to be updated without regenerating or redistributing
new keys.

In Outline Admin, DAKs are enhanced beyond the official Outline implementation, adding automated management and server
pooling features.

#### Self-Managed DAKs

A Self-Managed DAK automatically manages its associated access keys.
When a client requests access and no key exists, the system will create one on demand.
If a key expires or reaches its data limit, the underlying access keys will be removed automatically.
Example of an auto-generated access key name: `self-managed-dak-access-key-{dak_id}`.
These access keys are hidden in Outline Admin but remain visible in Outline Manager.

Self-Managed DAKs use a server pool to decide where to create new access keys.
You can choose how this pool is formed using one of the following modes:

Self-Managed DAKs use a server pool to decide where to create new access keys.
You can choose how this pool is formed using one of the following modes:

#### Manual Server Selection

In this mode, available servers are listed, and you can manually select one or more servers to include in the server
pool.
When the DAK creates an access key automatically, it will select one of these servers.

#### Tag-Based Server Selection

Instead of manually selecting servers, you can assign tags to servers (for example, `EU`, `US`, `High-Speed`,
or `Irancell`).
When creating a Self-Managed DAK, you can choose which tags to include.
The DAK will then automatically use all servers matching those tags to form its pool.

#### Manual DAKs

A Manual DAK does not automatically create or remove access keys.
Instead, the admin attach/detach access keys manually — similar to the official Outline dynamic access keys.

### Health Check

Outline Admin includes an automated Health Check system to monitor the status and availability of your servers.

When you add a new server to Outline Admin, a health check is automatically created for that server.
You can configure the check interval (how often the server is tested) and notification cooldown (how long to wait before
sending another alert) in the Health Checks section.

### Notification Channels

To ensure you’re promptly informed about server issues, Outline Admin lets you define and manage notification channels.

For example, you can set up a Telegram notification channel and link it to your server’s health check.
If the server becomes unreachable or fails its check, Outline Admin will automatically send a notification through your
chosen channel.

### Expiration Date

Outline Admin lets you set an expiration date for both standard access keys and dynamic access keys.
When an access key reaches its expiration date, it will be automatically disabled, preventing any further connections.

### Tags

Tags provide a simple and flexible way to organize and group servers in Outline Admin.
You can assign one or more tags to each server — for example, `EU`, `US`, `Asia`, `High-Speed` or `Irancell`.

### Prefix

**Prefixes** allow you to disguise Shadowsocks connections so they appear similar to other allowed network protocols.
This helps bypass firewalls that block or inspect encrypted traffic by making Outline connections look like familiar
protocols such as `HTTP`, `TLS`, `DNS`, or `SSH`.

A prefix is a short sequence of bytes added at the start of a Shadowsocks connection.
The port number used should typically match the protocol that the prefix is mimicking — for example, port `80` for
`HTTP` or
`443` for `HTTPS`.

In Outline Admin, prefixes can be configured for both static and dynamic access keys.
Admins can define and assign prefixes to help users connect more reliably in restricted networks.

Example use cases:

Simulate `HTTP` requests (`"POST "` → port `80`)

Simulate `TLS` traffic (`"\u0016\u0003\u0001\u0000\u00a8\u0001\u0001"` → port `443`)

Simulate `SSH` handshakes (`"SSH-2.0\r\n"` → port `22`)

> [!NOTE]
> Prefixes should be no longer than 16 bytes. Longer prefixes can cause salt collisions, which may reduce encryption
> safety.

---

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

or

```bash
docker-compose up -d
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

---

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

---

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

---

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

---

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

---

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
