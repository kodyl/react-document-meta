export function clone ({ title, description, base, canonical, meta, link, auto }) {
  try {
    return JSON.parse(JSON.stringify({ title, description, base, canonical, meta, link, auto }));
  }
  catch(x) {
    return {};
  }
}

export function defaults ( target, source ) {
  return Object.keys( source ).reduce(( acc, key ) => {
    if ( !target.hasOwnProperty( key ) ) {
      target[key] = source[key];
    }
    else if ( typeof target[key] === 'object' && !Array.isArray( target[key] ) && target[key] ) {
      defaults( target[key], source[key] );
    }

    return target;
  }, target);
}

export function forEach ( arr, fn ) {
  Array.prototype.slice.call( arr || [] ).forEach( fn );
}
