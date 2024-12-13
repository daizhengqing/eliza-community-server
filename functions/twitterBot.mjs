import axios from "axios"
import OAuth from 'oauth-1.0a'

const SYSTEM_PROMPT = `
`

export default async (req, context) => {
  // if (req.method === 'OPTIONS') return new Response('ok', { status: 200 })
  const api_key = Netlify.env.get('API_KEY')

  const res = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    model: 'glm-4-flash',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
    ],
    tools: [{
      'type': 'web_search',
      'web_search': {
        enable: true,
        search_result: true
      }
    }]
  }, {
    headers: {
      'Authorization': 'Bearer ' + api_key,
      'Content-Type': 'application/json'
    }
  })

  const text = res.data.choices[0].message.content

  console.log(text)

  const oauth = OAuth({
    consumer: {
      key: Netlify.env.get('X_CONSUMER_KEY'),
      secret: Netlify.env.get('X_CONSUMER_SECRET')
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest
  })

  const token = {
    key: Netlify.env.get('X_ACCESS_TOKEN'),
    secret: Netlify.env.get('X_ACCESS_TOKEN_SECRET')
  }

  const request = {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST',
    data: {
      text
    }
  }

  const headers = oauth.toHeader(oauth.authorize(request, token))

  axios({
    url: request.url,
    method: request.method,
    data: request.data,
    headers: headers
  }).then(console.log).catch(console.log)
}