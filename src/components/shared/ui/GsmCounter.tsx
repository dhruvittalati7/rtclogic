import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import gsm from 'gsm'
import classNames from 'classnames'
import { priceService } from 'src/services/PriceService'
import { formatMoney } from 'src/helpers/PriceHelper'
import styles from './GsmCounter.module.scss'

interface Props {
  value: string
  onlySmsCount?: boolean
  smsLimit?: number
  className?: string
  calcPrice?: {
    targetNumbers: string[]
    sourceNumberId: number
  }
  getCampaignPrice?: (sourceNumberId: number, targetNumbers: string[], text: string) => Promise<null | number>
  onValidate?: (isValid: boolean) => void
}

const GsmCounter = React.memo(({ value, calcPrice, onlySmsCount, smsLimit, onValidate, className, getCampaignPrice }: Props) => {
  const [price, setPrice] = React.useState<null | number>(null)
  const parts = gsm(value)
  const limitError = !!smsLimit && parts.sms_count > smsLimit

  if (smsLimit && onValidate) {
    onValidate(!limitError)
  }

  React.useEffect(() => {
    if (calcPrice && getCampaignPrice) {
      const { sourceNumberId, targetNumbers } = calcPrice
      getCampaignPrice(sourceNumberId, targetNumbers, value)
        .then(setPrice)
        .catch(window.logger.error)
    }
  }, [value, setPrice, calcPrice, getCampaignPrice])

  return (
    <div className={classNames(styles.root, limitError && styles.limitError, className)}>
      {calcPrice && price !== null && (
        <>
          price <span>{formatMoney(price, 3)}</span>
          <span className={styles.space} />
        </>
      )}
      sms <span>{parts.sms_count || 1}</span>
      {!!smsLimit && (<> /<span>{smsLimit}</span></>)}

      {!onlySmsCount && (
        <>
          <span className={styles.space} />
          chars left <span>{parts.chars_left}</span>
        </>
      )}
    </div>
  )
})

const mapStateToProps = (
  state: IState,
  props: Pick<Props, 'value' | 'calcPrice' | 'onlySmsCount' | 'smsLimit' | 'onValidate' | 'className'>
): Props => ({

  value: props.value,
  calcPrice: props.calcPrice,
  onlySmsCount: props.onlySmsCount,
  smsLimit: props.smsLimit,
  className: props.className,
  onValidate: props.onValidate,
  getCampaignPrice: priceService.getCampaignPrice,
})

const GsmCounterConnected = connect(mapStateToProps)(GsmCounter)

export { GsmCounterConnected as GsmCounter }
