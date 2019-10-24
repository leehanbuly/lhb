/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. wallet에서 ID 선택
 * 2. 네트워크에 gateway 연결
 * 3. HyperpnsNet network 접근
 * 4. 서류 전송 요청
 * 5. 트랜잭션 발생
 * 6. 프로세스 응답
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const OfficeDocument = require('../../CE/contract/lib/document.js');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('../identity/user/IE-1/wallet');

// Main program function
async function main () {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'Admin@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        console.log('Use org.hyperpnsnet.officedocument smart contract.');

        const contract = await network.getContract('documentcontract', 'org.hyperpnsnet.officedocument');

        console.log('Submit office document buy transaction.');

        var docNumber;
        var docTitle;
        var docComment;
        var docSaveTime;
        var docCreator;
        var docApprover;
        var bAuth = false;

        const sendDocResponse = await contract.submitTransaction('sendDoc', docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth);

        console.log('Process sendDoc transaction response.');

        let doc = OfficeDocument.fromBuffer(sendDocResponse);

        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('SendDoc program complete.');

}).catch((e) => {

    console.log('SendDoc program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
