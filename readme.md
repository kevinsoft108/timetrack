# Goalsetter MERN app

This is the time tracking app

## Usage

node version 18.17.1

Rename the .envexample to .env and add your MONGO_URI

### Run Frontend

```
cd frontend
pnpm install
yarn start
```

### Run Server

```
cd backend
pnpm install
yarn start
```

### Build Windows App

```
yarn production
```


### Deploy

```
pm2 ls
pm2 start npm --name "backend" -- run backend
pm2 start npm --name "frontend" -- run frontend
pm2 delete backend
pm2 delete frontend
```