export function bindEventCreators(config = {}, send) {
  return Object.entries(config).reduce(
    (result, [key, value]) => {
      if (typeof value === 'function')
        result[key] = function (...args) {
          return send(value(...args));
        };
      else
        result[key] = () => send(value);

      return result;
    },
    []
  );
}

export function get(object, path, _default) {
  const steps = Array.isArray(path) ? path : path.split('.');

  try {
    return steps.reduce((val, step) => val[step], object);
  } catch (e) {
    return _default;
  }
}


export function groupBy(objects, fn) {
  return objects.reduce((result, obj) => {
    const key = fn(obj);

    return Object.assign(result, {
      [key]: result[key] ? result[key].concat(obj) : [obj]
    })
  }, {});
}