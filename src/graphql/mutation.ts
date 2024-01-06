import { createNewTenant } from '../context/identity/tenant.js';
import { builder } from './builder.js';


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
