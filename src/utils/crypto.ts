export type AlgorithmType = 'base64' | 'hex' | 'rot13';

export const algorithms: Record<AlgorithmType, { name: string; encrypt: (s: string) => string; decrypt: (s: string) => string }> = {
    base64: {
        name: 'Base64',
        encrypt: (text) => {
            const utf8Text = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
                (_, p1) => String.fromCharCode(parseInt(p1, 16))
            );
            const base64 = btoa(utf8Text);
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        },
        decrypt: (text) => {
            let base64 = text.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            return decodeURIComponent(Array.prototype.map.call(atob(base64),
                (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
        },
    },
    hex: {
        name: 'Hex',
        encrypt: (text) => text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
        decrypt: (text) => {
            const hex = text.toString();
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return str;
        },
    },
    rot13: {
        name: 'ROT13',
        encrypt: (text) => text.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 90 : 122;
            const code = char.charCodeAt(0) + 13;
            return String.fromCharCode(code > base ? code - 26 : code);
        }),
        decrypt: (text) => text.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 90 : 122;
            const code = char.charCodeAt(0) + 13;
            return String.fromCharCode(code > base ? code - 26 : code);
        }),
    }
};

export const isSimpleEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isMailtoContent = (text: string): boolean => {
    return text.startsWith('mailto:') || isSimpleEmail(text);
};

export const constructMailto = (
    to: string,
    cc?: string,
    bcc?: string,
    subject?: string,
    body?: string
): string => {
    let link = `mailto:${to}`;
    const params: string[] = [];

    if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
    if (bcc) params.push(`bcc=${encodeURIComponent(bcc)}`);
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) {
        link += `?${params.join('&')}`;
    }
    return link;
};

export const extractEmailForDisplay = (text: string): string => {
    if (isSimpleEmail(text)) return text;
    if (text.startsWith('mailto:')) {
        const match = text.match(/^mailto:([^?]+)/);
        return match ? match[1] : 'Unknown Recipient';
    }
    return text;
};
