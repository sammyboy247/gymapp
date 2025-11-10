const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'gymapp',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewPost', inputVars);
}
createNewPostRef.operationName = 'CreateNewPost';
exports.createNewPostRef = createNewPostRef;

exports.createNewPost = function createNewPost(dcOrVars, vars) {
  return executeMutation(createNewPostRef(dcOrVars, vars));
};

const getMyPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPosts');
}
getMyPostsRef.operationName = 'GetMyPosts';
exports.getMyPostsRef = getMyPostsRef;

exports.getMyPosts = function getMyPosts(dc) {
  return executeQuery(getMyPostsRef(dc));
};

const joinGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'JoinGroup', inputVars);
}
joinGroupRef.operationName = 'JoinGroup';
exports.joinGroupRef = joinGroupRef;

exports.joinGroup = function joinGroup(dcOrVars, vars) {
  return executeMutation(joinGroupRef(dcOrVars, vars));
};

const listPublicGroupsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicGroups');
}
listPublicGroupsRef.operationName = 'ListPublicGroups';
exports.listPublicGroupsRef = listPublicGroupsRef;

exports.listPublicGroups = function listPublicGroups(dc) {
  return executeQuery(listPublicGroupsRef(dc));
};
