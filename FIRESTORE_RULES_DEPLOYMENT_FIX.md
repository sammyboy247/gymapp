# Friend Request Permission Fix - RESOLVED ✅

## Problem
Users were getting "Missing or insufficient permissions" error when trying to send friend requests.

## Root Cause (Updated)
The issue was NOT missing Firestore rules deployment. The actual problem was in the `friendService.ts` implementation:

The `sendFriendRequest` function used a batch write that attempted to update **both users' documents**:
- Update sender's document (allowed)
- Update recipient's document (DENIED - user cannot update another user's profile)

This violated the Firestore security rule: `allow update: if isOwner(userId) || isAdmin();`

## Solution - Code Fix (Completed ✅)

The fix involved removing user document updates from friend request operations. Instead of maintaining `friendRequestsSent` and `friendRequestsReceived` arrays in user documents, we query directly from the `friendRequests` collection.

### Changes Made to `src/services/firebase/friendService.ts`:

1. **`sendFriendRequest`** - Simplified to only create the friend request document:
   ```typescript
   export const sendFriendRequest = async (fromUserId: string, toUserId: string) => {
     const newRequestRef = doc(friendRequestsCollection);
     await setDoc(newRequestRef, {
       fromUserId,
       toUserId,
       status: 'pending',
       createdAt: serverTimestamp(),
     });
   };
   ```

2. **`acceptFriendRequest`** - Removed user document array updates:
   - Only updates request status to 'accepted'
   - Creates friendship document
   - No longer updates user documents

3. **`denyFriendRequest`** - Simplified to only update request status

4. **`cancelFriendRequest`** - Simplified to only delete request document

5. **`removeFriend`** - Query and delete friendship document only

6. **`getUserFriends`** - Now queries from `friendships` collection instead of reading from user document arrays

### Verification (Tested ✅)
1. Login as member2@gymapp.com
2. Navigate to Social page
3. Search for member1 by Friend ID "User8742"
4. Click "Send Request"
5. ✅ **Success!** Toast shows "Friend request sent to member1"

## Technical Details

### Current Rule Structure (firestore.rules)

The local rules file has the correct permissions for friend requests:

```javascript
// Friend Requests collection - FriendRequest documents
match /friendRequests/{requestId} {
  // Users can read requests involving them
  allow read: if isAuthenticated() && (
    resource.data.fromUserId == request.auth.uid ||
    resource.data.toUserId == request.auth.uid
  );

  // Users can create friend requests from themselves
  allow create: if isAuthenticated() &&
    request.resource.data.fromUserId == request.auth.uid;

  // Users can update requests sent to them (accepting/denying)
  allow update: if isAuthenticated() &&
    resource.data.toUserId == request.auth.uid;

  // Users can delete their own sent requests
  allow delete: if isAuthenticated() &&
    resource.data.fromUserId == request.auth.uid;
}
```

**Key Permission:**
- Line 109: `allow create: if isAuthenticated() && request.resource.data.fromUserId == request.auth.uid;`
  - This allows any authenticated user to create a friend request **from themselves**
  - Prevents users from creating requests on behalf of others
  - Validates that `fromUserId` matches the current user's UID

### Data Structure Validation

The friend request service creates documents with this structure:

```typescript
{
  fromUserId: string,      // Sender's UID
  toUserId: string,        // Recipient's UID
  status: 'pending',       // Request status
  createdAt: Timestamp     // Creation time
}
```

This matches the security rule expectations.

### Friendships Collection Rules

Similarly, the friendships collection rules are correct:

```javascript
match /friendships/{friendshipId} {
  // Users can read friendships they're part of
  allow read: if isAuthenticated() && (
    resource.data.user1Id == request.auth.uid ||
    resource.data.user2Id == request.auth.uid
  );

  // Users can create if they're one of the parties
  allow create: if isAuthenticated() && (
    request.resource.data.user1Id == request.auth.uid ||
    request.resource.data.user2Id == request.auth.uid
  );

  // Users can update their own activity sharing preference
  allow update: if isAuthenticated() && (
    (resource.data.user1Id == request.auth.uid &&
     request.resource.data.user1ShareActivity != resource.data.user1ShareActivity) ||
    (resource.data.user2Id == request.auth.uid &&
     request.resource.data.user2ShareActivity != resource.data.user2ShareActivity)
  );
}
```

## Why Deployment is Required

Firestore security rules are **server-side** configurations. They are not part of your application bundle. The local `firestore.rules` file is just a specification - it must be deployed to Firebase using the Firebase CLI.

**Important:**
- Changes to `firestore.rules` only take effect after deployment
- Git commits do NOT deploy rules automatically
- Must use `firebase deploy --only firestore:rules` to apply changes

## Verification Checklist

After deployment, verify:

- [ ] Firebase CLI authentication successful
- [ ] Rules deployed without errors
- [ ] Firebase Console shows updated rules
- [ ] Friend requests can be sent without errors
- [ ] Friend requests can be accepted/denied
- [ ] Friendship creation works
- [ ] Activity sharing toggle works

## Alternative: Manual Deployment via Console

If CLI deployment continues to fail, you can manually copy rules:

1. Open `firestore.rules` in this repository
2. Copy the entire contents
3. Go to Firebase Console → Firestore → Rules
4. Paste the rules
5. Click "Publish"

## Prevention

To avoid this issue in the future:

1. **Always deploy after rule changes:**
   ```bash
   git add firestore.rules
   git commit -m "Update security rules"
   firebase deploy --only firestore:rules
   git push
   ```

2. **Document deployment in commits:**
   - Include deployment status in commit messages
   - Create deployment checklist for rule changes

3. **Test rules after deployment:**
   - Use Firebase Console Rules Playground
   - Run E2E tests that exercise permissions
   - Manually test affected features

## Related Files

- `firestore.rules` - Security rules specification
- `firestore.indexes.json` - Index definitions
- `src/services/firebase/friendService.ts` - Friend request operations
- `src/types/index.ts` - Type definitions (FriendRequest, Friendship)

## Status

**Current:** Rules defined locally but NOT deployed to Firebase
**Required:** Firebase CLI re-authentication + deployment
**Impact:** Users cannot send friend requests until rules deployed
**Priority:** HIGH - Core feature blocked

---

**Last Updated:** 2025-11-18
**Author:** Claude Code
**Issue:** Friend request permissions
