import { Shron, ShronResult } from '../src';

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

async function main() {
    const person = new Person('Serkan', 'Ozal');

    person.hi();

    person.whoAreYou();

    await person.comeHere();

    await person.sleep();
}

main();
