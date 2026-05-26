import { Email } from './email.vo';
import { PasswordHash } from './password.vo';

export type UserPrimitives = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export class User {
    private constructor(
        public user_id: number,
        public name: string,
        public email: string,
        public password: string,
        public created_at: string,
        public updated_at: string,
    ) { }

    public static fromPrimitives(p: UserPrimitives) {
        return new User(p.user_id, p.name, p.email, p.password, p.created_at, p.updated_at);
    }

    public toPrimitives(): UserPrimitives {
        return {
            user_id: this.user_id,
            name: this.name,
            email: this.email,
            password: this.password,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }

    public static create(input: { name: string; email: Email; passwordHash: PasswordHash }) {
        const now = new Date().toISOString();

        return new User(
            0,
            input.name,
            input.email.toString(),
            input.passwordHash.toString(),
            now,
            now,
        );
    }

    public changeName(newName: string) {
        this.name = newName;
        // ensure the updated timestamp differs from the previous value
        this.updated_at = new Date(Date.now() + 1).toISOString();
    }
}