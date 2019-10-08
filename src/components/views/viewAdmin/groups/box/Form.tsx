import React from 'react'
import * as yup from 'yup'
import { IState } from 'src/store'
import { connect, Omit } from 'react-redux'
import { Formik, FormikActions, FormikProps } from 'formik'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { FormTitle } from 'src/components/shared/ui/form/FormTitle'
import { deepClone, uniqueByField, getYupErrorsMap } from 'src/helpers/CommonHelper'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { FormFieldNumbers } from './form/FieldNumbers'
import { FormFieldMember } from 'src/components/shared/ui/form/formField/FieldMember'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { adminRoleService } from 'src/services/admin/RoleService'
import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import { adminNumberSearchService } from 'src/services/admin/NumberSearchService'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { hasAccountPermission } from 'src/helpers/AccountHelper'
import { TAccount } from 'src/models/Account'
import styles from './Form.module.scss'

const formInitialValues = {
  name: '',
  managers: [] as TAccount[],
  members: [] as TAccount[],
  numbers: [] as TAdminNumber[],
}

export type TFormValues = typeof formInitialValues
type TFormAction = FormikActions<TFormValues>

interface Props {
  onSuccess: () => void
  role: TAdminRole
  members: TAccount[]
  searchNumbers: (query: string) => void
  searchNumberList: TAdminNumber[]
  searchNumberLoading: boolean
  currentAccountPermissions: TPermission[]
}

class GroupsBoxForm extends React.PureComponent<Props> {
  private formProps?: FormikProps<TFormValues>

  public render() {
    return (
      <Formik
        onSubmit={this.submit}
        initialValues={createInitialValues(this.props.role)}
        isInitialValid={!!this.props.role.id}
        validate={this.validate}
        children={this.renderForm}
      />
    )
  }

  private renderForm = (formProps: FormikProps<TFormValues>) => {
    this.formProps = formProps
    const { role, currentAccountPermissions, searchNumbers, searchNumberList, searchNumberLoading } = this.props
    const isNew = !role.id
    const isAdmin = hasAccountPermission(currentAccountPermissions, ['admin'])
    const availableManagers = this.getAvailableManagers()
    const availableMembers = this.getAvailableMembers()
    const selectedManagers = this.getSelectedManagers()
    const selectedMembers = this.getSelectedMembers()

    return (
      <div className={styles.root}>
        <FormFrame onSubmit={formProps.handleSubmit}>
          <FormTitle>{role.id ? 'Edit' : 'Add'} Group</FormTitle>

          {isAdmin && (
            <>
              <FormFieldText
                label={'Group Name'}
                placeholder={'Enter group name'}
                hideBottom
                inputProps={{ autoComplete: 'off', autoFocus: true }}
                name={'name'}
                error={(!!formProps.touched.name || formProps.submitCount > 0) ? formProps.errors.name : ''}
                value={formProps.values.name}
                onChange={name => formProps.setFieldValue('name', name)}
              />

              {!isNew && (
                <FormFieldMember
                  label={'Group Manager'}
                  name={'managers'}
                  placeholder={'Select manager'}
                  available={availableManagers}
                  selected={selectedManagers}
                  onChange={this.onChangeManager}
                />
              )}
            </>
          )}

          {!isNew && (
            <>
              <FormFieldMember
                isMulti
                label={'Group Members'}
                name={'members'}
                placeholder={'Select member'}
                available={availableMembers}
                selected={selectedMembers}
                onChange={this.onAddMember}
                onRemove={this.onRemoveMember}
                disableFunc={this.disableSelectedMember}
              />

              <FormFieldNumbers
                search={searchNumbers}
                searchNumbers={searchNumberList}
                searchLoading={searchNumberLoading}
                selected={numbersToOptions(formProps.values.numbers, role.numbers.map(i => i.id))}
                onRemove={id => formProps.setFieldValue('numbers', formProps.values.numbers.filter(i => i.id !== id))}
                label={'Source Numbers'}
                name={'numbers'}
                placeholder={'Enter source number'}
                value={formProps.values.numbers}
                onChange={numbers => formProps.setFieldValue('numbers', numbers)}
              />
            </>
          )}

          <FormFieldSubmit disabled={formProps.isSubmitting || !formProps.isValid}>
            Submit
          </FormFieldSubmit>
        </FormFrame>
      </div>
    )
  }

  private setFormProps = (formProps: FormikProps<TFormValues>, callback: Function) => {
    return callback(formProps)
  }

  private getCurrentRoleAccounts = (): TAccount[] => {
    const { role } = this.props
    return role.manager ? [role.manager, ...role.members] : [...role.members]
  }

