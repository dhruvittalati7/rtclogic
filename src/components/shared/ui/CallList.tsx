import React from 'react'
import { mem } from 'src/utils/mem'
import { TCallItem } from 'src/services/DialService'
import { IState } from 'src/store/state'
import { connect } from 'react-redux'
import { Item } from 'src/components/shared/ui/callList/Item'
import styles from 'src/components/shared/ui/CallList.module.scss'

interface Props {
  calls: TCallItem[]
}

const CallList = mem(({ calls }: Props) => {
  if (!calls.length) {
    return null
  }

  return (
    <div className={styles.root}>
      {calls.map(i => {
        return <Item key={i.id} call={i} />
      })}
    </div>
  )
})

const mapStateToProps = (state: IState): Props => ({
  calls: state.app.calls.callBlock,
})

const CallListConnected = connect(mapStateToProps)(CallList)
export { CallListConnected as CallList }
