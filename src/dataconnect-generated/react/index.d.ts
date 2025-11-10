import { CreateNewPostData, CreateNewPostVariables, GetMyPostsData, JoinGroupData, JoinGroupVariables, ListPublicGroupsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewPost(options?: useDataConnectMutationOptions<CreateNewPostData, FirebaseError, CreateNewPostVariables>): UseDataConnectMutationResult<CreateNewPostData, CreateNewPostVariables>;
export function useCreateNewPost(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewPostData, FirebaseError, CreateNewPostVariables>): UseDataConnectMutationResult<CreateNewPostData, CreateNewPostVariables>;

export function useGetMyPosts(options?: useDataConnectQueryOptions<GetMyPostsData>): UseDataConnectQueryResult<GetMyPostsData, undefined>;
export function useGetMyPosts(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyPostsData>): UseDataConnectQueryResult<GetMyPostsData, undefined>;

export function useJoinGroup(options?: useDataConnectMutationOptions<JoinGroupData, FirebaseError, JoinGroupVariables>): UseDataConnectMutationResult<JoinGroupData, JoinGroupVariables>;
export function useJoinGroup(dc: DataConnect, options?: useDataConnectMutationOptions<JoinGroupData, FirebaseError, JoinGroupVariables>): UseDataConnectMutationResult<JoinGroupData, JoinGroupVariables>;

export function useListPublicGroups(options?: useDataConnectQueryOptions<ListPublicGroupsData>): UseDataConnectQueryResult<ListPublicGroupsData, undefined>;
export function useListPublicGroups(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicGroupsData>): UseDataConnectQueryResult<ListPublicGroupsData, undefined>;
