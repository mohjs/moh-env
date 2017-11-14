'use strict'

const debug = require('moh-logger').debug('moh-env')
const { info, warn, error} = require('moh-logger')

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const generateDefaultInfo = (config) => {
    // TODO: generate default config, and env config info.
    config
}

const init = (options) => {
    let configFolder = 'envs'
    let encoding = 'utf8'
    let defaultConfig = null
    let envConfigs = {
        development: null,
        test: null,
        staging: null,
        production: null
    }

    if (fs.existsSync(configFolder)) {
        const configFiles = fs.readdirSync(configFolder, encoding)
        const configs = configFiles.map((filepath) =>
            yaml.safeLoad(fs.readFileSync(path.join(configFolder, filepath), encoding)))
        
        configFiles.map(fileName => fileName.split('.')[0])
            .map((envName, index) => {
                if (envName === 'default') {

                    defaultConfig = generateDefaultInfo(configs[index])
                    debug(`>>> Default config: ${JSON.stringify(defaultConfig)}`)
                }
            
                Object.keys(envConfigs).forEach((name) => {
                    if (name === envName) {
                        envConfigs[name] = Object.assign({}, /*defaultConfig,*/ configs[index]) // TODO: merge default info
                        debug(`>>> Config for ${name}: ${JSON.stringify(envConfigs[name])}`)
                    }
                })

            })
        
        const finalConfig = envConfigs[process.env.NODE_ENV || 'development']
        debug('>>> Final Config', finalConfig)
        
        if(!finalConfig) {
            warn(`>>> No configs found for [${process.env.NODE_ENV}], please check the configs rule.`)
        } else {
            info('>>> Configs load completed');
            return finalConfig
        }
    } else {
        warn(`>>> No folder [${configFolder}] found in the path. Failed to load env configs...`)
    }
}

init()

exports.init = init