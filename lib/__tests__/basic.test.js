import assert from 'assert';
import React from 'react/addons';
import DocumentMeta from '../';

describe('DocumentMeta', () => {
  before(() => {
    DocumentMeta.canUseDOM = false;
  });

  describe('.rewind()', () => {
    it('clears the mounted instances', () => {
      React.renderToStaticMarkup(
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
      React.renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title})
          )
        )
      );
      assert.deepEqual(DocumentMeta.rewind(), { title });
    });

    it('returns undefined if no mounted instances exist', () => {
      React.renderToStaticMarkup(
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
      React.renderToStaticMarkup(
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
      assert.strictEqual(rendered[0]._store.props.children, 'c');
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
      React.renderToStaticMarkup(
        React.createElement(DocumentMeta, {title: 'a'},
          React.createElement(DocumentMeta, {title: 'b'},
            React.createElement(DocumentMeta, {title: 'c'})
          )
        )
      );
      assert.strictEqual(DocumentMeta.renderAsHTML(), '<title>c</title>');
    });
  });

});
