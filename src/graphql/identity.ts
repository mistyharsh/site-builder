import { createNewTenant } from '../context/identity/tenant.js';
import { builder } from './builder.js';


builder.inputType('NewTenantInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

builder.objectType('NewTenantResponse', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
  }),
});

builder.mutationField('createTenant', (t) => t.field({
  type: 'NewTenantResponse',
  args: {
    input: t.arg({ type: 'NewTenantInput', required: true }),
  },
  async resolve(root, args, context) {
    try {
      const response = await createNewTenant(context, args.input);

      return response;
    } catch (error) {
      // TODO:
      console.error(error);
      throw error;
    }
  },
}));
