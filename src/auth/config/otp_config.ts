export function getOtp() {
    return Math.ceil(Math.random() * (1000000 - 0) + 0);
}
