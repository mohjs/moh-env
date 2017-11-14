# moh-env
environment management for moh

## Feature

* Use yaml to manage env configs
* Good structured and named env configs files for different environment
* Easily to mange env variable `type`, `process key`, `default value`, and `descriptions`
* Auto managed default values, and auto overwritten `process values` to `env configed values` to `default values`
* Easy to get listed env configs description, helpful for devops and other users
* Easy manages secret env config infos

## TODO
- [ ] Easy generate env configurate info


### default.yml
```yaml
# type, env key, default value, description
serverFoo:
  host: ['string', 'SERVER_FOO_HOST', 'http://ole3021.me:3021','The host of server foo, eg: http://foo.com/3322']
serverBar:
  host: ['string', 'SERVER_BAR_HOST', ~, 'The host of server bar, eg: http://foo.com/3322 [required]']
```

### development.yml
```yaml
serverBar:
  host: http://ole3021.me
  port: 3021
```