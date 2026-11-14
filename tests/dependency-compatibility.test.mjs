import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deepmerge } from 'deepmerge-ts';
import { Effect } from 'effect';
import { withDOM } from '@lexical/headless/dom';
import { createHeadlessEditor } from '@lexical/headless';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';

test('patched deepmerge preserves nested Prisma config merge contract and handles cycles without stack exhaustion', () => {
  assert.deepEqual(deepmerge({ datasource: { url: 'fixture-local' }, migrate: { paths: ['a'] } }, { migrate: { paths: ['b'] }, schema: 'fixture.prisma' }), { datasource: { url: 'fixture-local' }, migrate: { paths: ['a', 'b'] }, schema: 'fixture.prisma' });
  const a = {}; a.self = a; const b = {}; b.self = b;
  try { deepmerge(a, b); } catch (error) { assert.notEqual(error.name, 'RangeError'); }
});
test('patched Effect retains schema/config runtime primitives used by Prisma 6', async () => {
  assert.equal(await Effect.runPromise(Effect.succeed('configuration-ready')), 'configuration-ready');
});
test('patched Happy DOM works with the actual Lexical headless DOM conversion used by Payload', () => {
  const previousWindow = globalThis.window;
  const editor = createHeadlessEditor({ namespace: 'qa-security-compatibility', onError(error) { throw error; } });
  withDOM(window => {
    editor.update(() => {
      const document = new window.DOMParser().parseFromString('<p>Budaya <strong>angklung</strong></p>', 'text/html');
      $getRoot().append(...$generateNodesFromDOM(editor, document));
    }, { discrete: true });
    const html = editor.getEditorState().read(() => $generateHtmlFromNodes(editor));
    assert.ok(html.includes('angklung')); assert.ok(html.includes('<p'));
  });
  assert.equal(globalThis.window, previousWindow);
});
