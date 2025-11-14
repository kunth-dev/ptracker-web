import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { registerConfirmation, clearError } from '@/store/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterConfirmation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.auth)
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const confirmEmail = async () => {
      const uuid = searchParams.get('uuid')
      
      if (!uuid) {
        setStatus('error')
        return
      }

      dispatch(clearError())
      const result = await dispatch(registerConfirmation({ uuid }))
      
      if (registerConfirmation.fulfilled.match(result)) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    }

    confirmEmail()
  }, [searchParams, dispatch])

  const handleLoginClick = () => {
    navigate('/login')
  }

  if (status === 'verifying') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.verifying')}</CardTitle>
            <CardDescription>Please wait while we confirm your email...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.emailConfirmed')}</CardTitle>
            <CardDescription>You can now login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLoginClick} className="w-full">
              {t('auth.login')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.confirmationError')}</CardTitle>
          <CardDescription>
            {error || 'The confirmation link may be invalid or expired.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/signup">
            <Button className="w-full">{t('auth.back')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
