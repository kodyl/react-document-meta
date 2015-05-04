import React from 'react';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import createSideEffect from 'react-side-effect';

import {
  clone,
  defaults,
  forEach,
  isValidProp
} from './utils';

let _meta = {};

function getProps ( propsList ) {
  const props = {};

  let extend = true;

  for (var i = propsList.length - 1; extend && i >= 0; i--) {
    const _props = clone(propsList[i]);

    if ( _props.description ) {
      defaults(_props, { meta: { name: { description: _props.description } } } );
    }
    if ( _props.canonical ) {
      defaults(_props, { link: { rel: { canonical: _props.canonical } } } );
    }


    defaults(props, _props);
    extend = _props.hasOwnProperty('extend');
  };

  // ograph( props );

  return props;
}

function ograph ( p ) {
/*  const og = p.ograph;
  if ( og ) {
    if ( p.title && !og.title ) {
      p.tags.push({ property: 'og:title', content: p.title });
    }
    if ( p.description && !og.description ) {
      p.tags.push({ property: 'og:description', content: p.description });
    }
    if ( p.canonical && !og.url ) {
      p.tags.push({ property: 'og:url', content: p.canonical });
    }

    Object.keys(og).reduce(( acc, key ) => {
      acc.push({ property: 'og:'+key, content: og[key] });
      return acc;
    }, p.tags);
  }
*/
  return p;
}

function parseTags ( tagName, props = {} ) {
  const tags = [];
  Object.keys( props ).forEach(( prop ) => {
    Object.keys( props[prop] ).forEach(( key ) => {
      tags.push({
        tagName,
        [ prop ]: key,
        content: props[prop][key]
      });
    });
  });
  return tags;
}

function getTags ( _props ) {
  return [].concat( parseTags( 'meta', _props.meta ), parseTags( 'link', _props.link ) );
}


function removeNode ( node ) {
  node.parentNode.removeChild(node);
}

function removeDocumentMeta () {
  forEach(document.querySelectorAll('head [data-rdm]'), removeNode);
}

function insertDocumentMeta ( props ) {
  removeDocumentMeta();

  forEach( getTags( props ), insertDocumentMetaNode);
}

function insertDocumentMetaNode ( entry ) {
  const { tagName, ...attr } = entry;

  var newNode = document.createElement( tagName );
  for (var prop in attr) {
    if (entry.hasOwnProperty(prop)) {
      newNode.setAttribute(prop, entry[prop]);
    }
  }
  newNode.setAttribute('data-rdm', '');
  document.getElementsByTagName('head')[0].appendChild(newNode);
}

function render ( meta, opts ) {
  if ( typeof opts !== 'object' ) {
    return meta;
  }

  let i = 0;
  const tags = [];

  function renderTag ( entry ) {
    const { tagName, ...attr } = entry;

    if ( tagName === 'meta' ) {
      return ( <meta {...attr} key={ i++ } data-rdm /> );
    }
    else if ( tagName === 'link' ) {
      return ( <link {...attr} key={ i++ } data-rdm /> );
    }

    return null;
  }

  if ( meta.title ) {
    tags.push( <title key={ i++ }>{ meta.title}</title> );
  }

  getTags( meta ).reduce(( acc, entry ) => {
    tags.push( renderTag(entry) );
    return tags;
  }, tags);

  if ( opts.asReact ) {
    return tags;
  }

  return React.renderToStaticMarkup( <div>{ tags }</div> ).replace(/(^<div>|<\/div>$)/g, '');
}

function handleChange ( propsList ) {
  _meta = getProps( propsList );

  if ( canUseDOM ) {
    document.title = _meta.title || '';
    insertDocumentMeta( _meta );
  }
}

const mixin = {
  displayName: 'DocumentMeta',

  propTypes: {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    canonical: React.PropTypes.string,
    meta: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.string)),
    link: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.string))
  },

  statics: {
    peek: function () {
      return _meta;
    },

    rewind: function ( opts ) {
      const meta = clone(_meta);
      this.dispose();
      return render( meta, opts );
    }
  }
};

const DocumentMeta = createSideEffect( handleChange, mixin );

export default DocumentMeta;
