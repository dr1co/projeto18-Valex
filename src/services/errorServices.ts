export default function handleError(code: string) {
    switch (code) {
        case "NoCompany":
            return 404;
        case "ServerProblem":
            return 500;
        case "CardFound":
            return 401;
        default:
            return 418;
    }
}