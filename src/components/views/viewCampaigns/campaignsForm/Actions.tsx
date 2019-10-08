import React from 'react'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { Button } from 'src/components/shared/ui/Button'
import styles from './Actions.module.scss'

interface Props {
  submitTitle: string
  canSubmit: boolean
  canDelete: boolean
  onDelete: () => void
}

export const CampaignsFormActions = ({ submitTitle, canSubmit, canDelete, onDelete }: Props) => (
  <div className={styles.root}>
    {canDelete && <Button onClick={onDelete} className={styles.delete}>Delete</Button>}
    <FormFieldSubmit className={styles.submit} disabled={!canSubmit}>{submitTitle}</FormFieldSubmit>
  </div>
)
