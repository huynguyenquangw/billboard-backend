export enum StatusType {
  PENDING = 'PENDING',

  // billboard status
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RENTED = 'RENTED',

  // plan status
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',

  // subscription status
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',

  // contract status
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',

  DELETED = 'DELETED',
}
