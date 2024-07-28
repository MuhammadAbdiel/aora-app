import { getCurrentUser } from '@/lib/appwrite'
import { GlobalContextType } from '@/types'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react'
import { Alert } from 'react-native'
import { Models } from 'react-native-appwrite'

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}

const GlobalProvider: React.FC<PropsWithChildren<object>> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [user, setUser] = useState<Models.Document | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true)
          setUser(res)
        } else {
          setIsLogged(false)
          setUser(null)
        }
      })
      .catch((error) => {
        Alert.alert('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
