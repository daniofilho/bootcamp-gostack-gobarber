/**
 * Definindo qual a pasta padrão para evitar ficar dando ../../ nos imports
 */
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ])
);
