import { accept, claim } from '../context/identity/invitation.js';
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


builder.mutationFields((t) => ({
  createTenant: t.field({
    type: 'NewTenantResponse',
    args: {
      input: t.arg({ type: 'NewTenantInput', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await createNewTenant(context, args.input);

        return response;
      } catch (error) {
        // TODO:
        console.error(error);
        throw error;
      }
    },
  }),

  claimInvitation: t.field({
    type: 'Boolean',
    args: {
      inviteCode: t.arg({ type: 'String', required: true }),
      password: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await claim(context, args.inviteCode, args.password);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  acceptInvitation: t.field({
    type: 'Boolean',
    args: {
      inviteId: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await accept(context, args.inviteId);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),
}));
