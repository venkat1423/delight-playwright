let latestEventName: string | null = null;

export function saveLatestEventName(name: string) {
    latestEventName = name;
}

export function getLatestEventName() {
    return latestEventName;
}


