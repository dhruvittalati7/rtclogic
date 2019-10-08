import React from 'react'
import { ViewAdminNumbersTable } from 'src/components/views/viewAdmin/numbers/Table'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { RouteComponentProps, withRouter } from 'react-router'

interface Props {
  type: number
}

const ViewAdminNumbersContent = ({ type }: Props) => {
  return (
    <>
      <ViewAdminNumbersTable type={type} />
    </>
  )
}

const mapStateToProps = (state: IState, ownProps: RouteComponentProps<{ type: string }>): Props => ({
  type: ownProps.match.params.type === 'virtual' ? 1 : 2,
})

const ViewAdminNumbersContentConnected = withRouter(connect(mapStateToProps)(ViewAdminNumbersContent))
export { ViewAdminNumbersContentConnected as ViewAdminNumbersContent }
