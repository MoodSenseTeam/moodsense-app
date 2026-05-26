import type { CreateUserDto } from './create-user.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { PasswordHasher } from '@/infrastructure/security/password-hasher';

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async execute(input: CreateUserDto) {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await this.passwordHasher.hash(input.password);

        const user = await this.userRepository.create({
            ...input,
            password: hashedPassword,
        });

        return user;
    }
}