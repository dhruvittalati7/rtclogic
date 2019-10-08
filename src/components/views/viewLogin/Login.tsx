import * as React from 'react'
import * as yup from 'yup'
import memoizeOne from 'memoize-one'
import classNames from 'classnames'
import { Formik, FormikActions } from 'formik'
import { Field } from './form/Field'
import { ArrowIcon } from 'src/components/shared/ui/Icons'
import { Checkbox } from 'src/components/views/viewLogin/form/Checkbox'
import styles from './Login.module.scss'
import { Loader } from 'src/components/shared/ui/Loader'

const formInitialValues = {
  email: '',
  password: '',
  rememberMe: true,
  agree: false,
}

type TFormValues = typeof formInitialValues
type TFormAction = FormikActions<TFormValues>

interface Props {
  error: string
  onSubmit: (login: string, password: string, rememberMe: boolean) => void
}

interface State {
  formValues: TFormValues
  focus: 'email' | 'password'
}

export class LoginForm extends React.Component<Props, State> {
  public state: State = {
    formValues: formInitialValues,
    focus: 'email',
  }

  public validationScheme = memoizeOne(() => {
    return yup.object().shape({
      email: yup
        .string()
        .required('Please enter your login'),
      password: yup.string().required('Please enter your password'),
      agree: yup.boolean().required(),
      rememberMe: yup.boolean(),
    })
  })

  public submit = async (values: TFormValues, { setSubmitting }: TFormAction) => {
    await this.props.onSubmit(values.email, values.password, values.rememberMe)
    setSubmitting(false)
  }

  public render() {
    const { error } = this.props
    const { formValues } = this.state
    return (
      <Formik initialValues={formValues} isInitialValid validationSchema={this.validationScheme()} onSubmit={this.submit}>
        {formProps => (
          <form className={classNames(styles.root, styles.dark)} onSubmit={formProps.handleSubmit} noValidate>
            <div className={classNames(styles.error, error && styles.errorActive)}>{error}</div>

            <Field
              autoFocus
              className={styles.field}
              label="Login"
              name="email"
              value={formProps.values.email}
              error={(!!formProps.touched.email || formProps.submitCount > 0) && formProps.errors.email}
              onChange={formProps.handleChange}
              onFocus={() => this.setState({ focus: 'email' })}
              autocomplete={'username'}
            />
            <Field
              className={styles.field}
              label="Password"
              name="password"
              type="password"
              value={formProps.values.password}
              error={(!!formProps.touched.password || formProps.submitCount > 0) && formProps.errors.password}
              onChange={formProps.handleChange}
              onFocus={() => this.setState({ focus: 'password' })}
              autocomplete={'current-password'}
            />

            <Checkbox
              checked={formProps.values.rememberMe}
              onChange={checked => formProps.setFieldValue('rememberMe', checked)}
              classes={{ root: styles.rememberMe, block: styles.rememberBlock, tick: styles.rememberTick }}
            >
              Remember me
            </Checkbox>

            <button className={styles.button} type="submit">
              <div className={styles.buttonTitle}>
                {formProps.isSubmitting ? <Loader size={30} color={'#fff'} /> : 'Go'}
              </div>
              <div className={styles.buttonArrow}>
                <ArrowIcon width={35} height={16} />
              </div>
            </button>
          </form>
        )}
      </Formik>
    )
  }
}
