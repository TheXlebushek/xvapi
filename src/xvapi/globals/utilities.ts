import * as url from 'url';

export function parse(URL: string): Map<string, string> {
  const searchArray = url.parse(URL).hash.substring(1).split('&');
  const searchMap = new Map<string, string>();
  searchArray.forEach((search) => {
    searchMap.set(search.split('=')[0], search.split('=')[1]);
  });
  return searchMap;
}

export type Config = {
  language: string;
};

export type Credentials = {
  login: string;
  password: string;
  uuid: string;
};
