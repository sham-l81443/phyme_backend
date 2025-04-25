export interface IGoogleProfile {
    id: string,
    displayName: string,
    emails: { value: string, verified: boolean }[],
    photos: { value: string }[],
    _json: {
        sub: string,
        name: string,
        given_name: string,
        family_name: string,
        picture: string,
        email: string,
        email_verified: boolean
    }
}