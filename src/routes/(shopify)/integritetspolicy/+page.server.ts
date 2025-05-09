import { Liquid } from 'liquidjs'
import { client } from '../../../client'
import { graphql } from '../../../graphql'
import { error } from '@sveltejs/kit'

export const load = async (event) => {
  const { parent, url, fetch } = event

  const response = await client.query(
    graphql(`
      query Shop {
        shop {
          name
          primaryDomain {
            url
          }
          privacyPolicy {
            title
            body
          }
        }
      }
    `),
    {},
    { fetch },
  )
  if (response.error) {
    console.error('MainMenuQuery failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  if (!response.data?.shop.privacyPolicy?.body) {
    error(404, 'Hittar inte sidan')
  }

  const { title, body } = response.data.shop.privacyPolicy

  let page: string
  try {
    const engine = new Liquid()
    const tpl = engine.parse(body)
    page = await engine.render(tpl, {})
  } catch (e) {
    error(500, 'Oj, vi kan inte visa sidan. Error: ' + e)
  }

  return {
    title,
    page,
  }
}
