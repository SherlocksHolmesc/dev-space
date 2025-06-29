import { useState } from 'react'

interface AuditTrailData {
  wallet_address: string
  contract_address: string
  metadata: any
  callback_url: string
  category_id?: number[]
  tag_id?: number[]
  file?: File | null
}

interface AuditTrailResponse {
  status: number
  result: {
    transactionHash: string
    nonce: number
    status: string
    metadatahash: string
    metadata: string
    form: string
  }
}

export const useAuditTrail = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAuditTrail = async (data: AuditTrailData): Promise<AuditTrailResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://service-testnet.maschain.com/api/audit/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client_id': '1c8bcb435a9ccd5bed886c793c2aff94db6854fa350f648d3a5679326a173e5d',
          'client_secret': 'sk_a2cfd625fdbc7c2c75b45734cc7dea4fa44fc4220737887a7f60256a6c97903b',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create audit trail')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getAuditTrails = async (category?: string, tag?: string) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (tag) params.append('tag', tag)

      const url = `/api/audit-trail${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch audit trails')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createAuditTrail,
    getAuditTrails,
    loading,
    error,
  }
} 