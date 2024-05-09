import { faker } from '@faker-js/faker'
import { NewTenantInput } from '../../src/context.js'

export function createRandomTenant(): NewTenantInput {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const description = faker.person.bio();
  const email = faker.internet.email({firstName: firstName, lastName: lastName});
  return {
    name: `${firstName} ${lastName}`,
    description: description,
    invitation: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    }
  }
}
