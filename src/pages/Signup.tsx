import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useAlert } from '@/contexts/AlertContext'
import { register as registerUser, resendConfirmationEmail, clearError } from '@/store/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isValidEmail, isValidPassword, passwordsMatch } from '@/helpers'

interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

export default function Signup() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { showAlert } = useAlert()

  const [step, setStep] = useState<'signup' | 'success'>('signup')
  const [userEmail, setUserEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>()

  const onSignupSubmit = async (data: SignupFormData) => {
    dispatch(clearError())
    const result = await dispatch(registerUser({ email: data.email, password: data.password }))
    if (registerUser.fulfilled.match(result)) {
      // Backend should send confirmation link to user's email
      setUserEmail(data.email)
      setStep('success')
    }
  }

  const handleResendLink = async () => {
    if (!userEmail) return

    dispatch(clearError())
    // Call backend API to resend confirmation email
    const result = await dispatch(resendConfirmationEmail({ email: userEmail }))
    if (resendConfirmationEmail.fulfilled.match(result)) {
      showAlert(t('auth.linkSent'), undefined, 'success')
    }
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.checkEmail')}</CardTitle>
            <CardDescription>
              {t('auth.confirmationLinkSent', { email: userEmail })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendLink}
                  className="text-sm underline"
                  disabled={isLoading}
                >
                  {t('auth.resendLink')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.createAccount')}</CardTitle>
          <CardDescription>{t('auth.enterEmailSignup')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSignupSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email', {
                  required: t('validation.emailRequired'),
                  validate: (value) => isValidEmail(value) || t('validation.emailInvalid'),
                })}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: t('validation.passwordRequired'),
                  validate: (value) => isValidPassword(value) || t('validation.passwordTooShort'),
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
              <Input
                id="confirm-password"
                type="password"
                {...register('confirmPassword', {
                  required: t('validation.confirmPasswordRequired'),
                  validate: (value) =>
                    passwordsMatch(value, watch('password')) || t('validation.passwordsMismatch'),
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="underline">
              {t('auth.login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
