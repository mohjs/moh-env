const test = require('ava')
const onlyEnvs = require('../').init('./tests/fix/only-envs')

test('only envs files', t => {
    t.plan(2)
    t.is(onlyEnvs.serverFoo.host, 'http://ole3021.me', 'Env varialbe should be exist')
    t.is(onlyEnvs.serverBar.host, 'http://ole3021.me', 'Env variable should be exist')
})