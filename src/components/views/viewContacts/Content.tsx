import React, { useState } from 'react'
import { ViewContactsContentSearch } from './content/Search'
import { ViewContactsContentTable } from './content/Table'
import styles from './Content.module.scss'
import { useValueStore } from 'src/hooks/useValueStore'
import { NewChatBox } from 'src/components/shared/ui/chat/NewChatBox'
import { ViewContactsContentBottom } from './content/Bottom'
import posed from 'react-pose'

const ViewContactsContent = () => {
  const { values, handleValue, clear } = useValueStore<number>([])
  const [show, setShow] = useState<boolean>(false)

  const onClose = () => {
    setShow(false)
  }

  return (
    <>
      <div className={styles.top}>
        <ViewContactsContentSearch />
      </div>
      <ViewContactsContentTable handleRowSelection={handleValue} selected={values} />
      <Animated initialPose="start" pose={!values.length ? 'finish' : 'active'}>
        <ViewContactsContentBottom setShow={setShow} values={values} clear={clear} />
      </Animated>

      <NewChatBox show={show} onClose={onClose} participantIds={values} />
    </>
  )
}

const Connected = ViewContactsContent
export { Connected as ViewContactsContent }

const Animated = posed.div({
  start: { y: 70, opacity: 0 },
  active: { y: 1, opacity: 1, transition: { duration: 400 } },
  finish: { y: 70, opacity: 0, transition: { duration: 400 } },
})
