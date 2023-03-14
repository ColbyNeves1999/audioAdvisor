type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type AuthRequest = {
  email: string;
  password: string;
};

type spotAuth = {
  access_token: string;
  token_type: string;
  scope: string;
  expires: number;
  refresh_token: string;
};
