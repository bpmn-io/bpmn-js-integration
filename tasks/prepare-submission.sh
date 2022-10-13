#!/usr/bin/env bash

set -e -o pipefail

TOOLKIT_VERSION="$(node -p "require('bpmn-js/package.json').version")"
BRANCH_NAME="submit-$TOOLKIT_VERSION"
FORK_REPO="https://$BPMN_IO_TOKEN@github.com/bpmn-io/bpmn-miwg-test-suite.git"

git -C $MIWG_PATH switch -c $BRANCH_NAME

SUBMISSION_PATH="$(node -p "require('./test/spec/miwg-helper').submissionPath()")"

cp -R tmp/integration/bpmn-miwg-test-suite/ "$SUBMISSION_PATH"

rm -f "$SUBMISSION_PATH"/*.html
rm -f "$SUBMISSION_PATH"/*.json
rm -f "$SUBMISSION_PATH"/*.svg

mv "$SUBMISSION_PATH" "$MIWG_PATH/bpmn.io (Camunda Modeler) $TOOLKIT_VERSION"

node $(dirname $0)/update-tools-list.js

git config user.email "$BPMN_IO_EMAIL"
git config user.name "$BPMN_IO_USERNAME"
git config push.default simple

git -C $MIWG_PATH add -A
git -C $MIWG_PATH commit -m "feat: prepare bpmn.io $TOOLKIT_VERSION submission"

git -C $MIWG_PATH push "$FORK_REPO" "$BRANCH_NAME"

echo "Open PR with https://github.com/bpmn-miwg/bpmn-miwg-test-suite/compare/master...bpmn-io:bpmn-miwg-test-suite:$BRANCH_NAME"
