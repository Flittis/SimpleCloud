# SimpleCloud

We are making an example of a simple implementation of cloud storage *(a clone of Google Drive or Dropbox)*     
Here you can store your files and be able to sort them by folders, and also give each file different access settings (available by link, only for certain users or private)

![Site](/Brand/Mockup.png)

## Install

### Prerequisites

For development, you will only need [**Node.JS**](https://nodejs.org/). 

### Setting up

Firstly, you should clone repository:

```
~#  git clone https://github.com/Flittis/Projekt_Zespolowy.git
```

Then, install all packages  
in `Client` folder
```
~#  cd Client
~#  npm install
```
and `Server` folder
```
~#  cd Server
~#  npm install
```

### Deploy

* Start `Server` script

```
~# cd Server
~# node src/index.js
```

For convenient management and monitoring of the script, you can use the [**PM2**](https://pm2.io/) process manager.

```
~# cd Server
~# pm2 start src/index.js --name SimpleCloud_Server
```

You can learn more about the functionality of the package manager, learn how to configure autorun, view logs, etc. in the official [**documentation**](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).

* Building `Client`

```
~# cd Client
~# npm run build
```

Deployed project will be avaliable in `Client/build` folder


## Technologies
In this project we will use [**NodeJS**](https://nodejs.org/) on the server with **Ubuntu**, and [**React**](https://reactjs.org/) for front-end

## Group
- Mykola Prokopchuk (https://github.com/Flittis)
- Zakhar Tereshchenko (https://github.com/zakhartereshchenko)
- Dmytro Baryshniuk (https://github.com/DmytroBaryshniuk)