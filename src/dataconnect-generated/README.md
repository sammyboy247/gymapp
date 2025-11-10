# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyPosts*](#getmyposts)
  - [*ListPublicGroups*](#listpublicgroups)
- [**Mutations**](#mutations)
  - [*CreateNewPost*](#createnewpost)
  - [*JoinGroup*](#joingroup)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyPosts
You can execute the `GetMyPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyPosts(): QueryPromise<GetMyPostsData, undefined>;

interface GetMyPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPostsData, undefined>;
}
export const getMyPostsRef: GetMyPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyPosts(dc: DataConnect): QueryPromise<GetMyPostsData, undefined>;

interface GetMyPostsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyPostsData, undefined>;
}
export const getMyPostsRef: GetMyPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyPostsRef:
```typescript
const name = getMyPostsRef.operationName;
console.log(name);
```

### Variables
The `GetMyPosts` query has no variables.
### Return Type
Recall that executing the `GetMyPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyPostsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyPostsData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    createdAt: TimestampString;
  } & Post_Key)[];
}
```
### Using `GetMyPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyPosts } from '@dataconnect/generated';


// Call the `getMyPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyPosts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyPosts(dataConnect);

console.log(data.posts);

// Or, you can use the `Promise` API.
getMyPosts().then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetMyPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyPostsRef } from '@dataconnect/generated';


// Call the `getMyPostsRef()` function to get a reference to the query.
const ref = getMyPostsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyPostsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## ListPublicGroups
You can execute the `ListPublicGroups` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicGroups(): QueryPromise<ListPublicGroupsData, undefined>;

interface ListPublicGroupsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicGroupsData, undefined>;
}
export const listPublicGroupsRef: ListPublicGroupsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicGroups(dc: DataConnect): QueryPromise<ListPublicGroupsData, undefined>;

interface ListPublicGroupsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicGroupsData, undefined>;
}
export const listPublicGroupsRef: ListPublicGroupsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicGroupsRef:
```typescript
const name = listPublicGroupsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicGroups` query has no variables.
### Return Type
Recall that executing the `ListPublicGroups` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicGroupsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPublicGroups`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicGroups } from '@dataconnect/generated';


// Call the `listPublicGroups()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicGroups();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicGroups(dataConnect);

console.log(data.groups);

// Or, you can use the `Promise` API.
listPublicGroups().then((response) => {
  const data = response.data;
  console.log(data.groups);
});
```

### Using `ListPublicGroups`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicGroupsRef } from '@dataconnect/generated';


// Call the `listPublicGroupsRef()` function to get a reference to the query.
const ref = listPublicGroupsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicGroupsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.groups);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.groups);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewPost
You can execute the `CreateNewPost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewPost(vars: CreateNewPostVariables): MutationPromise<CreateNewPostData, CreateNewPostVariables>;

interface CreateNewPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewPostVariables): MutationRef<CreateNewPostData, CreateNewPostVariables>;
}
export const createNewPostRef: CreateNewPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewPost(dc: DataConnect, vars: CreateNewPostVariables): MutationPromise<CreateNewPostData, CreateNewPostVariables>;

interface CreateNewPostRef {
  ...
  (dc: DataConnect, vars: CreateNewPostVariables): MutationRef<CreateNewPostData, CreateNewPostVariables>;
}
export const createNewPostRef: CreateNewPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewPostRef:
```typescript
const name = createNewPostRef.operationName;
console.log(name);
```

### Variables
The `CreateNewPost` mutation requires an argument of type `CreateNewPostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewPostVariables {
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateNewPost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewPostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewPostData {
  post_insert: Post_Key;
}
```
### Using `CreateNewPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewPost, CreateNewPostVariables } from '@dataconnect/generated';

// The `CreateNewPost` mutation requires an argument of type `CreateNewPostVariables`:
const createNewPostVars: CreateNewPostVariables = {
  content: ..., 
  imageUrl: ..., // optional
  videoUrl: ..., // optional
};

// Call the `createNewPost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewPost(createNewPostVars);
// Variables can be defined inline as well.
const { data } = await createNewPost({ content: ..., imageUrl: ..., videoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewPost(dataConnect, createNewPostVars);

console.log(data.post_insert);

// Or, you can use the `Promise` API.
createNewPost(createNewPostVars).then((response) => {
  const data = response.data;
  console.log(data.post_insert);
});
```

### Using `CreateNewPost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewPostRef, CreateNewPostVariables } from '@dataconnect/generated';

// The `CreateNewPost` mutation requires an argument of type `CreateNewPostVariables`:
const createNewPostVars: CreateNewPostVariables = {
  content: ..., 
  imageUrl: ..., // optional
  videoUrl: ..., // optional
};

// Call the `createNewPostRef()` function to get a reference to the mutation.
const ref = createNewPostRef(createNewPostVars);
// Variables can be defined inline as well.
const ref = createNewPostRef({ content: ..., imageUrl: ..., videoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewPostRef(dataConnect, createNewPostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.post_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.post_insert);
});
```

## JoinGroup
You can execute the `JoinGroup` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
joinGroup(vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface JoinGroupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
}
export const joinGroupRef: JoinGroupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
joinGroup(dc: DataConnect, vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface JoinGroupRef {
  ...
  (dc: DataConnect, vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
}
export const joinGroupRef: JoinGroupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the joinGroupRef:
```typescript
const name = joinGroupRef.operationName;
console.log(name);
```

### Variables
The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface JoinGroupVariables {
  groupId: UUIDString;
}
```
### Return Type
Recall that executing the `JoinGroup` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `JoinGroupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface JoinGroupData {
  groupMembership_insert: GroupMembership_Key;
}
```
### Using `JoinGroup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, joinGroup, JoinGroupVariables } from '@dataconnect/generated';

// The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`:
const joinGroupVars: JoinGroupVariables = {
  groupId: ..., 
};

// Call the `joinGroup()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await joinGroup(joinGroupVars);
// Variables can be defined inline as well.
const { data } = await joinGroup({ groupId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await joinGroup(dataConnect, joinGroupVars);

console.log(data.groupMembership_insert);

// Or, you can use the `Promise` API.
joinGroup(joinGroupVars).then((response) => {
  const data = response.data;
  console.log(data.groupMembership_insert);
});
```

### Using `JoinGroup`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, joinGroupRef, JoinGroupVariables } from '@dataconnect/generated';

// The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`:
const joinGroupVars: JoinGroupVariables = {
  groupId: ..., 
};

// Call the `joinGroupRef()` function to get a reference to the mutation.
const ref = joinGroupRef(joinGroupVars);
// Variables can be defined inline as well.
const ref = joinGroupRef({ groupId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = joinGroupRef(dataConnect, joinGroupVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.groupMembership_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.groupMembership_insert);
});
```

