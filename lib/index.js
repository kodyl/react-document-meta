import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { canUseDOM } from 'exenv';
import withSideEffect from 'react-side-effect';

import {
  clone,
  defaults,
  forEach
} from './utils';

function reducePropsTostate ( propsList ) {
  const props = {};

  let extend = true;

  for (var i = propsList.length - 1; extend && i >= 0; i--) {
    const _props = clone(propsList[i]);

    if ( _props.hasOwnProperty('description') ) {
      defaults(_props, { meta: { name: { description: _props.description } } } );
    }
    if ( _props.hasOwnProperty('canonical') ) {
      defaults(_props, { link: { rel: { canonical: _props.canonical } } } );
    }

    defaults(props, _props);
    extend = _props.hasOwnProperty('extend');
  }

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

function handleStateChangeOnClient ( props ) {
  if ( canUseDOM ) {
    document.title = props.title || '';
    insertDocumentMeta( props );
  }
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
    if ( p.hasOwnProperty('description') && !group['og:description'] ) {
      group['og:description'] = p.description;
    }
    if ( p.hasOwnProperty('canonical') && !group['og:url'] ) {
      group['og:url'] = p.canonical;
    }
  }
  return p;
}

function parseTags ( tagName, props = {} ) {
  const tags = [];
  const contentKey = tagName === 'link' ? 'href' : 'content';
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
      const values = Array.isArray(group[key]) ? group[key] : [group[key]];
      values.forEach(( value ) => {
        if (value === null ) {
          return;
        }
        tags.push({
          tagName,
          [ groupKey ]: key,
          [ contentKey ]: value
        });
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

function insertDocumentMeta ( props ) {
  removeDocumentMeta();

  forEach( getTags( props ), insertDocumentMetaNode);
}

function render ( meta = {}, opts ) {
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
    if ( tagName === 'link' ) {
      return ( <link {...attr} key={ i++ } data-rdm /> );
    }
    return null;
  }

  if ( meta.title ) {
    tags.push( <title key={ i++ }>{ meta.title }</title> );
  }

  getTags( meta ).reduce(( acc, entry ) => {
    tags.push( renderTag(entry) );
    return tags;
  }, tags);

  if ( opts.asReact ) {
    return tags;
  }

  return renderToStaticMarkup( <div>{ tags }</div> ).replace(/(^<div>|<\/div>$)/g, '');
}

const DocumentMeta = React.createClass({
  displayName: 'DocumentMeta',

  propTypes: {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    canonical: React.PropTypes.string,
    meta: React.PropTypes.objectOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.objectOf(
          React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)
          ])
        )
      ])
    ),
    link: React.PropTypes.objectOf(
      React.PropTypes.objectOf(
        React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.arrayOf(React.PropTypes.string)
        ])
      )
    ),
    auto: React.PropTypes.objectOf(React.PropTypes.bool)
  },

  render: function render () {
    const { children } = this.props;
    const count = React.Children.count(children);
    return count === 1 ? React.Children.only(children) : ( count ? <div>{ this.props.children }</div> : null );
  }
});

const DocumentMetaWithSideEffect = withSideEffect(
  reducePropsTostate,
  handleStateChangeOnClient
)(DocumentMeta);

DocumentMetaWithSideEffect.renderAsReact = function rewindAsReact () {
  return render( DocumentMetaWithSideEffect.rewind(), { asReact: true } );
};

DocumentMetaWithSideEffect.renderAsHTML = function rewindAsHTML () {
  return render( DocumentMetaWithSideEffect.rewind(), { asHtml: true } );
};

export default DocumentMetaWithSideEffect;
