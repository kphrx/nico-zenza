
import {
  PeopleField,
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
  author: PeopleField;
  contributors: PeopleField[];
  repository: {
    type: string;
    url: string;
    directory?: string
  } | string;
  dependencies: {[key: string]: string};
}

const {
  name,
  version,
  description,
  homepage,
  license,
  author,
  contributors,
  repository,
  dependencies,
} = packageMetadata as Partial<Package>;

const baseMetadata: UserScriptMetadata = {
  'namespace': 'https://kpherox.dev/',
  version,
  author,
  description,
  license,
  // 'source': repository.url,
  'homepageURL': homepage,
  'grant': 'none',
  'run-at': 'document-body',
};

export {
  baseMetadata,
  name,
  version,
  description,
  homepage,
  license,
  author,
  contributors,
  repository,
  dependencies,
};
