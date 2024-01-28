export type Entity = {
  id: string;
};

export type Gender = 'male' | 'female' | 'other' | 'unknown';

export type Party = {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Organization = {
  id: string;
  name: string;
};

export type Person = {
  id: string;

  givenName: string;
  middleName: string;
  familyName: string;

  dob: Date | null;
  gender: Gender;
};

export type OrgPeople = {
  id: string;
  organizationId: string;
  personId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type PartyAddress = {
  id: string;
  partyId: string;

  house: string;
  street: string;
  landmark: string;
  postalCodeId: string | null;
  isPrimary: boolean;

  updatedAt: Date;
};

export type PartyEmail = {
  id: string;
  partyId: string;

  address: string;
  isPrimary: boolean;

  updatedAt: Date;
};

export type PartyPhone = {
  id: string;
  partyId: string;

  number: string;
  countryId: string;
  isPrimary: boolean;

  updatedAt: Date;
};
