const domain = import.meta.env.WP_DOMAIN
const apiUrl = `${domain}/wp-json/wp/v2`

if (!domain) {
  throw new Error("VITE_WP_DOMAIN is not set. Add it to your .env");
}


export const getPages = async (slug: string) => {

    console.log(slug)
  
    const res = await fetch(`${apiUrl}/pages?slug=${slug}`)
    if (!res.ok) {
        throw new Error('Failed to fetch pages')
    }

   
    
    return []
}

