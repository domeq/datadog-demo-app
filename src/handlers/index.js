const fetch = require('node-fetch');
const ddTrace = require('dd-trace');

const tracer = ddTrace.init({
    logInjection: true,
    analytics: false, // Explicitly turn off App Analytics
    trackAsyncScope: false, // https://github.com/DataDog/dd-trace-js/releases/tag/v0.16.0
    runtimeMetrics: true, // https://docs.datadoghq.com/tracing/runtime_metrics/nodejs/
});
tracer.use('http', { splitByDomain: true });

module.exports.handler = async (event) => {
    const [googleResponse, githubResponse] = await Promise.all([
        fetch('https://www.google.com').then(res => res.text()),
        fetch('https://github.com').then(res => res.text()),
    ]);

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            status: 'success',
            googleResponse,
            githubResponse,
        }),
    };
};
