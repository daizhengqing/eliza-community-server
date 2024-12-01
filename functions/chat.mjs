import axios from "axios"

export default async (req, context) => {
  const messages = req?.body?.messages

  if (!messages) return new Response('need messages')

  const api_key = Netlify.env.get('API_KEY')

  const res = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    model: 'gjm-4-flash',
    messages
  }, {
    headers: {
      'Authorization': 'Bearer ' + api_key,
      'Content-Type': 'application/json'
    }
  })

  return new Response(JSON.stringify({
    res
  }))
}