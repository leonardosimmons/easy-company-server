export type AccessToken = {
  readonly token: string;
};

export type Combinable = string | number;

export type HttpError = Error & {
  log?: string;
  statusCode?: number;
};
