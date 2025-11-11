const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    EXPIRY_TIME: "token_expiry_time",
    CODE_VERIFIER: "code_verifier"
}

// Buffer time in milliseconds before actual expiry (5 minutes)
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

export const tokenManager = {

    saveTokens(accessToken, refreshToken, expiresIn = 3600) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        if (refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(STORAGE_KEYS.EXPIRY_TIME, expiryTime.toString());

        console.log('Tokens saved. Expires at:', new Date(expiryTime).toLocaleString());
    },


    getAccessToken() {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) return null;

        if (this.isExpired()) {
            console.log('Access token expired.');
            return null;
        }

        return accessToken
    },

    getRefreshToken() {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    isExpired() {
        const expiryTime = localStorage.getItem(STORAGE_KEYS.EXPIRY_TIME);
        if (!expiryTime) return true;

        return Date.now() >= parseInt(expiryTime, 10);
    },

    needsRefresh() {
        const expiryTime = localStorage.getItem(STORAGE_KEYS.EXPIRY_TIME);
        if (!expiryTime) return true

        const timeUntilExpiry = parseInt(expiryTime, 10) - Date.now();
        return timeUntilExpiry < REFRESH_BUFFER_MS;  
    },

    getTimeUntilExpiry() {
        const expiryTime = localStorage.getItem(STORAGE_KEYS.EXPIRY_TIME);
        if (!expiryTime) return 0;

        const timeUntilExpiry = parseInt(expiryTime, 10) - Date.now();
        return Math.max(0, Math.floor(timeUntilExpiry / 1000));
    },

    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key)
        });
        console.log('All tokens cleared from localStorage.');
    },

    saveCodeVerifier(codeVerifier) {
        localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
    },

    getCodeVerifier() {
        return localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
    },

    getStatus() {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const expiryTime = localStorage.getItem(STORAGE_KEYS.EXPIRY_TIME);
        const timeLeft = this.getTimeUntilExpiry();

        return {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            isExpired: this.isExpired(),
            needsRefresh: this.needsRefresh(),
            expiresAt: expiryTime ? new Date(parseInt(expiryTime, 10)).toLocaleString() : null,
            secondsUntilExpiry: timeLeft
        }
    }
};

if (typeof window !== "undefined") {
    window.tokenManager = tokenManager;
}