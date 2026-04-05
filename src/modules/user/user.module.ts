import { cacheService } from '@/core/cache';
import { UserRepository } from './core/user.repository';
import { UserService } from './core/user.service';
import { CredentialRepository } from './credential/credential.repository';
import { IdentityRepository } from './identity/identity.repository';
import { IdentityService } from './identity/identity.service';
import { CredentialService } from './credential/credential.service';

const userRepository = new UserRepository();
const credentialRepository = new CredentialRepository();
const identityRepository = new IdentityRepository();

export const userService = new UserService(userRepository, cacheService);
export const credentialService = new CredentialService(credentialRepository, cacheService);
export const identityService = new IdentityService(identityRepository, cacheService);
