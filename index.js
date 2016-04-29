const _ = require('lodash');
const debug = require('debug')('push2cloud-compiler-cf-app-versioning');

const versioning = (config, mani, t, next) => {
  debug('Add version of app');
  const setVersionToName = (app) => {
    const name = `${app.name}-${app.version}`;
    debug(name);
    return _.assign({}, app, { name: name, unversionedName: app.name });
  };

  const setVersionFromApp = (propName) => (a) => {
    propName = propName || 'app';
    const app = _.find(config.apps, (fa) => fa.name === a[propName]);
    if (!app) return a;
    const name = `${app.name}-${app.version}`;
    debug(name);
    var v = {};
    v[propName] = name;
    v.unversionedName = app.name;
    return _.assign({}, a, v);
  };

  const versionedApps = _.map(config.apps, setVersionToName);
  const versionedServiceBindings = _.map(config.serviceBindings, setVersionFromApp());
  const versionedRoutes = _.map(config.routes, setVersionFromApp());
  const versionedEnv = _.map(config.envVars, setVersionFromApp('name'));

  next(null, _.assign({}, config, {
    apps: versionedApps
  , serviceBindings: versionedServiceBindings
  , routes: versionedRoutes
  , envVars: versionedEnv
  }), mani, t);
};

module.exports = versioning;
