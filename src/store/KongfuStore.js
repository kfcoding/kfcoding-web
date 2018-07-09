import { types, getParent } from 'mobx-state-tree';

export const Konfgu = types
  .model('Kongfu', {
    id: types.string,
    name: types.string
  });

export const KongfuStore = types
  .model('KonfuStore', {
    kongfus: types.array(Konfgu)
  });