/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppWriteConfigType } from '@/types'
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from 'react-native-appwrite'

const config: AppWriteConfigType = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT ?? '',
  platform: process.env.EXPO_PUBLIC_PLATFORM ?? '',
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID ?? '',
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID ?? '',
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID ?? '',
  videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID ?? '',
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID ?? '',
}

const client = new Client()

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatarUrl,
      },
    )

    return newUser
  } catch (error: any) {
    throw new Error(error)
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)],
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    return null
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}