  /**
   * should not be a manager of another group
   */
  private getAvailableManagers = (): TAccount[] => {
    const { role, members } = this.props
    return members
      .filter(i => !i.isAdmin)
      .filter(i => !i.group.id || i.group.id === role.id)
      .filter(i => !i.isManagerOfGroupId || i.isManagerOfGroupId === role.id)
  }

  private getAvailableMembers = (): TAccount[] => {
    const { role, members } = this.props
    if (this.formProps) {
      const formValues = this.formProps.values
      const selectedManagerIds = formValues.managers.map(i => i.id)
      const selectedMemberIds = formValues.members.map(i => i.id)
      const selectedIds = [...selectedManagerIds, ...selectedMemberIds]
      return members
        .filter(i => !i.isAdmin)
        .filter(i => !i.group.id || i.group.id === role.id)
        .filter(i => !selectedIds.includes(i.id))
    }
    return members
  }

  private getSelectedManagers = () => {
    return this.formProps ? this.formProps.values.managers : []
  }

  private getSelectedMembers = () => {
    if (this.formProps) {
      return uniqueByField([
        ...this.getSelectedManagers(),
        ...this.formProps.values.members,
      ], 'id')
    }
    return []
  }

  private onChangeManager = (id: number) => {
    const formProps = this.formProps
    if (formProps) {
      const selectedManagers = this.getSelectedManagers()
      const selectedManager = selectedManagers[0]
      const account = this.props.members.find(i => i.id === id)
      const managers = account ? [account] : []
      formProps.setFieldValue('managers', managers)
      this.onAddMember(id)

      const currentRoleAccountIds = this.getCurrentRoleAccounts().map(i => i.id)
      if (selectedManager && !currentRoleAccountIds.includes(selectedManager.id)) {
        this.onRemoveMember(selectedManager.id)
      }
    }
  }

  private onAddMember = (id: number) => {
    const formProps = this.formProps
    if (formProps) {
      const account = this.props.members.find(i => i.id === id)
      const members = [...formProps.values.members, account]
      formProps.setFieldValue('members', members)
    }
  }

  private onRemoveMember = (id: number) => {
    const formProps = this.formProps
    if (formProps) {
      const members = formProps.values.members.filter(i => i.id !== id)
      formProps.setFieldValue('members', members)
    }
  }

  private disableSelectedMember = (id: number) => {
    const disabledAccountIds = this.getDisabledAccounts().map(i => i.id)
    return disabledAccountIds.includes(id)
  }

  private getDisabledAccounts = () => {
    const currentRoleAccount = this.getCurrentRoleAccounts()
    const selectedManagers = this.getSelectedManagers()
    return [...currentRoleAccount, ...selectedManagers]
  }

  private submit = async (values: TFormValues, { setSubmitting }: TFormAction) => {
    const { role, onSuccess } = this.props
    const managerIds = values.managers.map(i => i.id)
    const memberIds = values.members.map(i => i.id)
    const numberIds = values.numbers.map(i => i.id)

    role.id
      ? await adminRoleService.update(role, values.name, managerIds, memberIds, numberIds)
      : await adminRoleService.create(values.name, managerIds, memberIds, numberIds)

    adminRoleService.loadRoles().then(onSuccess)

    setSubmitting(false)
  }

  private validate = (values: TFormValues) => {
    return getYupErrorsMap(
      values,
      yup.object().shape({
        name: yup.string().required(),
      })
    ) || {}
  }
}

const createInitialValues = (item: TAdminRole): TFormValues => {
  const managers = item.manager ? [item.manager] : []
  return deepClone({ ...formInitialValues, ...item, managers })
}

export function accountsToOptions(items: TAccount[], protectedIds: number[] = []) {
  return items.map(i => {
    const isDisabled = protectedIds.includes(i.id)
    return { isDisabled, value: i.id, label: i.profile.displayName }
  })
}

export function numbersToOptions(items: TAdminNumber[], protectedIds: number[] = []) {
  return items.map(i => {
    const isDisabled = protectedIds.includes(i.id)
    return { isDisabled, value: i['id'], label: `${i['number']}` }
  })
}

const mapStateToProps = (
  state: IState,
  ownProps: Omit<
    Props,
    | 'members'
    | 'searchNumbers'
    | 'searchNumberList'
    | 'searchNumberLoading'
    | 'currentAccountPermissions'
  >
): Props => ({
  ...ownProps,
  members: state.app.admin.members.list,
  searchNumbers: adminNumberSearchService.setSearchQuery,
  searchNumberList: state.app.admin.search.numbers.items,
  searchNumberLoading: state.app.admin.search.numbers.loading,
  currentAccountPermissions: accessSelector(state.app),
})

const NewGroupBoxFormConnected = connect(mapStateToProps)(GroupsBoxForm)
export { NewGroupBoxFormConnected as GroupsBoxForm }
