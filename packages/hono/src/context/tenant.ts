export type NewTenantInput = {
  name: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type NewTenantResponse = {
  id: string;
  description: string;
};
