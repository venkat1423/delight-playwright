import users from '../../test-data/users.json';

export function getValidLoginCreds() {
    const first = users.login.positive[0];
    return { email: first.email, password: first.password };
}

export function uniqueName(prefix: string = 'List') {
    const ts = Date.now();
    const rand = Math.floor(Math.random() * 1000);
    return `${prefix}-${ts}-${rand}`;
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uniqueUrl(pathPrefix: string = 'event') {
    const slug = uniqueName(pathPrefix).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `https://example.com/${slug}`;
}

export function uniqueSentence(prefix: string = 'Description') {
    return `${prefix} ${uniqueName('text')}`;
}

