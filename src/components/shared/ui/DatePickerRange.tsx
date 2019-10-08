import React from 'react'
import DayPicker, { DateUtils, RangeModifier } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import 'src/components/shared/ui/DatePickerRange.css'
import { listenClickOutside } from 'src/helpers/HtmlHelper'
import styles from './DatePickerRange.module.scss'

interface Props {
  range: RangeModifier
  onApplyRange: (range: RangeModifier) => void
}

interface State {
  range: RangeModifier
}

export class DatePickerRange extends React.PureComponent<Props, State> {
  protected rootRef?: HTMLDivElement
  protected outClickDestroyer?: () => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      range: props.range,
    }
  }

  public componentWillUnmount() {
    if (this.outClickDestroyer) {
      this.outClickDestroyer()
    }
  }

  public render(): React.ReactNode {
    const { range } = this.state
    const modifiers = { start: range.from, end: range.to }

    return (
      <div className={styles.datapicker} ref={this.setRootRef}>
        <DayPicker
          className={'Selectable'}
          selectedDays={[range.from, { from: range.from, to: range.to }]}
          modifiers={modifiers}
          onDayClick={this.onDayClick}
        />
        <div className={styles.footer}>
          <div className={styles.button} onClick={() => this.onApplyRange()}>
            Apply
          </div>
        </div>
      </div>
    )
  }

  protected onApplyRange = () => {
    this.props.onApplyRange(this.state.range)
  }

  protected onDayClick = (day: Date) => {
    // @ts-ignore
    const range = DateUtils.addDayToRange(day, this.state.range)
    this.setState({ range })
  }

  protected setRootRef = (ref: HTMLDivElement) => {
    this.rootRef = ref
    this.outClickDestroyer = listenClickOutside(ref, this.onApplyRange)
  }
}
