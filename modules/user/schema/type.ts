import { objectType } from "nexus";

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.nonNull.string('firstname')
    t.string('lastname')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('role')
    t.nonNull.string('status')
    t.nonNull.int('permissionLevel')
  },
});
