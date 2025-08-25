const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add obfuscation in production
      if (env === 'production') {
        webpackConfig.plugins.push(
          new WebpackObfuscator({
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            identifierNamesGenerator: 'hexadecimal',
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: true,
            log: false,
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            transformObjectKeys: false,
            unicodeEscapeSequence: false
          })
        );
      }
      
      return webpackConfig;
    }
  }
};
