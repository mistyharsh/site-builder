import * as invitation from '../context/identity/invitation.js';
import { createNewTenant, getTenants } from '../context/identity/tenant.js';
import { getUsers } from '../context/identity/user.js';
import { builder } from './builder.js';

// INPUT TYPES
builder.inputType('NewTenantInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

builder.inputType('NewInvitationInput', {
  fields: (t) => ({
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

// OBJECT TYPES
builder.objectType('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
  }),
});

builder.objectType('Tenant', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
  }),
});

// MUTATION OBJECT TYPES
builder.objectType('NewTenantResponse', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
  }),
});

// QUERY API
builder.queryFields((t) => ({

  getTenants: t.field({
    type: ['Tenant'],

    async resolve(_parent, _args, context) {
      try {
        const response = await getTenants(context);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  getUsers: t.field({
    type: ['User'],

    args: {
      tenantId: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await getUsers(context, args.tenantId);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),
}));

// MUTATION API
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
        const response = await invitation.claim(context, args.inviteCode, args.password);

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
        const response = await invitation.accept(context, args.inviteId);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  inviteUser: t.field({
    type: 'Boolean',
    args: {
      tenantId: t.arg({ type: 'String', required: true }),
      input: t.arg({ type: 'NewInvitationInput', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await invitation.invite(context, args.tenantId, args.input);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),
}));
