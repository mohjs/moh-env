# moh-env

environment management for moh

## Feature

* Use yaml to manage env configs
* Good structured and named env configs files for different environment
* Easily to mange env variable `type`, `process key`, `default value`, and `descriptions`
* Auto managed default values, and auto overwritten `process values` to `env configed values` to `default values`
* Easy to get listed env configs description, helpful for devops and other users
* Easy manages secret env config infos

## Install

```bash
# with yarn
$ yarn add moh-env --save

# with npm
$ npm install moh-env --save
```

## Usage

1.  default folder is `env` int he root of the project
2.  in the folder should include `default.yml`, `development.yml`, `test.yml`, `staging.yml`, `production.yml`
3.  the `default.yml` should be like below, to config the value type, env variable name, default value, and description

### default.yml

```yaml
# type supprot: 'string', 'number', 'Boolean', 'Date', null/~
# type, env key, default value, description
serverFoo:
  host: ['string', 'SERVER_FOO_HOST', 'http://ole3021.me:3021','The host of server foo, eg: http://foo.com/3322']
  port: ['string', 'SERVER_FOO_PORT', ~, 'The prot of server foo, eg: 3021']
serverBar:
  host: ['string', 'SERVER_BAR_HOST', ~, 'The host of server bar, eg: http://foo.com/3322 [required]']
```

4.  Add as many environment related config as you need, the `development.yml` like below

### development.yml

```yaml
serverBar:
  host: http://ole3021.me
  port: 3021
```

### Init in project

```javascript
const envs = require('moh-env').init()

const host = envs.serverBar.host
```

### generated env configs

```javascript
{
  serverFoo: {
    host: 'http://ole3021.me:3021'
    port: 3021
  },
  serverBar: {
    host: 'http://ole3021.me'
  }
}
```
