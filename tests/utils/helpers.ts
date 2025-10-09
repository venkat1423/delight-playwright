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

