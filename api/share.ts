interface ShareRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  body?: unknown
}

interface ShareResponse {
  status: (code: number) => ShareResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

const restUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const restToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

export default async function handler(req: ShareRequest, res: ShareResponse) {
  if (!restUrl || !restToken) {
    res.status(500).json({ error: 'KV no configurado' })
    return
  }

  const rawToken = req.query.token
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken
  if (!token) {
    res.status(400).json({ error: 'Token requerido' })
    return
  }

  const headers = { Authorization: `Bearer ${restToken}` }
  const key = `share:${token}`

  if (req.method === 'PUT') {
    const response = await fetch(`${restUrl}/set/${key}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    })
    if (!response.ok) {
      res.status(502).json({ error: 'No se pudo guardar' })
      return
    }
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ ok: true })
    return
  }

  const response = await fetch(`${restUrl}/get/${key}`, { headers })
  if (!response.ok) {
    res.status(502).json({ error: 'No se pudo leer' })
    return
  }

  const data = (await response.json()) as { result?: string | null }
  res.setHeader('Cache-Control', 'no-store')
  if (!data.result) {
    res.status(404).json({ error: 'Lista no encontrada' })
    return
  }
  res.status(200).json(JSON.parse(data.result))
}
