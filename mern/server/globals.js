var accessToken = "";
var refreshToken = "";
exports.getAccessToken = () => {
    return accessToken;
}

exports.setAccessToken = (name) => {
    accessToken = name;
}

exports.getRefreshToken = () => {
    return refreshToken;
}

exports.setRefreshToken = (name) => {
    refreshToken = name;
}
