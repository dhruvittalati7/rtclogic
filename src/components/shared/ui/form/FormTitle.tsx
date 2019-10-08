import React from 'react'
import classNames from 'classnames'
import styles from './FormTitle.module.scss'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const FormTitle = (props: Props) => <div {...props} className={classNames(styles.root, styles.dark, props.className)} />
