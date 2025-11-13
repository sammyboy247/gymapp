import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Booking_Key {
  userId: UUIDString;
  classId: UUIDString;
  __typename?: 'Booking_Key';
}

export interface Class_Key {
  id: UUIDString;
  __typename?: 'Class_Key';
}

export interface CreateNewPostData {
  post_insert: Post_Key;
}

export interface CreateNewPostVariables {
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface GetMyPostsData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    createdAt: TimestampString;
  } & Post_Key)[];
}

export interface GroupMembership_Key {
  userId: UUIDString;
  groupId: UUIDString;
  __typename?: 'GroupMembership_Key';
}

export interface Group_Key {
  id: UUIDString;
  __typename?: 'Group_Key';
}

export interface JoinGroupData {
  groupMembership_insert: GroupMembership_Key;
}

export interface JoinGroupVariables {
  groupId: UUIDString;
}

export interface ListPublicGroupsData {
  groups: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    creator?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & Group_Key)[];
}

export interface MembershipType_Key {
  id: UUIDString;
  __typename?: 'MembershipType_Key';
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateNewPost' Mutation. Allow users to execute without passing in DataConnect. */
export function createNewPost(dc: DataConnect, vars: CreateNewPostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewPostData>>;
/** Generated Node Admin SDK operation action function for the 'CreateNewPost' Mutation. Allow users to pass in custom DataConnect instances. */
export function createNewPost(vars: CreateNewPostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewPostData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyPosts' Query. Allow users to execute without passing in DataConnect. */
export function getMyPosts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyPostsData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyPosts' Query. Allow users to pass in custom DataConnect instances. */
export function getMyPosts(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyPostsData>>;

/** Generated Node Admin SDK operation action function for the 'JoinGroup' Mutation. Allow users to execute without passing in DataConnect. */
export function joinGroup(dc: DataConnect, vars: JoinGroupVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<JoinGroupData>>;
/** Generated Node Admin SDK operation action function for the 'JoinGroup' Mutation. Allow users to pass in custom DataConnect instances. */
export function joinGroup(vars: JoinGroupVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<JoinGroupData>>;

/** Generated Node Admin SDK operation action function for the 'ListPublicGroups' Query. Allow users to execute without passing in DataConnect. */
export function listPublicGroups(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPublicGroupsData>>;
/** Generated Node Admin SDK operation action function for the 'ListPublicGroups' Query. Allow users to pass in custom DataConnect instances. */
export function listPublicGroups(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPublicGroupsData>>;

