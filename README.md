# NestJS Waterfall Flow Example

This repository contains a NestJS application demonstrating the implementation of a waterfall flow function with rollback capabilities in case any step encounters an error.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project showcases how to implement a waterfall flow in a NestJS application. A waterfall flow ensures that each step in a series of asynchronous operations is executed sequentially. If any step fails, the previous steps can be rolled back to maintain data consistency.

## Features

- Sequential execution of asynchronous operations
- Rollback mechanism for error handling
- NestJS framework

## Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/your-username/nestjs-waterfall-flow.git
  cd nestjs-waterfall-flow
  ```

2. Install dependencies:
  ```sh
  npm install
  ```

3. Run the application:
  ```
  npm run start
  ```

## Usage

1. Ensure the application is running:
  ``
  npm run start
  ```

2. The API will be available at `http://localhost:3000`.

3. You can test the waterfall flow implementation by sending requests to the appropriate endpoints. Refer to the API documentation for detailed information on available endpoints and their usage.

## Example

Here is an example of how to use the waterfall flow implementation:

1. Create a service that implements the waterfall flow:

```typescript
import { BadRequestException, Injectable } from '@nestjs/common';
import { WaterfallService } from './commons/waterfall/waterfall.service';
import { Step } from './decorators/step.decorator';
import { Rollback } from './decorators/rollback.decorator';

@Injectable()
export class AppService extends WaterfallService {
  @Step(1)
  async logFirst(eventId, data) {
    console.log('Step 1 [eventId]:', eventId);
    console.log('Step 1 [data]:', data);

    return {
      step: 1,
      message: 'this data from step 1',
    };
  }

  @Rollback(1)
  async fallbackFirst(eventId) {
    console.log('Rollback 1 [eventId]:', eventId);
  }

  @Step(2)
  async logSecond(eventId, data) {
    console.log('Step 2 [eventId]:', eventId);
    console.log('Step 2 [data]:', data);

    return {
      step: 2,
      message: 'this data from step 2',
    };
  }

  @Rollback(2)
  async fallbackSecond(eventId) {
    console.log('Rollback 2 [eventId]:', eventId);
  }

  @Step(3)
  async logThird(eventId) {
    throw new BadRequestException('Something error in step 3');
  }

  @Rollback(3)
  async fallbackThird(eventId) {
    console.log('Rollback 3 [eventId]:', eventId);
  }

  async execute() {
    const data = { step: 0, message: 'this data from initial function' };
    await this.executeSteps(data);
    return 'Step Executed';
  }
}

```

2. Inject the service into your controller and use it:

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.execute();
  }
}
```

3. Send a POST request to /example/execute to trigger the waterfall flow.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Feel free to modify the content as needed to fit your specific implementation details and preferences.
