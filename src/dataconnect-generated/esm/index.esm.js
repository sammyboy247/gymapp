import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'gymapp',
  location: 'us-east4'
};

export const createNewPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewPost', inputVars);
}
createNewPostRef.operationName = 'CreateNewPost';

export function createNewPost(dcOrVars, vars) {
  return executeMutation(createNewPostRef(dcOrVars, vars));
}

export const getMyPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPosts');
}
getMyPostsRef.operationName = 'GetMyPosts';

export function getMyPosts(dc) {
  return executeQuery(getMyPostsRef(dc));
}

export const joinGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'JoinGroup', inputVars);
}
joinGroupRef.operationName = 'JoinGroup';

export function joinGroup(dcOrVars, vars) {
  return executeMutation(joinGroupRef(dcOrVars, vars));
}

export const listPublicGroupsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicGroups');
}
listPublicGroupsRef.operationName = 'ListPublicGroups';

export function listPublicGroups(dc) {
  return executeQuery(listPublicGroupsRef(dc));
}

