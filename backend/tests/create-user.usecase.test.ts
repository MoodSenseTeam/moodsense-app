import { describe, expect, it } from 'vitest';

import { CreateUserUseCase, type PasswordHasher } from '../src/features/v1/auth/create-user/create-user.usecase';
import type { CreateUserDto } from '../src/features/v1/auth/create-user/create-user.dto';
import type { UserRepository } from '../src/features/v1/auth/create-user/user.repository';

type StoredUser = {
    user_id: number;
    name: string;
    email: string;
    password: string;
};

class InMemoryUserRepository implements UserRepository {
    public users: StoredUser[] = [];

    async findByEmail(email: string) {
        return this.users.find((user) => user.email === email) ?? null;
    }

    async create(data: CreateUserDto & { password: string }) {
        const user: StoredUser = {
            user_id: this.users.length + 1,
            name: data.name,
            email: data.email,
            password: data.password,
        };

        this.users.push(user);

        return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        };
    }
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
        });

        expect(result).toEqual({
            user_id: 1,
            name: 'Stezi',
            email: 'stezi@example.com',
        });
        expect(userRepository.users[0]?.password).toBe('hashed:supersecret');
    });

    it('rejects duplicate emails', async () => {
        const userRepository = new InMemoryUserRepository();
        userRepository.users.push({
            user_id: 1,
            name: 'Existing',
            email: 'stezi@example.com',
            password: 'hashed:password',
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
            }),
        ).rejects.toThrow('Email already in use');
    });
});