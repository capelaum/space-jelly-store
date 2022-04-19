import { gql } from '@apollo/client'
import Button from '@components/Button'
import Container from '@components/Container'
import Layout from '@components/Layout'
import styles from '@styles/Page.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { apolloClient } from 'src/clients/apollo'
import { buildImage } from 'src/services/cloudinary'

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home

  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <Image
                className={styles.heroImage}
                src={buildImage(heroBackground.public_id).toURL()}
                width={heroBackground.width}
                height={heroBackground.height}
                alt="Hero image"
              />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map(({ id, name, price, slug, image }) => {
            const imageUrl = buildImage(image.public_id)
              .resize('w_900,h_900')
              .toURL()

            return (
              <li key={slug}>
                <Link href={`/products/${slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        width={image.width}
                        height={image.height}
                        src={imageUrl}
                        alt={name}
                      />
                    </div>
                    <h3 className={styles.productTitle}>{name}</h3>
                    <p className={styles.productPrice}>${price}</p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={id}
                    data-item-price={price}
                    data-item-url={`/products/${slug}`}
                    data-item-image={image.url}
                    data-item-name={name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageHome($locale: Locale!) {
        page(where: { slug: "home" }) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground
          localizations(locales: [$locale]) {
            heroText
            heroTitle
            locale
          }
        }
        products(where: { categories_some: { slug: "featured" } }) {
          id
          name
          price
          slug
          image
        }
      }
    `,
    variables: { locale },
  })

  let home = data.page

  if (home.localizations.length > 0) {
    home = {
      ...home,
      ...home.localizations[0],
    }
  }

  const { products } = data

  return {
    props: {
      home,
      products,
    },
  }
}
