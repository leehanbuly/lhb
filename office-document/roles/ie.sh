#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
#
function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/IE/configuration/cli"
docker-compose -f docker-compose.yml up -d cliIE

echo "

 Install and Instantiate a Smart Contract as 'CE'


 Run Applications in either langauage (can be different from the Smart Contract)

 JavaScript Client Aplications:

 To add identity to the wallet:   node addToWallet.js
    < createDoc the doc run as CE>
 To sendDoc the doc             :   node sendDoc.js
 To approveDoc the doc          :   node approveDoc.js

"
echo "Suggest that you change to this dir>  cd ${DIR}/organization/CE"
