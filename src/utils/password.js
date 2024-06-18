const bcrypt = require("bcryptjs");
exports.getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

exports.isValidPassword = (localpass, dbpass) => {
    return bcrypt.compareSync(localpass, dbpass);
};


exports.htmlFile = (data, name) => {
    return `
  <!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .reset-password-link {
            padding: 10px;
            border-radius: 5px;
            background-color: #61094e;
            color: white !important;
            text-decoration: none;

        }

        .reset-password-link:hover {
            background-color: #7a1364;
            color: white;
        }

        .centertext {
            text-align: center;
            margin-top: 10px;
        }

        .colorSet {
            color: #7a1364;
        }

        .coolorSet2 {
            color: #868383;
            font-size: 18px;
        }
        .coolorSet3{
          color: #868383;
            font-size: 18px;
            padding-bottom: 20px;
        }

        .bordreset {
            border: 1px solid #f4f4f4;
            width: 50%;
            display: flex;
            padding: 20px;
            margin: 20px;
            border-radius: 10px;
            background-color: white;
        }

        .peracenter {
            text-align: center;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .perafirstcenter {
            text-align: center;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .dispalcenterform {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    </style>
</head>

<body>
    <div class="dispalcenterform">
        <div class="bordreset">
            <div>
                <p>
                    <img src="https://imagedelivery.net/f5tF3V4WaB6L98qcq1rX5w/ab168248-e66b-449d-6d5d-06c26aa56d00/public"
                        width="150" height="80" />
                </p>

            </div>
            <div>
                <p class="perafirstcenter">
                    <img class="marginmiddle"
                        src="https://imagedelivery.net/f5tF3V4WaB6L98qcq1rX5w/dbf00501-733b-4e4c-306a-ae913f3a0000/public"
                        width="350" height="300" />
                </p>
                <h1 class="colorSet">Forgot Your Password?</h1>
                <p class="coolorSet2">
                    Hello ${name},
                    <br />
                    <br />
                    We’ve recieved a request to reset the password for your account associate with growXads. No changes
                    have
                    been made to your account yet.
                    <br />
                    <br />
                    To reset your password, click the link below:
                </p>
                <p class="peracenter">
                    <a href="http://localhost:3000/resetPassword/${data}" class="reset-password-link">Reset Your
                        Password</a>
                </p>


                <p class="coolorSet2">
                    You have 30 mins to pick your password, After that, you’ll have to ask for new one.
                    <br />
                    <br />
                    Didn’t request this change? You can ignore this email.

                </p>
                <p class="coolorSet3">
                    Thanks, -The growXads Team
                    <br/>
                    <br/>

                </p>
                <br/>
                <br/>

            </div>
        </div>
    </div>




     
</body>

</html>
        `
}



function generateUniqueID() {
    return Math.floor(100000 + Math.random() * 900000);
}

function isUniqueID(id, existingIDs) {
    return !existingIDs.includes(id);
}


exports.generateUniqueSignupID =  (existingIDs)=> {
    let id;
    do {
        id = generateUniqueID();
    } while (!isUniqueID(id, existingIDs));
    existingIDs.push(id);
    return id;
}

// meta teg code

exports.generateMetaContent = () => {
    const random = Math.floor(Math.random() * 100000000000000000);
    const split = random.toString().split('');
    const simbolAdd = split.map((item, index) => {
        if (index % 5 === 0) {
            if (index % 2 === 0) {
                if (index % 3 === 0) {
                    return item + "dc";
                }
                return item + "bh";
            }
            return item + "af";
        }
        return item;
    });
    return simbolAdd.join("");
};



exports.scriptTagGenerater = ()=>Math.floor(Math.random() * 100000000);
    