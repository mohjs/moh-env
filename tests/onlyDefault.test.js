const test = require('ava')
const onlyDefault = require('../').init('./tests/fix/only-default')

test('only default files', t => {
    t.plan(4)
    t.is(onlyDefault.serverFoo.host, 'http://ole3021.me:3021', 'Env varialbe should be exist')
    t.is(onlyDefault.serverFoo.port, 3021, 'Env varialbe should be exist')
    t.is(onlyDefault.serverBar.host, null, 'Env varialbe should be null')
    t.is(onlyDefault.serverBar.port, 3021, 'Env variable overwrite with default process env value')
})