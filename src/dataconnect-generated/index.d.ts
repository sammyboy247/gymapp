import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface CreateNewPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewPostVariables): MutationRef<CreateNewPostData, CreateNewPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewPostVariables): MutationRef<CreateNewPostData, CreateNewPostVariables>;
  operationName: string;
}
export const createNewPostRef: CreateNewPostRef;

export function createNewPost(vars: CreateNewPostVariables): MutationPromise<CreateNewPostData, CreateNewPostVariables>;
export function createNewPost(dc: DataConnect, vars: CreateNewPostVariables): MutationPromise<CreateNewPostData, CreateNewPostVariables>;

interface GetMyPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyPostsData, undefined>;
  operationName: string;
}
export const getMyPostsRef: GetMyPostsRef;

export function getMyPosts(): QueryPromise<GetMyPostsData, undefined>;
export function getMyPosts(dc: DataConnect): QueryPromise<GetMyPostsData, undefined>;

interface JoinGroupRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
  operationName: string;
}
export const joinGroupRef: JoinGroupRef;

export function joinGroup(vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;
export function joinGroup(dc: DataConnect, vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface ListPublicGroupsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicGroupsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicGroupsData, undefined>;
  operationName: string;
}
export const listPublicGroupsRef: ListPublicGroupsRef;

export function listPublicGroups(): QueryPromise<ListPublicGroupsData, undefined>;
export function listPublicGroups(dc: DataConnect): QueryPromise<ListPublicGroupsData, undefined>;

