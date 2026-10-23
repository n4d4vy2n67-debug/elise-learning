import test from 'node:test';
import assert from 'node:assert/strict';
import {FirestoreStore} from '../v4/server/store.mjs';
test('Firestore exposes scoped session operations',()=>{
  const store=new FirestoreStore({});
  assert.equal(typeof store.transactSession,'function');
});
