export class Email {
    private constructor(public readonly value: string) { }

    public static create(email: string): Email {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error('Invalid email address');
        }

        return new Email(email);
    }

    public toString(): string {
        return this.value;
    }
}
