import React from 'react'
import classNames from 'classnames'
import { Switch } from 'src/components/shared/ui/Switch'
import { FormFieldDateTime } from 'src/components/shared/ui/form/formField/DateTime'
import { TForm } from '../CampaignsForm'
import styles from './FieldSchedule.module.scss'

interface Props {
  values: TForm
  handleField: (name: keyof TForm) => any
}

export const CampaignsFormFieldSchedule = ({ values, handleField }: Props) => {
  const minDateRef = React.useRef(new Date())

  return (
    <div className={styles.root}>
      <div>
        <Switch
          label={'Schedule launch'}
          {...handleField('scheduled')}
        />
      </div>

      <div className={classNames(styles.schedule, values.scheduled && styles.active)}>
        <FormFieldDateTime
          label={'Launch date and time (UTC)'}
          minDate={minDateRef.current}
          {...handleField('dateTime')}
        />
      </div>
    </div>
  )
}
