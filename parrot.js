`use strict`;

process.on(`SIGINT`, () => {
    console.clear();
    process.exit();
});

const package = require(`./package.json`);
const program = require(`commander`);
const fs = require(`promise-fs`);
const path = require(`path`);

const currentDir = path.dirname(require.main.filename);

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

program
    .version(package.version, `-v, --version`)
    .option(`-t, --type <type>`, `can be txt or asni`)
    .option(`-l, --loops <loops>`, `number of times to loop`)
    .option(`-d, --delay <delay>`, `frame delay in ms`)
    .parse(process.argv);

let { loops, delay, type } = program;

loops = !isNaN(loops) && loops > 0 ? loops : 1;
delay = !isNaN(delay) && delay > 0 ? delay : 75;

type = (type || ``).toLowerCase();
type = type && type === `txt` || type === `asni` ? type : `asni`;

(async () => {
    const frames = [];
    const framesCount = 10;

    for (let i = 0; i < framesCount; i++) {
        frames.push(await fs.readFile(`${currentDir}/frames/${i}.${type}`));
    }

    for (let i = 0; i < framesCount * loops; i++) {
        console.clear();

        const frame = frames[i % framesCount];
        console.log(frame.toString());
        await sleep(delay);
    }

    console.clear();
})();
