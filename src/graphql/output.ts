import { NewTenantResponse } from '../context/identity/tenant.js';
import { builder } from './builder.js';

builder.objectRef<NewTenantResponse>('NewTenantResponse').implement({
  description: 'A new tenant with an invite',
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
  }),
});
