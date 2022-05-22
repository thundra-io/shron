export type ShronOpts = {
    name?: string,
    async?: boolean,
    cb?: (result: ShronResult) => any;
}

export type ShronResult = {
    readonly type: string;
    readonly region: string;
    readonly functionName: string;
    readonly functionVersion: string;
    readonly traceId: string;
    readonly name: string;
    readonly startTime: number;
    readonly duration: number;
    readonly durationHighRes: number;
}

const defaultCallback = (result: ShronResult) => {
    console.log(JSON.stringify(result));
}

const createResult = (name: string, startTime: number, passedTime: number[]): ShronResult => {
    const delay: number = passedTime[0] * 1000 + passedTime[1] / 1e6;
    return {
        type: 'shron',
        region: process.env.AWS_REGION,
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
        functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
        traceId: process.env._X_AMZN_TRACE_ID,
        name,
        startTime,
        duration: Math.floor(delay),
        durationHighRes: delay,
    } as ShronResult;
}

export function Shron(opts?: ShronOpts): any {
    const callback = opts?.cb || defaultCallback;
    return function (_target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        let thisFunc: object;
        const method = descriptor.value;
        const name = opts?.name || propertyKey;
        if (opts?.async) {
            descriptor.value = async function (...args: any[]) {
                if (!thisFunc) {
                    thisFunc = this;
                }
                const startTime: number = Date.now();
                const startTimeHR = process.hrtime();
                const result: any = await method.apply(this, args);
                const passedTime = process.hrtime(startTimeHR);
                const shronResult: ShronResult = createResult(name, startTime, passedTime);
                callback.apply(thisFunc, [shronResult]);
                return result;
            }
        } else {
            descriptor.value = function (...args: any[]) {
                if (!thisFunc) {
                    thisFunc = this;
                }
                const startTime: number = Date.now();
                const startTimeHR = process.hrtime();
                const result: any = method.apply(this, args);
                const passedTime = process.hrtime(startTimeHR);
                const shronResult: ShronResult = createResult(name, startTime, passedTime);
                callback.apply(thisFunc, [shronResult]);
                return result;
            }
        }
        return descriptor;
    }
}
