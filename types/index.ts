/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageSourcePropType, KeyboardTypeOptions } from 'react-native'
import { Models } from 'react-native-appwrite'

export interface GlobalContextType {
  isLogged: boolean
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
  user: Models.Document | null
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>
  loading: boolean
}

export interface CustomButtonPropsType {
  title: string
  handlePress: () => void
  containerStyles?: string
  textStyles?: string
  isLoading?: boolean
}

export interface FormFieldPropsType {
  title: string
  value: string
  placeholder?: string
  handleChangeText: (e: string) => void
  otherStyles?: string
  keyboardType?: KeyboardTypeOptions | undefined
}

export interface TabIconProps {
  icon: ImageSourcePropType
  color: string
  name: string
  focused: boolean
}

export interface SignInFormType {
  email: string
  password: string
}

export interface SignUpFormType {
  username: string
  email: string
  password: string
}

export type AppWriteConfigType = {
  endpoint: string
  platform: string
  projectId: string
  databaseId: string
  userCollectionId: string
  videoCollectionId: string
  storageId: string
}

export type EmptyStatePropsType = {
  title: string
  subtitle: string
}

export type TrendingPropsType = {
  posts: Models.Document[]
}

export type TrendingItemPropsType = {
  activeItem: Models.Document | string
  item: Models.Document
}

export type VideoCardPropsType = {
  title: string
  creator: string
  avatar: string
  thumbnail: string
  video: string
}

export type InfoBoxPropsType = {
  title: string | number
  subtitle?: string
  titleStyles?: string
  containerStyles?: string
}

export type CreateVideoFormType = {
  title: string
  video: any
  thumbnail: any
  prompt: string
}
