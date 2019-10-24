#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/CE/configuration/cli"
docker-compose -f docker-compose.yml up -d cliCE

echo "
 Install and Instantiate a Smart Contract in either langauge

 JavaScript Contract:

 docker exec cliCE peer chaincode install -n documentcontract -v 0 -p /opt/gopath/src/github.com/contract -l node
 docker exec cliCE peer chaincode instantiate -n documentcontract -v 0 -l node -c '{\"Args\":[\"org.documentnet.officedocument:instantiate\"]}' -C mychannel -P \"AND ('Org1MSP.member')\"

 Java Contract:

 docker exec cliCE peer chaincode install -n documentcontract -v 0 -p /opt/gopath/src/github.com/contract-java -l java
 docker exec cliCE peer chaincode instantiate -n documentcontract -v 0 -l java -c '{\"Args\":[\"org.documentnet.officedocument:instantiate\"]}' -C mychannel -P \"AND ('Org1MSP.member')\"


 Run Applications in either langauage (can be different from the Smart Contract)

 JavaScript Client Aplications:

 To add identity to the wallet:   node addToWallet.js
 To createDoc the document           :   node createDoc.js

"

echo "Suggest that you change to this dir>  cd ${DIR}/organization/CE/"
