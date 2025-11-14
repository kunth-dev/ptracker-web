import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useAlert } from '@/contexts/AlertContext'
import { register as registerUser, verifyEmail, resendVerificationCode, login, clearError } from '@/store/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { VALIDATION } from '@/constants'
import { isValidEmail, isValidPassword, isValidCode, passwordsMatch } from '@/helpers'

interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

interface VerifyFormData {
  otp: string
}

export default function Signup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { showAlert } = useAlert()

  const [step, setStep] = useState<'signup' | 'verify'>('signup')
  const [signupData, setSignupData] = useState<{ email: string; password: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>()

  const {
    control: verifyControl,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFormData>()

  const onSignupSubmit = async (data: SignupFormData) => {
    dispatch(clearError())
    setSignupData({ email: data.email, password: data.password })
    const result = await dispatch(registerUser({ email: data.email, password: data.password }))
    if (registerUser.fulfilled.match(result)) {
      // Backend should send OTP code to user's email
      setStep('verify')
    }
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    if (!signupData) return

    dispatch(clearError())
    // Verify the OTP code with the backend
    const result = await dispatch(verifyEmail({ email: signupData.email, code: data.otp }))
    if (verifyEmail.fulfilled.match(result)) {
      // After successful verification, login the user
      const loginResult = await dispatch(login(signupData))
      if (login.fulfilled.match(loginResult)) {
        navigate('/home')
      }
    }
  }

  const handleResendOTP = async () => {
    if (!signupData) return

    dispatch(clearError())
    // Call backend API to resend verification code
    const result = await dispatch(resendVerificationCode({ email: signupData.email }))
    if (resendVerificationCode.fulfilled.match(result)) {
      showAlert(t('auth.codeSent'), undefined, 'success')
    }
  }

  if (step === 'verify') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.verifyEmail')}</CardTitle>
            <CardDescription>
              {t('auth.enterCodeEmail', { email: signupData?.email })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifySubmit(onVerifySubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">{t('auth.verificationCode')}</Label>
                <div className="flex justify-center">
                  <Controller
                    name="otp"
                    control={verifyControl}
                    defaultValue=""
                    rules={{
                      required: t('validation.codeRequired'),
                      validate: (value) => isValidCode(value) || t('validation.codeInvalid'),
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
                <p className="text-xs text-muted-foreground text-center">
                  {t('auth.pleaseEnterCode')}
                </p>
                {verifyErrors.otp && (
                  <p className="text-sm text-destructive">{verifyErrors.otp.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.verifying') : t('auth.verifyEmail')}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm underline"
                  disabled={isLoading}
                >
                  {t('auth.resendCode')}
                </button>
              </div>
            </form>
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
