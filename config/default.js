'use strict';


module.exports = {
  history:{
    filePath: './history.json'
  },
  application: {
    port: 3000,
    srapperUrl: 'http://localhost:3000/api/search/'
  },
  redis: {
      options: {
          host: 'localhost',
          port: '6379'
      },
      cache: {
          prefix: 'cache',
          expires: 60 * 60 * 1
      }
  },
  swagger: {
    appRoot: './',
    swaggerFile: './api/swagger/swagger.json',
    fittingsDirs: [
      'middleware',
      'node_modules'
    ],
    defaultPipe: null,
    swaggerControllerPipe: 'swagger_controllers',
    bagpipes: {
      _router: {
        name: 'swagger_router',
        mockMode: false,
        mockControllersDirs: [],
        controllersDirs: [
          'controllers'
        ]
      },
      _swagger_validate: {
        name: 'swagger_validator',
        validateResponse: true
      },
      _swagger_params_parser: {
        name: 'swagger_params_parser',
        jsonOptions: {},
        urlencodedOptions: {
          extended: true
        }
      },
      swagger_controllers: [
        'swagger_security',
        '_swagger_params_parser',
        'expressParams',
        'request_validation',
        'express_compatibility',
        '_router'
      ],
      swagger_raw: {
        name: 'swagger_raw'
      }
    }
  }
};
