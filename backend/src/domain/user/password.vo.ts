export class PasswordHash {
    private constructor(public readonly hash: string) { }

    public static fromHash(hash: string): PasswordHash {
        return new PasswordHash(hash);
    }

    public toString(): string {
        return this.hash;
    }
}
