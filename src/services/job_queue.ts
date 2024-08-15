import Queue from 'queue';

import {speed} from '../models';
import { instruction_steps } from '../models';

const queue = new Queue({
    concurrency: 1,
    autostart: true,
})

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function queueStep(callback) {
    queue.push(async () => {
        await sleep(speed.value);
        callback();
    });
}

// TODO: Implement dependency injection.
function appendInstruct(message: string) {
    queue.push(async () => {
        await sleep(speed.value);
        instruction_steps.value.push(message);
    });
}

export {queueStep, appendInstruct, sleep};