import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { login, forgotPassword, sendResetCode, resetPassword, clearError } from '@/store/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { VALIDATION } from '@/constants'
import { isValidEmail, isValidPassword, isValidCode, passwordsMatch } from '@/helpers'

interface LoginFormData {
  email: string
  password: string
}

interface ForgotPasswordFormData {
  email: string
}

interface ResetPasswordFormData {
  code: string
  newPassword: string
  confirmPassword: string
}

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>()

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordFormData>()

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    control,
    watch,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>()

  const onLoginSubmit = async (data: LoginFormData) => {
    dispatch(clearError())
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      navigate('/home')
    }
  }

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    dispatch(clearError())
    setResetEmail(data.email)
    const result = await dispatch(forgotPassword(data.email))
    if (forgotPassword.fulfilled.match(result)) {
      setShowOTPInput(true)
    }
  }

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    dispatch(clearError())
    const result = await dispatch(
      resetPassword({
        email: resetEmail,
        code: data.code,
        newPassword: data.newPassword,
      })
    )
    if (resetPassword.fulfilled.match(result)) {
      setShowForgotPassword(false)
      setShowOTPInput(false)
      setResetEmail('')
      alert(t('auth.passwordResetSuccess'))
    }
  }

  const handleResendResetCode = async () => {
    dispatch(clearError())
    // Call backend API to resend password reset code
    const result = await dispatch(sendResetCode(resetEmail))
    if (sendResetCode.fulfilled.match(result)) {
      alert(t('auth.codeSent'))
    }
  }

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.resetPassword')}</CardTitle>
            <CardDescription>
              {showOTPInput ? t('auth.enterCodeNewPassword') : t('auth.enterResetEmail')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOTPInput ? (
              <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t('auth.email')}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="m@example.com"
                    {...registerForgot('email', {
                      required: t('validation.emailRequired'),
                      validate: (value) => isValidEmail(value) || t('validation.emailInvalid'),
                    })}
                  />
                  {forgotErrors.email && (
                    <p className="text-sm text-destructive">{forgotErrors.email.message}</p>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? t('auth.sendingOTP') : t('auth.sendOTP')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false)
                      dispatch(clearError())
                    }}
                  >
                    {t('auth.cancel')}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit(onResetPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">{t('auth.verificationCode')}</Label>
                  <div className="flex justify-center">
                    <Controller
                      name="code"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: t('validation.codeRequired'),
                        validate: (value) =>
                          isValidCode(value) || t('validation.codeInvalid'),
                      }}
                      render={({ field }) => (
                        <InputOTP maxLength={VALIDATION.OTP_LENGTH} {...field}>
                          <InputOTPGroup>
                            {Array.from({ length: VALIDATION.OTP_LENGTH }).map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>
                  {resetErrors.code && (
                    <p className="text-sm text-destructive">{resetErrors.code.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('auth.newPassword')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...registerReset('newPassword', {
                      required: t('validation.passwordRequired'),
                      validate: (value) =>
                        isValidPassword(value) || t('validation.passwordTooShort'),
                    })}
                  />
                  {resetErrors.newPassword && (
                    <p className="text-sm text-destructive">{resetErrors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...registerReset('confirmPassword', {
                      required: t('validation.confirmPasswordRequired'),
                      validate: (value) =>
                        passwordsMatch(value, watch('newPassword')) ||
                        t('validation.passwordsMismatch'),
                    })}
                  />
                  {resetErrors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? t('auth.resetting') : t('auth.resetPassword')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOTPInput(false)
                      dispatch(clearError())
                    }}
                  >
                    {t('auth.back')}
                  </Button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendResetCode}
                    className="text-sm underline"
                    disabled={isLoading}
                  >
                    {t('auth.resendCode')}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.login')}</CardTitle>
          <CardDescription>{t('auth.enterEmail')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...registerLogin('email', {
                  required: t('validation.emailRequired'),
                  validate: (value) => isValidEmail(value) || t('validation.emailInvalid'),
                })}
              />
              {loginErrors.email && (
                <p className="text-sm text-destructive">{loginErrors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true)
                    dispatch(clearError())
                  }}
                  className="text-sm underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                {...registerLogin('password', {
                  required: t('validation.passwordRequired'),
                })}
              />
              {loginErrors.password && (
                <p className="text-sm text-destructive">{loginErrors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/signup" className="underline">
              {t('auth.signup')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
