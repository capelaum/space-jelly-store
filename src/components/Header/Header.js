import Container from '@components/Container'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaShoppingCart } from 'react-icons/fa'
import { useSnipcart } from 'use-snipcart'
import styles from './Header.module.scss'

const Header = () => {
  const { locale: activeLocal, locales, asPath } = useRouter()

  const availableLocales = locales.filter((locale) => locale !== activeLocal)

  const { cart = {} } = useSnipcart()

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a>Space Jelly</a>
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <Link href="/categories/apparel">
              <a>Apparel</a>
            </Link>
          </li>
          <li>
            <Link href="/categories/accessories">
              <a>Acessories</a>
            </Link>
          </li>
          <li>
            <Link href="/stores">
              <a>Find a Store</a>
            </Link>
          </li>
        </ul>
        <p className={styles.headerCart}>
          <button className="snipcart-checkout">
            <FaShoppingCart />
            <span>$ {cart.subtotal?.toFixed(2)} </span>
          </button>
        </p>
        <ul className={styles.headerLocales}>
          {availableLocales.map((availableLocale) => (
            <li key={availableLocale}>
              <Link href={asPath} locale={availableLocale}>
                <a>{availableLocale.toUpperCase()}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </header>
  )
}

export default Header
