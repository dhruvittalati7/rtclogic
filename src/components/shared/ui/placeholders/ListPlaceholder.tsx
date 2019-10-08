import React from 'react'
import ContentLoader from 'react-content-loader'
import styles from './ListPlaceholder.module.scss'

const ListPlaceholderItem = () => (
  <ContentLoader height={125} width={370} speed={1} primaryColor="#0F141E" secondaryColor="#292d39" className={styles.root}>
    <rect id="path-1" x="0" y="0" width="370" height="125" rx="10" />
  </ContentLoader>
)

export const ListPlaceholder = ({ num }: { num: number }) => (
  <>
    {Array(num)
      .fill('')
      .map((e, i) => (
        <ListPlaceholderItem key={i} />
      ))}
  </>
)
