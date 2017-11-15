const test = require('ava')
const completeEnvs = require('../').init('./tests/fix/complete-envs')

test('complete envs files', t => {
    t.plan(4)
    t.is(completeEnvs.serverFoo.host, 'http://ole3021.me', 'Env varialbe should overwrite default value')
    t.is(completeEnvs.serverFoo.port, 3021, 'Env variable should be overwrite with process env')
    t.is(completeEnvs.serverBar.host, 'http://ole3021.me', 'Env variable should overwrite null value')
    t.is(completeEnvs.serverBar.port, 3021, 'Env variable should be overwrite with process env')
})
