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

  if (props.auto) {
    autoProps( props );
  }

  return props;
}

function autoProps ( props ) {
  if (props.auto.ograph === true) {
    ograph(props);
  }

  return props;
}

function ograph ( p ) {
  if (!p.meta) {
    p.meta = {};
  }
  if (!p.meta.property) {
    p.meta.property = {};
  }

  const group = p.meta.property;
  if ( group ) {
    if ( p.title && !group['og:title'] ) {
      group['og:title'] = p.title;
    }
    if ( p.description && !group['og:description'] ) {
      group['og:description'] = p.description;
    }
    // if ( p.canonical && !group['og:url'] ) {
    //   group['og:url'] = p.canonical;
    // }
  }
  return p;
}

function parseTags ( tagName, props = {} ) {
  const tags = [];
  Object.keys( props ).forEach(( groupKey ) => {
    const group = props[groupKey];
    if (typeof group === 'string') {
      tags.push({
        tagName,
        [ groupKey ]: group
      });
      return;
    }
    Object.keys( group ).forEach(( key ) => {
      tags.push({
        tagName,
        [ groupKey ]: key,
        content: group[key]
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
    meta: React.PropTypes.objectOf(React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.objectOf(React.PropTypes.string)])),
    link: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.string)),
    auto: React.PropTypes.objectOf(React.PropTypes.bool)
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
