import { findMenuItem } from '$lib/menu.js'
import { error } from '@sveltejs/kit'
import { pageQuery } from '../../+page.svelte'
import { client } from '../../../client'

export const load = async (event) => {
  const { url, parent } = event

  // Page
  const handle = url.pathname.split('/').at(-1) ?? ''
  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('Page query failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const page = pageResponse.data?.page
  if (!page) {
    error(404, 'Kan inte hitta sidan')
  }

  const { menu } = await parent()

  // Links
  const links = findMenuItem(menu, url.pathname)?.children

  return {
    page,
    links,
  }
}
