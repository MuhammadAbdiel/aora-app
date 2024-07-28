/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import * as Animatable from 'react-native-animatable'
import {
  FlatList,
  Image,
  ImageBackground,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ViewabilityConfig,
  ViewStyle,
  ViewToken,
} from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { TrendingItemPropsType, TrendingPropsType } from '@/types'
import { Models } from 'react-native-appwrite'

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
}

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
}

const TrendingItem: React.FC<TrendingItemPropsType> = ({
  activeItem,
  item,
}: TrendingItemPropsType): JSX.Element => {
  const [play, setPlay] = useState<boolean>(false)

  return (
    <Animatable.View
      className='mr-5'
      animation={
        (activeItem === item.$id ? zoomIn : zoomOut) as
          | string
          | Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle>
          | undefined
      }
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className='w-52 h-72 rounded-[33px] mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className='relative flex justify-center items-center'
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className='w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />

          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending: React.FC<TrendingPropsType> = ({
  posts,
}: TrendingPropsType): JSX.Element => {
  const [activeItem, setActiveItem] = useState<Models.Document>(posts[0])

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key as any)
    }
  }

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={
        {
          itemVisiblePercentThreshold: 70,
        } as ViewabilityConfig
      }
      contentOffset={{ x: 170 } as { x: number; y: number }}
    />
  )
}

export default Trending
