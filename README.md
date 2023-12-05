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

#### use not found page
server.ts
```bash 
app.use(notFound);
```

1st time use 
## Global error handler
src/app/middlewares/globalErrorhandler.ts

```bash 
import { ErrorRequestHandler } from 'express';

type TErrorSource = {
  path: string | number;
  message: string;
}[];

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  const statusCode = 5000;
  const success = false;
  const message = 'Something went wrong!';
  const errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];
  return res.status(statusCode).json({
    success,
    message: error.message || message,
    errorSource,
  });
};


```

#### use Global error handler
server.ts
```bash 
app.use(globalErrorHandler);
```
## Global error handler 
2nd time use 

##### Global error handler interface
src/app/error/error.iterface.ts
```bash
/* eslint-disable @typescript-eslint/no-explicit-any */
export type TErrorSource = {
  path: string | number;
  message: string;
}[];

export type TGlobalReturnError = {
  statusCode?: number;
  message?: any;
  errorSource?: any;
  error?: any;
  stack?: null | any;
};

export type TValidationErrorResponse = {
  statusCode: number;
  message: string;
  errorSource: TErrorSource;
  error?: any;
};
```
## Global error handler function
src/app/error/handel.cast.error.ts
1. 
```bash
export const handelCastError = (
  error: mongoose.Error.CastError,
): TValidationErrorResponse => {
  const errorSource: TErrorSource = [
    { path: error?.path || '', message: error?.message },
  ];

  return {
    statusCode: 400,
    message: config.SERVER_PROD
      ? 'Validation Error'
      : 'Mongoose Cast Validation Error',
    errorSource,
  };
};
```
#### 2. handel.mongoose.error.ts
src/app/error/handel.mongoose.error.ts
```bash 

export const handelMongooseError = (
  error: mongoose.Error.ValidationError,
): TValidationErrorResponse => {
  const ObgToArray = Object.values(error?.errors);
  

  const errorSource: TErrorSource = ObgToArray.map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path || '',
        message: val?.message || 'Something went wrong',
      };
    },
  );


  return {
    statusCode: 400,
    message: (config.SERVER_PROD as string | undefined)
      ? 'Validation Error'
      : ('Mongoose Validation Error' as string),
    errorSource,
  };
};
```





 ### Global error handler all error convert one shape
src/app/middlewares/globalErrorhandler.ts
```bash
export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): TGlobalReturnError => {
  const success = false;
  let statusCode = error.statusCode || 500;
  let message = 'Something went wrong!';
  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  // zod error
  if (error instanceof ZodError) {
    const simplifiedError = handelZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  // Mongoose Error
  else if (error.name === 'ValidationError') {
    const simplifiedError = handelMongooseError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  // Cast Error
  else if (error.name === 'CastError') {
    const simplifiedError = handelCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  // Duplicate Error

  // else if (error.code === 11000) {
  //   const simplifiedError = handelDuplicateError(error);
  //   statusCode = simplifiedError?.statusCode;
  //   message = simplifiedError?.message;
  //   errorSource = simplifiedError?.errorSource;
  // }

  // default error
  return res.status(statusCode).json({
    success,
    message,
    errorSource,
    error : config.SERVER_PROD ? null : error,
    stack: config.SERVER_PROD ? null : error.stack,
  });
};
```

#### use Global error handler 

server.ts
```bash 
app.use(globalErrorHandler);
```

## Response 
src/app/utils/sendResponse.ts
```bash 
import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

```

#### user Response
src/app/
```bash
sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department created successfully',
      data: result,
    });
```

## Router 
src/app/routers/intex.ts
```bash 

import { Router } from 'express';
const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

```

#### use Router
server.ts
```bash 
app.use('/api/v1', router);
```


     server file strachar
```bash
|-src
|------app
|-----|-----config
|-----|----|-------databaseConnecting.ts
|-----|----|-------index.ts
|-----|----|-------other.ts
|-----|-----middlewares
|-----|----|-------globalErrorhandler.ts
|-----|----|-------notFound.ts
|-----|----|-------validators.ts
|-----|----|-------other.ts
|-----|-----modules
|-----|----|-------user
|-----|----|------|-----user.controller.ts
|-----|----|------|-----user.interface.ts
|-----|----|------|-----user.model.ts
|-----|----|------|-----user.route.ts
|-----|----|------|-----user.service.ts
|-----|----|------|-----user.validation.ts
|-----|----|------|-----other.ts
|-----|----|-------other
|-----|-----routes
|-----|----|-------index.ts
|-----|-----utils
|-----|----|-------catchAsync.ts
|-----|----|-------sendResponse.ts
|-----|----|-------other.ts
|------server.ts
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

