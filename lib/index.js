import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import withSideEffect from 'react-side-effect';

import {
  clone,
  defaults,
  forEach
} from './utils';

import {
  canUseDOM,
  removeDocumentMeta,
  insertDocumentMeta
} from './dom';

function reducePropsTostate ( propsList ) {
  const props = {};

  let extend = true;

  for (var i = propsList.length - 1; extend && i >= 0; i--) {
    extend = propsList[i].hasOwnProperty('extend');

    const _props = clone(propsList[i]);

    if ( _props.hasOwnProperty('description') ) {
      defaults(_props, { meta: { name: { description: _props.description } } } );
    }
    if ( _props.hasOwnProperty('canonical') ) {
      defaults(_props, { link: { rel: { canonical: _props.canonical } } } );
    }

    defaults(props, _props);
  }

  // Auto props
  if (props.auto) {
    if (props.auto.ograph) {
      ograph(props);
    }
  }

  return props;
}

function handleStateChangeOnClient(props) {
  if (canUseDOM) {
    document.title = props.title || '';
    insertDocumentMeta(getTags(props));
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

function parseTags (tagName, props = {}) {
  const tags = [];
  const contentKey = tagName === 'link' ? 'href' : 'content';
  Object.keys(props).forEach(groupKey => {
    const group = props[groupKey];
    if (typeof group === 'string') {
      tags.push({
        tagName,
        [ groupKey ]: group
      });
      return;
    }
    Object.keys(group).forEach(key => {
      const values = Array.isArray(group[key]) ? group[key] : [group[key]];
      values.forEach(value => {
        if (value !== null) {
          tags.push({
            tagName,
            [ groupKey ]: key,
            [ contentKey ]: value
          });
        }
      });
    });
  });
  return tags;
}

function getTags ( _props ) {
  return [].concat( parseTags( 'meta', _props.meta ), parseTags( 'link', _props.link ) );
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

  return renderToStaticMarkup( <div>{ tags }</div> ).replace(/(^<div>|<\/div>$)/g, '').replace(/data-rdm="true"/g, 'data-rdm');
}

class DocumentMeta extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    base: PropTypes.string,
    canonical: PropTypes.string,
    meta: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
          ])
        )
      ])
    ),
    link: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ])
      )
    ),
    auto: PropTypes.objectOf(PropTypes.bool)
  }

  render() {
    const { children } = this.props;
    const count = React.Children.count(children);
    return count === 1 ? React.Children.only(children) : ( count ? <div>{ this.props.children }</div> : null );
  }
}

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

DocumentMetaWithSideEffect.renderToStaticMarkup = function rewindAsHTML () {
  return render( DocumentMetaWithSideEffect.rewind(), { asHtml: true } );
};

export default DocumentMetaWithSideEffect;
