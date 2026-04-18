import { cacheService, cacheVersionService } from '@/infra/cache';

import { UserRepository, UserService, UserCacheVersion } from './core';

import { CredentialRepository, CredentialService } from './credential';

import { IdentityRepository, IdentityService } from './identity';

import { ProviderRepository, ProviderService } from './provider';

const userRepository = new UserRepository();
const credentialRepository = new CredentialRepository();
const identityRepository = new IdentityRepository();
const providerRepository = new ProviderRepository();

const userCacheVersion = new UserCacheVersion(cacheVersionService);

export const userService = new UserService(userRepository, cacheService, userCacheVersion);
export const credentialService = new CredentialService(credentialRepository);
export const identityService = new IdentityService(identityRepository, cacheService);
export const providerService = new ProviderService(providerRepository);
