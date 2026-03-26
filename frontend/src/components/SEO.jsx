import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'

/**
 * SEO component for managing document head meta tags
 * Uses react-helmet-async to dynamically set title, description, and Open Graph tags
 */
function SEO({ title, description, ogImage, url }) {
  const siteTitle = 'CarrerPortal'

  // Strip emojis from title if present
  const cleanTitle = title ? title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : ''

  const fullTitle = cleanTitle ? `${cleanTitle} | ${siteTitle}` : siteTitle
  const defaultDescription =
    'Skill-based career recommendations, expert consultations, and career development resources.'
  const metaDescription = description || defaultDescription
  const defaultOgImage = '/og-image.jpg' // Default Open Graph image
  const ogImageUrl = ogImage || defaultOgImage
  const siteUrl = url || window.location.href

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImageUrl} />
    </Helmet>
  )
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ogImage: PropTypes.string,
  url: PropTypes.string,
}

export default SEO
