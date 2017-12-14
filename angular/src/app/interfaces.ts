export interface Member {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
}

export interface AccessToken {
    id: string;
    ttl: number;
    created: string;
    userId: number;
}

export interface Language {
    id: number;
    name: string;
    _old_id: number;
}
