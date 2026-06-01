import type {
    TokenService,
    JwtTokenPayload,
} from '@/infrastructure/security/token-service';
import type { UserRepository } from '@/shared/ports/user.repository';

type Credentials = Awaited<
    ReturnType<NonNullable<UserRepository['findCredentialsByUserId']>>
>;

export async function verifyRefreshToken(
    tokenService: TokenService,
    userRepository: UserRepository,
    token: string,
): Promise<{
    userId: number;
    email: string;
    credentials: NonNullable<Credentials>;
}> {
    const payload = (await tokenService.verifyRefreshToken(
        token,
    )) as JwtTokenPayload | null;

    if (!payload?.sub || !payload.email) {
        throw new Error('Invalid refresh token.');
    }

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) {
        throw new Error('Invalid refresh token.');
    }

    const credentials = await userRepository.findCredentialsByUserId(userId);
    if (
        !credentials ||
        !credentials.is_active ||
        credentials.refresh_token !== token
    ) {
        throw new Error('Invalid refresh token.');
    }

    return { userId, email: payload.email, credentials };
}
