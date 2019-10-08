import React from 'react'
import classNames from 'classnames'
import { Loader } from 'src/components/shared/ui/Loader'
import { ChevronIcon } from 'src/components/shared/ui/Icons'
import styles from './DynamicList.module.scss'
import { debugChanges } from 'src/helpers/DebugHelper'

interface Props<T> {
  items: T[]
  offset?: number
  initialScrollId?: number | string
  enableFetch?: boolean
  isLoading?: boolean
  hasPrev: boolean
  hasNext: boolean
  fetch?: () => Promise<number>
  fetchPrev: () => Promise<number>
  fetchNext: () => Promise<number>
  fetchLast?: () => void
  render: (item: T) => React.ReactNode
  classes?: {
    root?: string
    list?: string
    item?: string
  }
}

interface State {
  isFetching: boolean
}

interface BaseItem {
  id: number | string
}

export class DynamicList<T extends BaseItem> extends React.PureComponent<Props<T>, State> {
  public state: State = {
    isFetching: false,
  }
  private preserveScroll = false
  private container: null | HTMLDivElement = null
  private isScrolled: boolean = false

  public async componentDidMount() {
    const { fetch, enableFetch = true } = this.props
    if (fetch && enableFetch) {
      this.setState({ isFetching: true })
      await fetch()
      this.setState({ isFetching: false })
    }
  }

  public async componentWillUnmount() {
    if (this.container) {
      this.container.removeEventListener('scroll', this.onScroll)
    }
  }

  public getSnapshotBeforeUpdate(prevProps: Props<T>, prevState: State): null | number {
    if (this.container && this.preserveScroll) {
      return this.container.scrollHeight - (this.container.scrollTop + this.container.clientHeight)
    }
    return null
  }

  public async componentDidUpdate(prevProps: Props<T>, prevState: State, bottomScroll: null | number) {
    if (prevProps.initialScrollId !== this.props.initialScrollId) {
      this.isScrolled = false
      this.initialScroll()
    }

    if (this.container && this.props.items.length - prevProps.items.length === 1 && !this.props.hasNext) {
      this.container.scrollTop = this.container.scrollHeight
    }

    if (this.container && prevProps.items !== this.props.items && this.preserveScroll && bottomScroll !== null) {
      this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight - bottomScroll
      this.preserveScroll = false
    }
  }

  public render() {
    const { items, render, classes, isLoading, fetchLast, enableFetch, hasNext } = this.props
    const { isFetching } = this.state
    const isFetchingPrev = (isLoading || isFetching) && this.preserveScroll
    const isFetchingNext = (isLoading || isFetching) && !this.preserveScroll
    debugChanges(this.props, this.state)

    return (
      <>
        {isFetchingPrev && <Loader className={styles.loaderTop} />}
        {isFetchingNext && <Loader className={styles.loaderBottom} />}
        {hasNext && enableFetch && (
          <div className={styles.toBottom} onClick={() => fetchLast && fetchLast()}>
            <ChevronIcon className={styles.icon} width={30} />
          </div>
        )}

        <div ref={this.setContainer} className={classNames(styles.root, classes && classes.root)}>
          <div className={classNames(styles.list, classes && classes.list)}>
            {items.map(item => (
              <div
                className={classNames(classes && classes.item)}
                key={item.id}
                data-id={item.id}
              >
                {render(item)}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  private setContainer = (container: HTMLDivElement) => {
    if (container) {
      this.container = container
      this.container.addEventListener('scroll', this.onScroll)
      this.initialScroll()
    }
  }

  private initialScroll = () => {
    const { initialScrollId } = this.props
    if (this.container && this.props.items && !this.isScrolled) {
      if (initialScrollId) {
        const item = this.container.querySelector(`[data-id="${initialScrollId}"]`) as HTMLDivElement
        if (item) {
          this.container.scrollTop = item.offsetTop
          this.isScrolled = true
        }
      } else {
        this.container.scrollTop = this.container.scrollHeight
        this.isScrolled = true
      }
    }
  }

  private onScroll = async () => {
    const { offset = 100, fetchPrev, fetchNext, hasPrev, hasNext, enableFetch = true } = this.props
    const { isFetching } = this.state

    if (this.container && !isFetching && enableFetch) {
      const top = this.container.scrollTop
      const bottom = this.container.scrollHeight - (this.container.scrollTop + this.container.clientHeight)

      if (top <= offset && hasPrev) {
        this.setState({ isFetching: true })
        this.preserveScroll = true
        await fetchPrev()
        this.setState({ isFetching: false })
      }

      if (bottom <= offset && hasNext) {
        this.setState({ isFetching: true })
        await fetchNext()
        this.setState({ isFetching: false })
      }
    }
  }
}
