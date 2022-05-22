# shron
Serverless Chronometer

![workflow](https://github.com/serkan-ozal/shron/actions/workflows/build.yml/badge.svg)
[![npm version](https://badge.fury.io/js/shron.svg)](https://badge.fury.io/js/shron)
![license](https://img.shields.io/badge/license-MIT-blue)

`shron` is an NPM package to measure execution times of methods (sync/async) in TypeScript files 
by decorators (`@Shron`) automatically without modifying method bodies.

It also allows you to report those collected performance metrics (`ShronResult`)
to external systems (AWS CloudWatch, Elasticsearch, Prometheus, etc ...) through callbacks.

## Installation

You can add `shron` package into your AWS Lambda function as NPM package:

```
npm install --save shron
```

`Shron` is based on TypeScript's *experimental* [method decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators) feature.
So to be able to use `Shron` without warning during compilation, 
you need to enable `experimentalDecorators` option in your `tsconfig` or `jsconfig` file:
```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    ...
  },
  ...
}
```

## Usage

```ts
import { Shron, ShronResult } from 'shron';

class Person {

    constructor(
        private firstName: string,
        private lastName: string,
    ) {}

    @Shron()
    hi(): void {
        console.log(`Hello!`);
    }

    @Shron({
        cb: (result: ShronResult) => {
            console.log(`Executed ${result.name} in ${result.duration} ms`);
        }
    })
    whoAreYou(): void {
        console.log(`I am ${this.firstName}, ${this.lastName}`);
    }

    @Shron({
        async: true,
    })
    async comeHere(): Promise<void> {
        console.log(`I am coming ...`);
        await new Promise(r => setTimeout(r, 1000));
        console.log(`Here I am`);
    }

    @Shron({
        async: true,
        cb: (result: ShronResult) => {
            console.log(`Executed ${result.name} in ${result.duration} ms`);
        }
    })
    async sleep(): Promise<void> {
        console.log(`Sleeping ...`);
        await new Promise(r => setTimeout(r, 1500));
        console.log(`Just woke up`);
    }

}

export async function hello(event: any) {
    const person = new Person('Serkan', 'Ozal');

    person.hi();

    person.whoAreYou();

    await person.comeHere();

    await person.sleep();

    return {
        message: 'Hello world!',
        input: event,
    };
}
```

which prints the following output:
```
2022-05-22T09:15:26.353+03:00	START RequestId: cc321720-17b8-4619-b986-5fdc785bcfd0 Version: $LATEST
2022-05-22T09:15:26.356+03:00	2022-05-22T06:15:26.356Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO Hello!
2022-05-22T09:15:26.356+03:00	2022-05-22T06:15:26.356Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO {"type":"shron","region":"us-east-1","functionName":"shron-playground-dev-hello","functionVersion":"$LATEST","traceId":"Root=1-6289d4fe-09ebe097262cbf46535df690;Parent=4a9c0ed8258690a7;Sampled=0","name":"hi","startTime":1653200126355,"duration":0,"durationHighRes":0.548095}
2022-05-22T09:15:26.356+03:00	2022-05-22T06:15:26.356Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO I am Serkan, Ozal
2022-05-22T09:15:26.356+03:00	2022-05-22T06:15:26.356Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO Executed whoAreYou in 0 ms
2022-05-22T09:15:26.357+03:00	2022-05-22T06:15:26.357Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO I am coming ...
2022-05-22T09:15:27.359+03:00	2022-05-22T06:15:27.359Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO Here I am
2022-05-22T09:15:27.360+03:00	2022-05-22T06:15:27.359Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO {"type":"shron","region":"us-east-1","functionName":"shron-playground-dev-hello","functionVersion":"$LATEST","traceId":"Root=1-6289d4fe-09ebe097262cbf46535df690;Parent=4a9c0ed8258690a7;Sampled=0","name":"comeHere","startTime":1653200126357,"duration":1002,"durationHighRes":1002.726858}
2022-05-22T09:15:27.360+03:00	2022-05-22T06:15:27.360Z cc321720-17b8-4619-b986-5fdc785bcfd0 INFO Sleeping ...
2022-05-22T09:15:28.865+03:00	END RequestId: cc321720-17b8-4619-b986-5fdc785bcfd0
2022-05-22T09:15:28.865+03:00   REPORT RequestId: cc321720-17b8-4619-b986-5fdc785bcfd0	Duration: 2509.56 ms	Billed Duration: 2510 ms	Memory Size: 1024 MB	Max Memory Used: 56 MB	Init Duration: 162.87 ms	
```


## Contributing

Everyone is very welcome to contribute to this repository.
Feel free to [raise issues](https://github.com/serkan-ozal/shron/issues)
or to [submit Pull Requests](https://github.com/serkan-ozal/shron/pulls).


## License

Licensed under [MIT License](LICENSE).
