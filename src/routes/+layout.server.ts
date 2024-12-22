import { mainMenuQuery } from '$lib/components/NavMenu.gql'
import { makeMenu } from '$lib/menu'
import { error } from '@sveltejs/kit'
import { client } from '../client'

export async function load({ fetch }) {
  const mainMenuResponse = await client.query(mainMenuQuery, {}, { fetch })
  if (mainMenuResponse.error) {
    console.error('MainMenuQuery failed', mainMenuResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const menu = makeMenu(mainMenuResponse.data?.menu)

  return {
    // maxage: 3600,
    menu,
  }
}
