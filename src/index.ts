import Benchmark from 'benchmark';
import process from 'process';
import { fork } from 'child_process';
import path from 'path';
import minimist from 'minimist';

const inlineEnvSym = Symbol("hotloop-inline-environment");

interface IHotloopEnvironment {
    send: (msg: any) => void,
    json: any,
}

type BenchmarkEvent = { type: any, target: any };
type BenchmarkCallback = ({ type, target }: BenchmarkEvent) => void;

function getEnvironment(): IHotloopEnvironment {
    const inlineEnv = (global as any)[inlineEnvSym];
    
    return inlineEnv !== undefined
        ? inlineEnv
        : {
            send: (...args) => process.send!(...args),
            json: process.argv[2]
        };
}

function setInlineEnvironment(environment: IHotloopEnvironment | undefined) {
    (global as any)[inlineEnvSym] = environment;
}

export function getTestArgs() {
    const json = getEnvironment().json;
    return json === undefined
        ? undefined
        : JSON.parse(json);
}

export function benchmark(name: string, fn: () => void) {
    const { send } = getEnvironment();

    new Benchmark(name, fn)
        .on('complete', send)
        .on('error', send)
        .run();
}

type ForkFn = (path: string, args: any, callback: BenchmarkCallback) => void;

export async function runCore(forkFn: ForkFn, modules: { path: string; args?: any }[]) {
    return new Promise(async (accept) => {
        const results: any[] = [];

        function pretty(value: number) {
            const [whole, fractional] = `${value}`.split('.');
            return `${
                whole.replace(/(?=(?:\d{3})+$)(?!\b)/g, ',')
            }${
                fractional !== undefined
                    ? `.${fractional}`
                    : ''
            }`;
        }

        const msgHandler = ({ type, target }: { type: any, target: any }) => {
            switch (type) {
                case 'complete':
                    results.push(target);
                    const { hz, name, stats } = target;
                    console.log(
                        `${name} x ${pretty(hz.toFixed(target.hz < 100 ? 2 : 0))} ops/sec \xb1${stats.rme.toFixed(2)}% (${
                        stats.sample.length
                    } run${stats.sample.length == 1 ? '' : 's'} sampled)`);
                    startNext();
                    break;
                default:
                    console.error(target);
                    process.exit(1);
                    break;
            }
        };

        function startNext() {
            const nextModule = modules.shift();
            if (nextModule !== undefined) {
                forkFn(
                    nextModule.path,
                    nextModule.args === undefined
                        ? undefined
                        : JSON.stringify(nextModule.args),
                    msgHandler
                );
            } else {
                console.log();
                console.table(
                    results
                        .sort((left, right) => right.hz - left.hz)
                        .map(({ hz, name, stats }) => ({
                            name,
                            'ops/sec': pretty(hz.toFixed(2)),
                            rme: `\xb1${pretty(stats.rme.toFixed(2))}%`,
                            samples: stats.sample.length
                        }))
                );
                console.log();
                accept();
            }
        }

        startNext();
    });
}

async function runOutOfProc(modules: { path: string; args?: any }[]) {
    return runCore(
        (path: string, json: string, callback: BenchmarkCallback) =>
            fork(path,
                json === undefined
                    ? []
                    : [json]
                ).once('message', callback),
            modules);
}

async function runInProc(modules: { path: string; args?: any }[]) {
    return runCore((modulePath: string, json: string, callback: BenchmarkCallback) => {
        setInlineEnvironment({
            json,
            send: (...args) => {
                setInlineEnvironment(undefined);
                callback(...args);
            }
        });

        const resolvedPath = path.resolve(modulePath);
        delete require.cache[resolvedPath];
        require(resolvedPath);
    }, modules);
}

const argv = minimist(process.argv.slice(2));

export const run = argv.runInBand === true
    ? runInProc
    : runOutOfProc;
