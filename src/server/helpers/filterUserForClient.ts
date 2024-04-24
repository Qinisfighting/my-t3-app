



export type User = {
    id: string;
    username: string;
    profileImageUrl: string;
    externalAccounts: ExternalAccount[];
    externalUsername: string | null;
};

type ExternalAccount = {
    provider: string;
    username: string;
};

export const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        externalUsername: user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username ?? null
    };
};
