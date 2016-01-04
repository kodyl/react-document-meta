import assert from 'assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import DocumentMeta from '../';

describe('DocumentMeta', () => {
  before(() => {
    DocumentMeta.canUseDOM = false;
  });

  describe('.rewind()', () => {
    it('clears the mounted instances', () => {
      renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title: 'c'})
          )
        )
      );
      assert.deepEqual(DocumentMeta.peek(), {title: 'c'});
      DocumentMeta.rewind();
      assert.strictEqual(DocumentMeta.peek(), undefined);
    });

    it('returns the latest document meta', () => {
      const title = 'cheese';
      renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title})
          )
        )
      );
      assert.deepEqual(DocumentMeta.rewind(), { title });
    });

    it('returns undefined if no mounted instances exist', () => {
      renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title: 'c'})
          )
        )
      );
      DocumentMeta.rewind();
      assert.strictEqual(DocumentMeta.peek(), undefined);
    });
  });

  describe('.renderAsReact()', () => {
    it('returns an empty array if no meta data has been mounted', () => {
      React.createElement(DocumentMeta, {title: 'a'},
        React.createElement(DocumentMeta, {title: 'b'},
          React.createElement(DocumentMeta, {title: 'c'})
        )
      );

      const rendered = DocumentMeta.renderAsReact();
      assert.ok(Array.isArray(rendered));
      assert.strictEqual(rendered.length, 0);
    });

    it('returns the latest document meta as an array of React components', () => {
      renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title: 'c'})
          )
        )
      );

      const rendered = DocumentMeta.renderAsReact();
      assert.ok(Array.isArray(rendered));
      assert.strictEqual(rendered.length, 1);
      assert.strictEqual(rendered[0].type, 'title');
      assert.strictEqual(rendered[0].props.children, 'c');
    });
  });

  describe('.renderAsHTML()', () => {
    it('returns an empty string if no meta data has been mounted', () => {
      React.createElement(DocumentMeta, {title: 'a'},
        React.createElement(DocumentMeta, {title: 'b'},
          React.createElement(DocumentMeta, {title: 'c'})
        )
      );
      assert.strictEqual(DocumentMeta.renderAsHTML(), '');
    });

    it('returns the latest document meta as HTML', () => {
      renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title: 'c'})
          )
        )
      );
      assert.strictEqual(DocumentMeta.renderAsHTML(), '<title>c</title>');
    });
  });


  describe('container element with children', () => {
    it('renders the children', () => {
      const title = 'foo';
      const markup = renderToStaticMarkup(
        <DocumentMeta title={ title }>
          <div>Child element</div>
        </DocumentMeta>
      );

      assert.strictEqual(markup, '<div>Child element</div>');
      assert.deepEqual(DocumentMeta.rewind(), { title });
    });
  });
});
