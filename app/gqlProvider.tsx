'use client'
import { useMemo } from 'react'
import {
  UrqlProvider,
  createClient,
  fetchExchange,
  ssrExchange,
} from '@urql/next'
import { url } from '@/utils/url'
import { cacheExchange } from '@urql/exchange-graphcache'

import { getToken } from '@/utils/token'

const GQLProvider = ({ children }) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    })
    const client = createClient({
      url,
      exchanges: [cacheExchange({}), ssr, fetchExchange],
      fetchOptions: () => {
        const token = getToken()
        return token ? { headers: { authorization: `Bearer ${token}` } } : {}
      },
    })
    return [client, ssr]
  }, [])
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}

export default GQLProvider
