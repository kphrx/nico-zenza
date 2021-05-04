
import {
  AuthorName,
  UserScriptMetadata,
} from './types';
import packageMetadata from '../../package.json';

interface Package {
  name: string;
  version: string;
  description: string;
  homepage: string;
  // old {type:string;url:string}, licenses: {type:string;url:string}[];
  license: string;
  author: AuthorName | string;
  contributors: (AuthorName | string)[];
  repository: {
    type: string;
    url: string;
    directory?: string;
  } | string;
  dependencies: {[key: string]: string};
}

const {
  name,
  version,
  description,
  license,
  author,
  contributors,
  homepage,
} = packageMetadata as Partial<Package>;

export const baseMetadata: UserScriptMetadata = {
  namespace: 'https://kpherox.dev/',
  name,
  version,
  description,
  license,
  author,
  contributor: contributors,
  // source: repository.url,
  homepageURL: homepage,
  grant: 'none',
};

export default packageMetadata as Partial<Package>;
