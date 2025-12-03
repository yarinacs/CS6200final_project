// Amazon Cognito Identity SDK
// You need to include the SDK in your HTML file first:
// <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1001.0.min.js"></script>
// <script src="https://rawgit.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js"></script>
// Or better, use a bundled version or CDN. For this vanilla JS project, we will assume global 'AmazonCognitoIdentity' is available.

// Configuration - REPLACE THESE WITH ACTUAL VALUES AFTER DEPLOYMENT
const poolData = {
    UserPoolId: 'us-east-1_AV91wfzjK',
    ClientId: '3u2rhi1p62bilmoe2ru3ac8neq'
};

let userPool;

function initAuth() {
    if (typeof AmazonCognitoIdentity === 'undefined') {
        console.error('Amazon Cognito Identity SDK not loaded');
        return;
    }
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    updateUI();
}

function signUp(email, password) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ];

    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        const cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        alert('Registration successful! Please check your email for the verification code.');
        // Switch to verification view or prompt for code
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('verify-modal').style.display = 'block';
        document.getElementById('verify-email').value = email;
    });
}

function verify(email, code) {
    const userData = {
        Username: email,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        alert('Verification successful! You can now log in.');
        document.getElementById('verify-modal').style.display = 'none';
        document.getElementById('auth-modal').style.display = 'block'; // Back to login
    });
}

function signIn(email, password) {
    const authenticationData = {
        Username: email,
        Password: password,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: email,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken();
            const idToken = result.getIdToken().getJwtToken();
            console.log('Access Token ' + accessToken);
            console.log('ID Token ' + idToken);

            // Save tokens if needed, but SDK handles session mostly
            localStorage.setItem('id_token', idToken);

            alert('Login successful!');
            document.getElementById('auth-modal').style.display = 'none';
            updateUI();

            // Refresh page or redirect
            window.location.reload();
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

function signOut() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.signOut();
        localStorage.removeItem('id_token');
        updateUI();
        window.location.reload();
    }
}

function isAuthenticated() {
    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser != null;
}

function getAuthToken(callback) {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                console.error(err);
                callback(null);
                return;
            }
            if (session.isValid()) {
                callback(session.getIdToken().getJwtToken());
            } else {
                callback(null);
            }
        });
    } else {
        callback(null);
    }
}

function updateUI() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        // Logged in
        document.getElementById('nav-sign-in').style.display = 'none';
        document.getElementById('nav-sign-out').style.display = 'block';
        if (document.getElementById('nav-orders')) document.getElementById('nav-orders').style.display = 'block';

        cognitoUser.getSession(function (err, session) {
            if (session.isValid()) {
                document.getElementById('user-email-display').innerText = session.getIdToken().payload.email;
            }
        });

    } else {
        // Logged out
        document.getElementById('nav-sign-in').style.display = 'block';
        document.getElementById('nav-sign-out').style.display = 'none';
        if (document.getElementById('nav-orders')) document.getElementById('nav-orders').style.display = 'none';
        document.getElementById('user-email-display').innerText = '';
    }
}

// Expose functions globally
window.initAuth = initAuth;
window.signUp = signUp;
window.verify = verify;
window.signIn = signIn;
window.signOut = signOut;
window.getAuthToken = getAuthToken;
