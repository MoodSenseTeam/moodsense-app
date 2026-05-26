import { describe, expect, it } from 'vitest';

import { CreateUserUseCase } from '../src/features/v1/auth/create-user/create-user.usecase';
import type { CreateUserDto } from '../src/features/v1/auth/create-user/create-user.dto';
import type { PasswordHasher } from '../src/infrastructure/security/password-hasher';
import type { UserRepository } from '../src/shared/ports/user.repository';

type StoredUser = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    gender: string;
    tanggal_lahir: string;
    usage_reason: string | null;
};

class InMemoryUserRepository implements UserRepository {
    public users: StoredUser[] = [];

    async findByEmailWithPassword(email: string) {
        return this.users.find((user) => user.email === email) ?? null;
    }

    async findByEmail(email: string) {
        const user = this.users.find((user) => user.email === email);
        if (!user) return null;
        return { user_id: user.user_id, name: user.name, email: user.email };
    }

    async create(data: CreateUserDto & { password: string }) {
        const user: StoredUser = {
            user_id: this.users.length + 1,
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            tanggal_lahir: data.tanggal_lahir,
            usage_reason: data.usage_reason ?? null,
        };

        this.users.push(user);

        return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        };
    }

    async upsertCredentials() { return; }
    async updateLastLogin() { return; }
    async findCredentialsByUserId() { return null; }
    async revokeCredentials() { return; }
}

describe('CreateUserUseCase', () => {
    it('creates a user with a hashed password', async () => {
        const userRepository = new InMemoryUserRepository();
        const passwordHasher: PasswordHasher = {
            async hash(password: string) {
                return `hashed:${password}`;
            },
        };

        const useCase = new CreateUserUseCase(userRepository, passwordHasher);

        const result = await useCase.execute({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
            gender: 'FEMALE',
            tanggal_lahir: '2000-01-01',
            usage_reason: 'mental health tracking',
        });

        expect(result).toEqual({
            user_id: 1,
            name: 'Stezi',
            email: 'stezi@example.com',
        });
        expect(userRepository.users[0]?.password).toBe('hashed:supersecret');
        expect(userRepository.users[0]?.gender).toBe('FEMALE');
        expect(userRepository.users[0]?.tanggal_lahir).toBe('2000-01-01');
        expect(userRepository.users[0]?.usage_reason).toBe('mental health tracking');
    });

    it('rejects duplicate emails', async () => {
        const userRepository = new InMemoryUserRepository();
        userRepository.users.push({
            user_id: 1,
            name: 'Existing',
            email: 'stezi@example.com',
            password: 'hashed:password',
            gender: 'MALE',
            tanggal_lahir: '1999-05-15',
            usage_reason: null,
        });

        const passwordHasher: PasswordHasher = {
            async hash(password: string) {
                return `hashed:${password}`;
            },
        };

        const useCase = new CreateUserUseCase(userRepository, passwordHasher);

        await expect(
            useCase.execute({
                name: 'Stezi',
                email: 'stezi@example.com',
                password: 'supersecret',
                gender: 'FEMALE',
                tanggal_lahir: '2000-01-01',
            }),
        ).rejects.toThrow('Email already in use');
    });
});
