/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppWriteConfigType, CreateVideoFormType } from '@/types'
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Models,
  Query,
  Storage,
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
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (
  username: string,
  email: string,
  password: string,
): Promise<Models.Document> => {
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
        avatar: avatarUrl,
      },
    )

    return newUser
  } catch (error: any) {
    throw new Error(error)
  }
}

export const signIn = async (
  email: string,
  password: string,
): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAccount = async (): Promise<
  Models.User<Models.Preferences>
> => {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getCurrentUser = async (): Promise<Models.Document | null> => {
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

export const signOut = async (): Promise<object> => {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export const uploadFile = async (file: any, type: string): Promise<any> => {
  if (!file) return

  const { mimeType, ...rest } = file
  const asset = { type: mimeType, ...rest }

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset,
    )

    const fileUrl = await getFilePreview(uploadedFile.$id, type)
    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getFilePreview = async (
  fileId: string,
  type: string,
): Promise<any> => {
  let fileUrl

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(config.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        'top' as ImageGravity,
        100,
      )
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

export const createVideoPost = async (
  form: CreateVideoFormType,
  userId: string,
): Promise<Models.Document> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: userId,
      },
    )

    return newPost
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAllPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt')],
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getUserPosts = async (
  userId: string,
): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')],
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const searchPosts = async (
  query: string | string[] | undefined,
): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search('title', query as string)],
    )

    if (!posts) throw new Error('Something went wrong')

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getLatestPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)],
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}
