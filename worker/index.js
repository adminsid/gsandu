import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => c.text('GS&U Management API - Exceeding your networking needs.'))

app.get('/api/health', (c) => c.json({ status: 'ok', message: 'API is running' }))

// Advanced Directory endpoint with AI Semantic Search
app.get('/api/directory', async (c) => {
  const db = c.env.DB
  const ai = c.env.AI
  const vectorize = c.env.VECTORIZE
  const query = c.req.query('q') || ''
  const categoryId = c.req.query('category') || ''

  try {
    let finalResults = [];
    
    if (query) {
      // 1. Generate embedding for user query
      const { data } = await ai.run('@cf/baai/bge-base-en-v1.5', { text: [query] })
      const embedding = data[0]
      
      // 2. Query Vectorize index for similar listings
      const vectorRes = await vectorize.query(embedding, { topK: 15 })
      const matchIds = vectorRes.matches.map(m => parseInt(m.id))
      
      if (matchIds.length > 0) {
        // 3. Fetch matching IDs from D1
        const placeholders = matchIds.map(() => '?').join(',')
        let sql = `
          SELECT l.*, c.name as category_name
          FROM listings l
          LEFT JOIN categories c ON l.category_id = c.id
          WHERE l.id IN (${placeholders})
        `
        const params = [...matchIds]
        
        if (categoryId) {
          sql += ` AND l.category_id = ?`
          params.push(categoryId)
        }
        
        const { results: dbResults } = await db.prepare(sql).bind(...params).all()
        
        // Sort results by similarity score inherently provided by Vectorize order
        finalResults = matchIds
            .map(id => dbResults.find(r => r.id === id))
            .filter(Boolean)
      }
    } else {
       // Regular fetch if no query (sorted by sponsor status)
       let sql = `
          SELECT l.*, c.name as category_name
          FROM listings l
          LEFT JOIN categories c ON l.category_id = c.id
          WHERE 1=1
       `
       const params = []
       if (categoryId) {
         sql += ` AND l.category_id = ?`
         params.push(categoryId)
       }
       sql += ` ORDER BY l.is_sponsored DESC, l.created_at DESC`
       const { results: dbResults } = await db.prepare(sql).bind(...params).all()
       finalResults = dbResults
    }

    const categoriesRes = await db.prepare('SELECT * FROM categories').all()

    return c.json({ 
      data: finalResults,
      categories: categoriesRes.results
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Endpoint to index listings into Vectorize Database
app.post('/api/admin/index', async (c) => {
  const db = c.env.DB
  const ai = c.env.AI
  const vectorize = c.env.VECTORIZE
  
  try {
    const { results } = await db.prepare('SELECT * FROM listings').all()
    if(results.length === 0) return c.json({ status: 'No listings' })
    
    const vectors = []
    // Process embeddings sequentially to avoid rate limits on free tier
    for(const listing of results) {
       const textToEmbed = `${listing.name}. ${listing.description}`
       const { data } = await ai.run('@cf/baai/bge-base-en-v1.5', { text: [textToEmbed] })
       vectors.push({
         id: listing.id.toString(),
         values: data[0]
       })
    }
    
    const inserted = await vectorize.upsert(vectors)
    return c.json({ status: 'Indexed', count: inserted.mutationId })
  } catch (e) {
    return c.json({ error: e.message }, 500)
  }
})

// News endpoint
app.get('/api/news', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare('SELECT * FROM news ORDER BY published_at DESC LIMIT 10').all()
    return c.json({ data: results })
  } catch (e) {
     return c.json({ error: e.message }, 500)
  }
})

// NYC Open Data - Community Resources Proxy
app.get('/api/resources', async (c) => {
  try {
     // Food providers data from NYC Open Data
     const response = await fetch('https://data.cityofnewyork.us/resource/ymjc-b4c6.json?$limit=8')
     
     if (!response.ok) {
        // Fallback or handle error
        return c.json({ data: [] })
     }
     
     const data = await response.json()
     return c.json({ data })
  } catch (error) {
     return c.json({ error: error.message }, 500)
  }
})

// Lead Generation Endpoint
app.post('/api/leads', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const result = await db.prepare('INSERT INTO leads (listing_id, sender_name, sender_email, message) VALUES (?, ?, ?, ?)')
      .bind(body.listing_id, body.name, body.email, body.message)
      .run()
    return c.json({ success: true })
  } catch (e) {
    return c.json({ error: e.message }, 500)
  }
})

export default app
