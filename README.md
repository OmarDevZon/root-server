# Simple Order Management Server

1. Clone the repository:

   ```bash
   git clone https://github.com/omar-web-dev-2/root-server.git
   ```

   ```bash
   cd orders-management
   ```

instal node modules

```bash
 npm i
```

Runs the application

```bash
 npm run start
```

```bash
 npm run dev
```

```bash
 yarn run start
```

```bash
 yarn run dev
```

Deluging linting issues using ESLint

```bash
npm run debug
```

```bash
yarn run debug
```

Attempts to automatically fix linting issues using ESLint

```bash
npm run fix
```

```bash
yarn run fix
```

Placeholder for running tests

```bash
npm run test
```

```bash
yarn run test
```

Formats code using Prettier

```bash
 npm run format
```

```bash
 yarn run format
```

## .env file details

(very import don't forget add this file in your root file)

2. create a .env file in root path

```bash
PORT = {port is number like 3001}
BCRYPT_ROUNDS = {BCRYPT is number like 23}
MONGO_PROD = 'true' {for development comment this line}
WELCOME_MESSAGE = 'your server is open welcome message like Welcome API for Orders Management'
MONGO_URI_DEV = 'your local database url'
MONGO_URI_PROD = 'your production database url'
```


## Not Found page 
config/middlewares/notFound.ts

```bash

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found !!',
    error: '',
  });
};

```

## Global error handler
config/middlewares/globalErrorhandler.ts

```bash 
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(500).json({
    success: false,
    message: error.message || 'Something went wrong!',
    error,
  });
};

```


## API List

    1. create a user [host-link] ``` /api/users ```
    2. get all users [host-link] ``` /api/users ```
    3. get all users by id [host-link] ``` /api/users/ ``` userId
    4. update a user by id [host-link] ``` /api/users/ ``` userId
    5. delete a user by id [host-link] ```/api/users/ ``` userId
    6. create and update [host-link] ```/api/users/<userId>/orders ```
    7. Retrieve all orders for a specific user [host-link] ``` /api/users/<userId>/orders ```
    8.  Calculate Total Price of Orders for a Specific User
     [host-link] ``` /api/users/<userId>/orders/total-price ```
