'use strict'

const debug = require('moh-logger').debug('moh-env')
const { info, warn, error} = require('moh-logger')

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

let defaultFolder = 'envs'
let defaultEncoding = 'utf8'
let defaultConfig = null
let envConfigs = {
  development: null,
  test: null,
  staging: null,
  production: null
}

let finalConfig = {}
let configDesc = {}

const P = 'p'
const E = 'e'
const D = 'd'

const loadAllConfigs = (folder, encoding) => {
  const configFiles = fs.readdirSync(folder, encoding)
  const configs = configFiles.map((filepath) =>
    yaml.safeLoad(fs.readFileSync(path.join(folder, filepath), encoding)))
    
  configFiles.map(fileName => fileName.split('.')[0])
    .map((envName, index) => {
      debug(`>>> load config file ${envName}`)
      
      if (envName === 'default') {
        defaultConfig = configs[index]
        debug(`>>> Default config: ${JSON.stringify(defaultConfig)}`)
      }
  
      Object.keys(envConfigs).forEach((name) => {
        if (name === envName) {
          envConfigs[name] = configs[index]
          debug(`>>> Config for ${name}: ${JSON.stringify(envConfigs[name])}`)
        }
      })
    })
}

const generateValue = (itemName, key, vals) => {
  const exist = type => vals.indexOf(type) >= 0
  const envConfig = envConfigs[process.env.NODE_ENV || 'development']  
  
  const requiredType = defaultConfig[itemName][key][0]
  const existDefaultValue = defaultConfig[itemName][key][2] ||
    process.env[defaultConfig[itemName][key][1]] ||
    (envConfig && envConfig[itemName] && envConfig[itemName][key])
  if (requiredType && existDefaultValue) {
    const confValue = (exist(P) ? process.env[defaultConfig[itemName][key][1]] : null) || 
    (exist(E) ? envConfig[itemName][key] : null) ||
    (exist(D) ? defaultConfig[itemName][key][2] : null)
    switch(requiredType) {
      case 'String':
      case 'string':
        return String(confValue)
      case 'Number':
      case 'number':
        return Number(confValue)
      case 'Boolean':
      case 'boolean':
        return Boolean(confValue)
      case 'Date':
      case 'date':
        return new Date(confValue)
      default:
        return value
    }
  } else {
    // P: process env value
    // E: env configured value
    // D: default value
    return (exist(P) ? process.env[defaultConfig[itemName][key][1]] : null) || 
      (exist(E) ? envConfig[itemName][key] : null) ||
      (exist(D) ? defaultConfig[itemName][key][2] : null)
  }
}

const generateConfigsAndDesc = (defaultConfig, envConfig) => {
  if (defaultConfig) {
    Object.keys(defaultConfig).map(itemName => {
      Object.keys(defaultConfig[itemName]).reduce((config, key) => {
        const defaultValue = defaultConfig[itemName][key][2]
  
        config[itemName] = config[itemName] || {}
        const envName = defaultConfig[itemName][key][1]
        if (envName) {
          configDesc[envName] = defaultConfig[itemName][key][3] || 'No Desc'
        }
        
        if (envConfig && envConfig[itemName]) {
          if (defaultValue) {
            config[itemName][key] = generateValue(itemName, key, [P, E, D])
          } else {
            const keyValue = generateValue(itemName, key, [P, E])
            if (keyValue) {
              config[itemName][key] = keyValue
            } else {
              warn(`>>> Env config ${defaultConfig[itemName][key][1] ? defaultConfig[itemName][key][1] : `[${itemName}][${key}]`} has no value.`)
            }
          }
        } else {
          if (defaultValue) {
            config[itemName][key] = generateValue(itemName, key, [P, D])
          } else {
            warn(`>>> Env config ${defaultConfig[itemName][key][1] ? defaultConfig[itemName][key][1] : `[${itemName}][${key}]`} has no value.`)
            config[itemName][key] = generateValue(itemName, key, [P, D])
          }
        }
        return config
      }, finalConfig)
    })
  } else {
    finalConfig = envConfig
  }
  
}

const init = (optionPath=null, optionEncode=null) => {

  const configFolder = optionPath || defaultFolder
  const configEncoding = optionEncode || defaultEncoding
  if (fs.existsSync(configFolder)) {
    loadAllConfigs(configFolder, configEncoding)
    
    console.log('>>> env', process.env.NODE_ENV)
    const envConfig = envConfigs[process.env.NODE_ENV || 'development']

    generateConfigsAndDesc(defaultConfig, envConfig)

    debug('>>> Final Config', finalConfig)
    debug('>>> Config Desc', configDesc)
      
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

exports.init = init