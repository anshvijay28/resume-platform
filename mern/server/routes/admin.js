
const appID = process.env.ADMIN_APP_ID;
const projectID = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_ADMIN_KEY;
const publicKey = process.env.PUBLIC_ADMIN_KEY;
const fetch = require('cross-fetch');
var globals = require("../globals");

exports.getAdminKey = () => {
    return new Promise((resolve, reject) => {
        fetch('https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: publicKey,
                apiKey: privateKey
            })
        })
        .then(response => 
            response.json()
        )
        .then(data => {
            console.log("getting admin key");
            globals.setAccessToken(data.access_token);
            globals.setRefreshToken(data.refresh_token);
        })
        .catch(err => console.log(err));
        });
    
}

exports.verifyClientToken = (userToken, again = false) => {
    return new Promise((resolve, reject) => {
        fetch(`https://realm.mongodb.com/api/admin/v3.0/groups/${projectID}/apps/${appID}/users/verify_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + globals.getAccessToken()
            },
            body: JSON.stringify({
                token: userToken
            })
        })
        .then(response => 
            response.json()
        )
        .then(data => {
            if (data === 'token expired') {
                //refersh token --> make em login again
                console.log("token expired");
                resolve({action: "LOGIN"});
                return;
            } else if (data.error === "token contains an invalid number of segments" || data.error === "invalid session") {
                if (again) {
                    console.log("bad api key or user token");
                    resolve({action:"REJECT"});
                    return;
                } else {
                    //refresh admin token
                    console.log('refreshing admin key');
                    refreshAdminKey()
                    .then( () => {
                        this.verifyClientToken(userToken, true)
                        .then( (data) => {
                            resolve(data);
                        })
                    })
                    .catch(err => reject(err));
                    return;
                }
                
            } else if (data.sub !== "") {
                //valid token
                console.log("valid token");
                resolve({action: "PASS"});
                return;
            }
            resolve({action: "REJECT"});
        })
        .catch(err => reject(err));
    });
}



var refreshAdminKey = () => {
    return new Promise(function (resolve, reject) {
        fetch(`https://realm.mongodb.com/api/admin/v3.0/auth/session`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + globals.getRefreshToken()
                }
            })
            .then(response => 
                response.json()
            )
            .then(data => {
                if (data.access_token !== "") {
                    console.log("refreshed admin key");
                    globals.setAccessToken(data.access_token);
                    resolve();
                } else {
                    console.log("obtaining a new admin key");
                    getAdminKey()
                    .then( () => {
                        resolve();
                    })
                }
            })
            .catch(err => reject(err));
    });
}

